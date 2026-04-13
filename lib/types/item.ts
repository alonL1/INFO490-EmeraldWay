export type ItemSummary = {
  id: string;
  title: string;
  organization: string;
  imageSrc: string | null;
  imageAlt: string;
};

export type ItemRecord = ItemSummary & {
  condition: string;
  description: string;
  itemType: string;
  location: string;
  priority: string;
  status: string;
};

