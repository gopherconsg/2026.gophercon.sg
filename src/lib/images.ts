export type ImageMap = Record<string, { default: ImageMetadata }>;

export const speakerImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/images/speakers/*.{jpg,jpeg,webp,png}",
  { eager: true },
);

export function resolveSpeakerImage(
  imageMap: ImageMap,
  filename: string,
): ImageMetadata {
  const key = `/src/assets/images/speakers/${filename}`;
  const img = imageMap[key];
  if (!img) throw new Error(`Speaker image not found: ${filename}`);
  return img.default;
}

export function findSpeakerImage(
  imageMap: ImageMap,
  filename: string,
): ImageMetadata | null {
  const key = `/src/assets/images/speakers/${filename}`;
  return imageMap[key]?.default ?? null;
}
