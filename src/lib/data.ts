import contentRaw from "@/data/content.toml";
import scheduleRaw from "@/data/schedule.toml";
import speakersIndexRaw from "@/data/speakers.toml";
import sponsorsRaw from "@/data/sponsors.toml";
import workshopsIndexRaw from "@/data/workshops.toml";
import type {
  ContentData,
  PanelistRef,
  RawScheduleEntry,
  RawSpeaker,
  RawSpeakerSession,
  RawWorkshop,
  ResolvedInstructor,
  ResolvedPanelist,
  ResolvedScheduleSpeaker,
  ScheduleEntry,
  ScheduleEntryType,
  Speaker,
  SpeakerSession,
  SpeakersIndex,
  SponsorsData,
  Workshop,
  WorkshopsIndex,
} from "@/types";

// ─────────────── Raw inputs ───────────────

export const content = contentRaw as unknown as ContentData;
export const sponsors = sponsorsRaw as unknown as SponsorsData;

const speakersIndex = speakersIndexRaw as unknown as SpeakersIndex;

const rawScheduleEntries =
  (scheduleRaw as unknown as { schedule?: RawScheduleEntry[] }).schedule ?? [];

const workshopsIndex = workshopsIndexRaw as unknown as WorkshopsIndex;

// Glob every per-workshop TOML file.
// Derive ID from filename: "/src/data/workshops/tinygo-keeb.toml" → "tinygo-keeb"
function idFromPath(path: string): string {
  const parts = path.split("/");
  return (parts[parts.length - 1] ?? "").replace(/\.toml$/, "");
}

const workshopFiles = import.meta.glob<{ default: RawWorkshop }>(
  "/src/data/workshops/*.toml",
  { eager: true },
);

const rawWorkshopsById: Record<string, RawWorkshop> = {};
for (const [path, mod] of Object.entries(workshopFiles)) {
  const w = mod.default;
  if (!w) continue;
  rawWorkshopsById[idFromPath(path)] = w;
}

// Glob every per-speaker TOML file. vite-plugin-toml returns the parsed table
// as the module's default export.
const speakerFiles = import.meta.glob<{ default: RawSpeaker }>(
  "/src/data/speakers/*.toml",
  { eager: true },
);

const rawSpeakers: Record<string, RawSpeaker> = {};
for (const [path, mod] of Object.entries(speakerFiles)) {
  const s = mod.default;
  if (!s) continue;
  rawSpeakers[idFromPath(path)] = s;
}

// ─────────────── Resolve TOML-defined session → href ───────────────

function resolveSessionHref(
  speakerId: string,
  session: RawSpeakerSession,
): string {
  const candidates: string[] = [];

  for (const entry of rawScheduleEntries) {
    // Derive the entry's anchor ID the same way resolveEntry does
    const entryId = entry.id ?? (entry.speakers ?? [])[0] ?? "";
    const href = `/schedule#${entryId}`;
    if (
      (session.kind === "moderator" &&
        entry.type === "panel" &&
        entry.moderator === speakerId) ||
      (session.kind === "panelist" &&
        entry.type === "panel" &&
        entry.panelists?.some((p) => p.id === speakerId))
    ) {
      // Panels always have explicit titles
      if (entry.title === session.title) return href;
      candidates.push(href);
    } else if (
      entry.type === session.kind &&
      entry.speakers?.includes(speakerId)
    ) {
      // For talks/keynotes: match by title if present, otherwise by speaker+type
      if (entry.title && entry.title === session.title) return href;
      if (!entry.title) return href;
      candidates.push(href);
    }
  }

  if (session.kind === "workshop") {
    for (const [wId, w] of Object.entries(rawWorkshopsById)) {
      if (w.speakers?.includes(speakerId)) {
        const href = `/workshops#${wId}`;
        if (w.title === session.title) return href;
        candidates.push(href);
      }
    }
  }

  const fallback = `/speakers#${speakerId}`;
  if (candidates.length === 0 && import.meta.env.DEV) {
    console.warn(
      `resolveSessionHref: no schedule/workshop match for speaker "${speakerId}" session "${session.title}" (${session.kind})`,
    );
  }
  return candidates[0] ?? fallback;
}

