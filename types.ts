
export const videoCategories = [
  'General',
  'Gaming',
  'Challenge Video',
  'Vlog',
  'Tech Review',
  'Educational',
  'Music',
  'Comedy',
  'How-to & Style',
] as const;

export type VideoCategory = typeof videoCategories[number];

export interface ThumbnailFormData {
  textPrompt: string;
  category: VideoCategory;
  faceRefs: File[];
  bgRefs: File[];
  stylePrefs: string;
  brandPrefs: string;
  titleText: string;
}
