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
};

export type ItemRecord = ItemSummary & {
  condition: string;
  description: string;
  itemType: string;
};