// Pick the session to surface on landing card + profile header.
const PRIMARY_PRIORITY: SpeakerSession["kind"][] = [
  "keynote",
  "talk",
  "moderator",
  "panelist",
  "workshop",
];

function primarySession(
  sessions: SpeakerSession[],
): SpeakerSession | undefined {
  for (const kind of PRIMARY_PRIORITY) {
    const s = sessions.find((x) => x.kind === kind);
    if (s) return s;
  }
  return sessions[0];
}

function enrich(id: string, r: RawSpeaker): Speaker {
  const sessions: SpeakerSession[] = (r.sessions ?? []).map((s) => ({
    kind: s.kind,
    title: s.title,
    description: s.description,
    href: resolveSessionHref(id, s),
  }));
  const primary = primarySession(sessions);
  return {
    ...r,
    id,
    sessions,
    keynote: sessions.some((s) => s.kind === "keynote"),
    topicTitle: primary?.title,
    topicLink: primary?.href,
  };
}

// ─────────────── Speaker ordering ───────────────

function orderSpeakers(): Speaker[] {
  const enriched = Object.entries(rawSpeakers).map(([id, raw]) =>
    enrich(id, raw),
  );
  const byId = new Map(enriched.map((s) => [s.id, s]));
  const order = speakersIndex.order ?? [];

  if (order.length === 0) {
    return enriched.sort((a, b) => a.name.localeCompare(b.name));
  }

  const result: Speaker[] = [];
  for (const id of order) {
    const s = byId.get(id);
    if (s) {
      result.push(s);
      byId.delete(id);
    }
  }
  // Append any speakers not listed in `order`, alphabetically.
  const remaining = [...byId.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return [...result, ...remaining];
}

export const speakers: Speaker[] = orderSpeakers();
export const speakersById: Record<string, Speaker> = Object.fromEntries(
  speakers.map((s) => [s.id, s]),
);

// ─────────────── Resolve schedule entries ───────────────

function resolveSpeakerRef(id: string): ResolvedScheduleSpeaker | null {
  const s = speakersById[id];
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    link: `/speakers#${s.id}`,
    image: s.image ?? null,
    company: s.company,
  };
}

function resolvePanelist(p: PanelistRef): ResolvedPanelist {
  if (p.tba) {
    return {
      tba: true,
      name: p.name ?? "To be announced",
    };
  }
  if (p.id) {
    const s = speakersById[p.id];
    if (s) {
      return {
        id: s.id,
        name: p.name ?? s.name,
        link: `/speakers#${s.id}`,
        image: s.image ?? null,
        company: s.company,
        tba: false,
      };
    }
  }
  return { name: p.name ?? "To be announced", tba: true };
}

// For talk/keynote entries with speakers, look up the speaker's [[sessions]]
// block to resolve missing id, title, and description.
function findSpeakerSession(
  speakerIds: string[],
  entryType: ScheduleEntryType,
  entryTitle?: string,
): RawSpeakerSession | undefined {
  for (const id of speakerIds) {
    const s = rawSpeakers[id];
    if (!s?.sessions) continue;
    // If title is given, match exactly; otherwise match by kind ↔ type
    const match = entryTitle
      ? s.sessions.find((sess) => sess.title === entryTitle)
      : s.sessions.find((sess) => sess.kind === entryType);
    if (match) return match;
  }
  return undefined;
}

function resolveEntry(raw: RawScheduleEntry): ScheduleEntry {
  const speakerIds = raw.speakers ?? [];

  const resolvedSpeakers: ResolvedScheduleSpeaker[] = [];
  for (const id of speakerIds) {
    const r = resolveSpeakerRef(id);
    if (r) resolvedSpeakers.push(r);
  }
  const moderator = raw.moderator
    ? (resolveSpeakerRef(raw.moderator) ?? undefined)
    : undefined;
  const panelists = raw.panelists?.map(resolvePanelist);

  // Auto-resolve id, title, description from speaker sessions
  const session =
    speakerIds.length > 0
      ? findSpeakerSession(speakerIds, raw.type, raw.title)
      : undefined;

  const id = raw.id ?? speakerIds[0] ?? "";
  const title = raw.title ?? session?.title ?? "";
  const description = raw.description ?? session?.description;

  return {
    id,
    title,
    description,
    time: raw.time,
    type: raw.type,
    recordingUrl: raw.recordingUrl,
    speakers: resolvedSpeakers,
    moderator,
    panelists,
    talks: raw.talks,
  };
}

