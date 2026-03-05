import contentRaw from "@/data/content.toml";
import scheduleRaw from "@/data/schedule.toml";
import speakersRaw from "@/data/speakers.toml";
import sponsorsRaw from "@/data/sponsors.toml";
import workshopsRaw from "@/data/workshops.toml";
import type {
  ContentData,
  ScheduleEntry,
  Speaker,
  SponsorsData,
  Workshop,
} from "@/types";

export const content = contentRaw as unknown as ContentData;
export const speakers =
  (speakersRaw as unknown as { speakers: Speaker[] }).speakers ?? [];
export const schedule =
  (scheduleRaw as unknown as { schedule: ScheduleEntry[] }).schedule ?? [];
export const sponsors = sponsorsRaw as unknown as SponsorsData;
export const workshops =
  (workshopsRaw as unknown as { workshops: Workshop[] }).workshops ?? [];
