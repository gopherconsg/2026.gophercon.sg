import { marked } from "marked";

marked.use({ async: false });

export const md = (s: string) => marked.parse(s) as string;
export const mdInline = (s: string) => marked.parseInline(s) as string;
