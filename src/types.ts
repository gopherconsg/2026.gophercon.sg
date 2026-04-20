// ─────────────── Speakers ───────────────

export type SessionKind =
  | "keynote"
  | "talk"
  | "workshop"
  | "moderator"
  | "panelist";

export interface SpeakerSession {
  kind: SessionKind;
  title: string;
  description?: string;
  href: string;
}

export interface RawSpeakerSession {
  title: string;
  kind: SessionKind;
  description?: string;
}

export interface RawSpeaker {
  name: string;
  preferredName?: string;
  company?: string;
  image?: string;
  bio: string;
  url?: string;
  socialUrl?: string;
  sessions?: RawSpeakerSession[];
}

export interface Speaker extends RawSpeaker {
  id: string;
  sessions: SpeakerSession[];
  keynote: boolean;
  topicTitle?: string;
  topicLink?: string;
}

export interface SpeakersIndex {
  order?: string[];
}

// ─────────────── Schedule ───────────────

export type ScheduleEntryType =
  | "talk"
  | "keynote"
  | "break"
  | "meta"
  | "panel"
  | "lightning";

export interface LightningTalk {
  title: string;
  speaker: string;
  duration?: string;
}

export interface PanelistRef {
  id?: string;
  tba?: boolean;
  name?: string;
}

export interface RawScheduleEntry {
  id?: string;
  title?: string;
  description?: string;
  time?: string;
  type: ScheduleEntryType;
  recordingUrl?: string;
  speakers?: string[];
  moderator?: string;
  panelists?: PanelistRef[];
  talks?: LightningTalk[];
}

export interface ResolvedScheduleSpeaker {
  id: string;
  name: string;
  link: string;
  image: string | null;
  company?: string;
}

export interface ResolvedPanelist {
  id?: string;
  name: string;
  link?: string;
  image?: string | null;
  company?: string;
  tba: boolean;
}

export interface ScheduleEntry
  extends Omit<
    RawScheduleEntry,
    "id" | "title" | "speakers" | "moderator" | "panelists"
  > {
  id: string;
  title: string;
  speakers: ResolvedScheduleSpeaker[];
  moderator?: ResolvedScheduleSpeaker;
  panelists?: ResolvedPanelist[];
}

// ─────────────── Workshops ───────────────

export interface WorkshopTeamMember {
  name: string;
  image: string;
  bio: string;
}

export interface RawWorkshopInstructor {
  name: string;
  url?: string;
  image?: string;
  bio: string;
  socialUrl?: string;
}

export interface RawWorkshop {
  title: string;
  speakers?: string[];
  instructor?: RawWorkshopInstructor;
  date: string;
  time: string;
  venue: string;
  venueRegistration?: string;
  venueMapUrl?: string;
  note?: string;
  description: string;
  prerequisites?: string;
  teamMembers?: WorkshopTeamMember[];
}

export interface ResolvedInstructor {
  id: string;
  name: string;
  link: string;
  image: string | null;
  bio: string;
  socialUrl?: string;
}

export interface Workshop extends Omit<RawWorkshop, "speakers" | "instructor"> {
  id: string;
  instructors: ResolvedInstructor[];
  teamMembers: WorkshopTeamMember[];
}

export interface WorkshopsIndex {
  order?: string[];
}

// ─────────────── Sponsors / Content / Config ───────────────

export interface Sponsor {
  name: string;
  logo: string;
  url?: string;
}

export interface SponsorsData {
  platinum: Sponsor[];
  diversity: Sponsor[];
  gold: Sponsor[];
  workshop: Sponsor[];
}

export type EventStatus = "upcoming" | "live" | "archived";
export type SpeakerLineup = "confirmed" | "unconfirmed";

export interface ContentData {
  hero: {
    tagline: string;
    ctaText: string;
    ctaLink: string;
    previousYearText: string;
    previousYearVideoId: string;
    conferenceDate: string;
    workshopDates: string;
    workshopVenue: string;
    workshopVenueUrl: string;
    conferenceDates: string;
    conferenceVenue: string;
    conferenceVenueUrl: string;
    practicalInfo: string;
  };
  tickets: {
    headline: string;
    buttonText: string;
    link: string;
    titoEvent: string;
    scholarshipInfo: string;
    refundPolicy: string;
  };
  codeOfConduct: {
    content: string;
  };
  sponsors: {
    ctaText: string;
    sponsorshipPdfUrl?: string;
  };
  footer: {
    email: string;
    twitterURL: string;
    facebookURL: string;
    copyright: string;
    copyright1: string;
    copyright2: string;
    updatedDate: string;
  };
  newThisYear?: NewThisYearContent;
}

export interface NewThisYearItem {
  /** Emoji or short symbol shown before the item title. */
  icon?: string;
  /** Item heading (e.g. "Panel Discussion"). */
  title: string;
  /** Short description shown after an em-dash. */
  description?: string;
  /** Optional link target (absolute or hash like "/schedule#go-panel"). */
  href?: string;
}

export interface NewThisYearContent {
  /** Show or hide the banner entirely. Defaults to false when omitted. */
  enabled?: boolean;
  /** Pill label (defaults to "New this year"). */
  label?: string;
  /** Banner items. If empty/omitted, the banner is not rendered. */
  items?: NewThisYearItem[];
}
