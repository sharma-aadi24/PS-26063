// src/types/index.ts
export interface Expedition {
  id: number;
  title: string;
  year: number;
  region: string;
  duration: string;
  vessel: string;
  team: string[];
  objectives: string[];
  summary: string;
  routePoints: { lat: number; lng: number; label: string }[];
  datasetIds: number[];
  publicationIds: number[];
  mediaIds: number[];
}

export interface Station {
  id: number;
  name: string;
  region: string;
  lat: number;
  lng: number;
  country: string;
  established: number;
  researchAreas: string[];
  description: string;
  facilities: string[];
}

export interface Dataset {
  id: number;
  title: string;
  region: string;
  year: number;
  researchArea: string;
  format: string;
  size: string;
  doi: string;
  description: string;
  variables: string[];
  institution: string;
  license: string;
}

export interface Publication {
  id: number;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi: string;
  abstract: string;
  researchArea: string;
  region: string;
  expeditionId: number;
}

export interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  title: string;
  url: string;
  thumbnail: string;
  description: string;
  location: string;
  date: string;
  photographer: string;
  tags: string[];
  expeditionId: number;
}

export interface Article {
  id: number;
  title: string;
  category: string;
  region: string;
  summary: string;
  content: string;
  readingTime: number;
  tags: string[];
  relatedDatasetIds: number[];
  relatedPublicationIds: number[];
}

export interface OutreachItem {
  id: number;
  title: string;
  sourceType: string;
  sourceId: number;
  audience: string;
  contentType: string;
  generatedText: string;
  status: 'draft' | 'approved' | 'published';
}
