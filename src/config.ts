import type { EventStatus, SpeakerLineup } from "@/types";

export const siteConfig = {
  title: "GopherCon Singapore 2026",
  description:
    "GopherCon Singapore is a Go programming language (Golang) conference in Southeast Asia.",
  baseUrl: "https://2026.gophercon.sg/",
  ogImage: "gopherconsg202x-og.png",
  logo: "gopherconsg202x-long.png",
  eventStatus: "live" as EventStatus,
  speakerLineup: "unconfirmed" as SpeakerLineup,
  nav: [
    { title: "Workshops", link: "/workshops", enabled: true },
    { title: "Schedule", link: "/schedule", enabled: true },
    { title: "Speakers", link: "/speakers", enabled: true },
  ],
} as const;

export const isLive = siteConfig.eventStatus === "live";
export const isArchived = siteConfig.eventStatus === "archived";
export const isLineupConfirmed = siteConfig.speakerLineup === "confirmed";

export function isNavEnabled(link: string): boolean {
  const item = siteConfig.nav.find((n) => n.link === link);
  return item?.enabled ?? false;
}
