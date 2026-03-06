export interface Speaker {
  id: string;
  name: string;
  company?: string;
  image: string;
  description: string;
  topicTitle: string;
  topicLink: string;
  keynote?: boolean;
  socialUrl?: string;
}

export interface ScheduleSpeaker {
  name: string;
  link?: string;
  image?: string;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "talk" | "break" | "meta";
  recordingUrl?: string;
  speakers: ScheduleSpeaker[];
}

export interface Workshop {
  id: string;
  title: string;
  speaker: string;
  speakerLink: string;
  speakerImage: string;
  speakerBio: string;
  speakerSocialUrl?: string;
  description: string;
  prerequisites?: string;
  date: string;
  time: string;
  venue: string;
  venueRegistration?: string;
  venueMapUrl?: string;
  additional?: string;
}

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
}
