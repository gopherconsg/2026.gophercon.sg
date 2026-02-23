import type { EventStatus } from "@/types";

export const siteConfig = {
  title: "GopherCon Singapore 2026",
  description:
    "GopherCon Singapore is a Go programming language (Golang) conference in Southeast Asia.",
  baseUrl: "https://2026.gophercon.sg/",
  ogImage: "gopherconsg202x-og.png",
  logo: "gopherconsg202x-long.png",
  eventStatus: "upcoming" as EventStatus,
  nav: [
    { title: "Workshops", link: "/workshops" },
    { title: "Schedule", link: "/schedule" },
    { title: "Speakers", link: "/speakers" },
  ],
} as const;

export const isLive = siteConfig.eventStatus === "live";
export const isArchived = siteConfig.eventStatus === "archived";