export const schedule: ScheduleEntry[] = rawScheduleEntries.map(resolveEntry);

/** Whether any schedule entry has a time — drives untimed-mode rendering. */
export const scheduleHasAnyTime: boolean = schedule.some(
  (e) => typeof e.time === "string" && e.time.trim() !== "",
);

// ─────────────── Resolve workshops ───────────────

function resolveInstructor(id: string): ResolvedInstructor | null {
  const s = speakersById[id];
  if (!s) return null;
  return {
    id: s.id,
    name: s.name,
    link: `/speakers#${s.id}`,
    image: s.image ?? null,
    bio: s.bio,
    socialUrl: s.socialUrl,
  };
}

function resolveInstructors(
  workshopId: string,
  w: RawWorkshop,
): ResolvedInstructor[] {
  // Reference-based: look up conference speakers by ID
  if (w.speakers && w.speakers.length > 0) {
    return w.speakers
      .map(resolveInstructor)
      .filter((x): x is ResolvedInstructor => x !== null);
  }
  // Inline instructor embedded in the workshop file
  if (w.instructor) {
    const ins = w.instructor;
    return [
      {
        id: workshopId,
        name: ins.name,
        link: ins.url ?? `/workshops#${workshopId}`,
        image: ins.image ?? null,
        bio: ins.bio,
        socialUrl: ins.socialUrl,
      },
    ];
  }
  return [];
}

function orderWorkshops(): Workshop[] {
  const resolved: Workshop[] = Object.entries(rawWorkshopsById).map(
    ([id, w]) => ({
      id,
      title: w.title,
      date: w.date,
      time: w.time,
      venue: w.venue,
      venueRegistration: w.venueRegistration,
      venueMapUrl: w.venueMapUrl,
      note: w.note,
      description: w.description,
      prerequisites: w.prerequisites,
      instructors: resolveInstructors(id, w),
      teamMembers: w.teamMembers ?? [],
    }),
  );

  const byId = new Map(resolved.map((w) => [w.id, w]));
  const order = workshopsIndex.order ?? [];
  if (order.length === 0) return resolved;

  const result: Workshop[] = [];
  for (const id of order) {
    const w = byId.get(id);
    if (w) {
      result.push(w);
      byId.delete(id);
    }
  }
  return [...result, ...byId.values()];
}

export const workshops: Workshop[] = orderWorkshops();

// ─────────────── Build-time validation ───────────────

