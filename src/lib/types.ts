export type LinkType = "interest" | "contact" | "org" | "other";

export type ProfileLink = {
  id: string;
  title: string;
  url: string;
  comment?: string;
  thumbnailUrl?: string;
  type: LinkType;
  order: number;
};

export type ProfilePage = {
  id: string;
  title: string;
  slug: string;
  displayName: string;
  bio?: string;
  links: ProfileLink[];
  isDefault: boolean;
  updatedAt: string;
  createdAt: string;
};

export type SavedPerson = {
  id: string;
  sourcePageId: string;
  displayName: string;
  customName: string;
  note: string;
  tags: string[];
  /** YYYY-MM-DD */
  savedOn: string;
  savedAt: string;
  metPlaceAuto?: string;
  metPlaceManual: string;
  facePhotoDataUrl?: string;
  snapshot: {
    title: string;
    displayName: string;
    bio?: string;
    links: ProfileLink[];
  };
};

export type AppData = {
  pages: ProfilePage[];
  activePageId: string | null;
  savedPeople: SavedPerson[];
};
