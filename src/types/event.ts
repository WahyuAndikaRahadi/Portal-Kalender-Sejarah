export interface HistoricalEvent {
  slug: string;
  title: string;
  date: string;
  shortDescription: string;
  description: string;
  imageURL: string;
  galleryImages?: string[];
  category: string;
  tags: string[];
  quote: string;
}