function validateRefs(): void {
  const errors: string[] = [];
  const speakerIds = new Set(Object.keys(rawSpeakers));
  const workshopIds = new Set(Object.keys(rawWorkshopsById));

  // ── Shape validation for critical TOML data ──
  if (!content.hero?.tagline) errors.push("content.toml: missing hero.tagline");
  if (!content.hero?.conferenceDate)
    errors.push("content.toml: missing hero.conferenceDate");
  if (!content.tickets?.headline)
    errors.push("content.toml: missing tickets.headline");
  if (!content.footer?.copyright)
    errors.push("content.toml: missing footer.copyright");

  for (const [id, raw] of Object.entries(rawSpeakers)) {
    if (!raw.name) errors.push(`speaker "${id}": missing name`);
    if (!raw.bio) errors.push(`speaker "${id}": missing bio`);
  }

  for (const [id, w] of Object.entries(rawWorkshopsById)) {
    if (!w.title) errors.push(`workshop "${id}": missing title`);
    if (!w.description) errors.push(`workshop "${id}": missing description`);
  }

  // Check schedule entry ID uniqueness (using resolved IDs)
  const seenScheduleIds = new Set<string>();
  for (const entry of rawScheduleEntries) {
    const resolvedId = entry.id ?? (entry.speakers ?? [])[0] ?? "";
    if (seenScheduleIds.has(resolvedId)) {
      errors.push(`schedule.toml: duplicate resolved id "${resolvedId}"`);
    }
    seenScheduleIds.add(resolvedId);
  }

  // Validate that talk/keynote entries without titles can resolve from speakers
  for (const entry of rawScheduleEntries) {
    if (!entry.title && (entry.speakers ?? []).length > 0) {
      const session = findSpeakerSession(
        entry.speakers ?? [],
        entry.type,
        undefined,
      );
      if (!session) {
        const label = entry.id ?? (entry.speakers ?? [])[0] ?? "unknown";
        errors.push(
          `schedule.toml entry "${label}": no title and no matching speaker session for type "${entry.type}"`,
        );
      }
    }
  }

  // Build set of speaker IDs referenced in schedule entries (for session cross-ref)
  const scheduleSpeakerRefs = new Set<string>();
  for (const entry of rawScheduleEntries) {
    for (const sid of entry.speakers ?? []) scheduleSpeakerRefs.add(sid);
    if (entry.moderator) scheduleSpeakerRefs.add(entry.moderator);
    for (const p of entry.panelists ?? []) {
      if (p.id) scheduleSpeakerRefs.add(p.id);
    }
  }

  // Build set of schedule/workshop titles for entries that have explicit titles
  const scheduleTitles = new Set(
    rawScheduleEntries.filter((e) => e.title).map((e) => e.title as string),
  );
  const workshopTitles = new Set(
    Object.values(rawWorkshopsById).map((w) => w.title),
  );

  // Check speakers.toml order references
  for (const id of speakersIndex.order ?? []) {
    if (!speakerIds.has(id))
      errors.push(`speakers.toml order: "${id}" has no matching TOML file`);
  }

  // Check workshops.toml order references
  for (const id of workshopsIndex.order ?? []) {
    if (!workshopIds.has(id))
      errors.push(`workshops.toml order: "${id}" has no matching TOML file`);
  }

  // Check schedule speaker/moderator/panelist references
  for (const entry of rawScheduleEntries) {
    const label = entry.id ?? (entry.speakers ?? [])[0] ?? "unknown";
    for (const sid of entry.speakers ?? []) {
      if (!speakerIds.has(sid))
        errors.push(
          `schedule.toml entry "${label}": speaker "${sid}" not found`,
        );
    }
    if (entry.moderator && !speakerIds.has(entry.moderator)) {
      errors.push(
        `schedule.toml entry "${label}": moderator "${entry.moderator}" not found`,
      );
    }
    for (const p of entry.panelists ?? []) {
      if (!p.tba && !p.id) {
        errors.push(
          `schedule.toml entry "${label}": panelist has neither id nor tba`,
        );
      } else if (!p.tba && p.id && !speakerIds.has(p.id)) {
        errors.push(
          `schedule.toml entry "${label}": panelist "${p.id}" not found`,
        );
      }
    }
  }

  // Check workshop speaker references
  for (const [wId, w] of Object.entries(rawWorkshopsById)) {
    for (const sid of w.speakers ?? []) {
      if (!speakerIds.has(sid))
        errors.push(
          `workshop "${wId}": speaker "${sid}" not found in speakers/`,
        );
    }
  }

  // Cross-check speaker [[sessions]] resolve to schedule/workshop entries
  for (const [id, raw] of Object.entries(rawSpeakers)) {
    for (const session of raw.sessions ?? []) {
      if (session.kind === "workshop") {
        // Workshop sessions must match a workshop title
        if (!workshopTitles.has(session.title)) {
          errors.push(
            `speaker "${id}": session "${session.title}" (workshop) does not match any workshop title`,
          );
        }
      } else if (session.kind === "moderator" || session.kind === "panelist") {
        // Panel sessions must match a schedule entry title
        if (!scheduleTitles.has(session.title)) {
          errors.push(
            `speaker "${id}": session "${session.title}" (${session.kind}) does not match any panel title`,
          );
        }
      } else {
        // Talk/keynote: speaker must be referenced in a schedule entry
        if (!scheduleSpeakerRefs.has(id)) {
          errors.push(
            `speaker "${id}": session "${session.title}" (${session.kind}) — speaker not referenced in any schedule entry`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    const msg = `\n⚠️  Data reference errors (${errors.length}):\n${errors.map((e) => `  • ${e}`).join("\n")}\n`;
    if (import.meta.env.PROD) {
      throw new Error(msg);
    }
    console.warn(msg);
  }
}

validateRefs();
