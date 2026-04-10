export type FilterKey =
  | "search"
  | "all"
  | "distance"
  | "priority"
  | "status"
  | "itemType";

export type FilterDefinition = {
  key: FilterKey;
  label: string;
};

