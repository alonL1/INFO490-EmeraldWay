export type ItemSummary = {
  id: string;
  profileId: string;
  title: string;
  organization: string;
  imageSrc: string | null;
  imageAlt: string;
  location: string;
  priority: string;
  status: string;
  itemType: string;
};

export type ItemRecord = ItemSummary & {
  condition: string;
  description: string;
};

