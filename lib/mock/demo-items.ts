import type { ItemRecord, ItemSummary } from "@/lib/types/item";

export const demoItemRecords: ItemRecord[] = [
  {
    id: "demo-sleeping-bags",
    title: "Sleeping Bags",
    organization: "Community Compass Shelter Network",
    imageSrc: "/items/sleeping-bags.png",
    imageAlt: "Sleeping bags stacked for donation",
    condition: "New or gently used",
    description:
      "Our outreach team needs durable sleeping bags for unsheltered adults during overnight cold-weather response.",
    itemType: "Cold Weather Gear",
    location: "Seattle, WA",
    priority: "High",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-childrens-jackets",
    title: "Children's Jackets",
    organization: "North Sound Family Services",
    imageSrc: "/items/childrens-jackets.png",
    imageAlt: "Children's jackets organized for donation",
    condition: "New or gently used",
    description:
      "We are stocking a family resource closet with youth winter jackets in sizes toddler through teen.",
    itemType: "Clothing",
    location: "Everett, WA",
    priority: "High",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-canned-soups",
    title: "Canned Soups",
    organization: "Rainier Mutual Aid Pantry",
    imageSrc: "/items/canned-soups.png",
    imageAlt: "Canned soups ready for pantry distribution",
    condition: "Unopened",
    description:
      "Shelf-stable soups help us build fast emergency meal kits for seniors and households facing food insecurity.",
    itemType: "Food",
    location: "Tacoma, WA",
    priority: "Medium",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-womens-socks",
    title: "Women's Socks",
    organization: "Southside Day Center",
    imageSrc: "/items/womens-socks.png",
    imageAlt: "Women's socks bundled for donation",
    condition: "New",
    description:
      "Clean socks are one of the most requested basic-needs items at our daytime hygiene and support center.",
    itemType: "Clothing",
    location: "Seattle, WA",
    priority: "Medium",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-blankets",
    title: "Blankets",
    organization: "Harbor Outreach Coalition",
    imageSrc: "/items/blankets.png",
    imageAlt: "Folded blankets prepared for distribution",
    condition: "New or freshly laundered",
    description:
      "We distribute blankets during evening street outreach and need more stock ahead of the next weather shift.",
    itemType: "Bedding",
    location: "Kent, WA",
    priority: "Critical",
    status: "Open",
    isDemo: true,
  },
  {
    id: "demo-rice-cooker",
    title: "Rice Cooker",
    organization: "Refugee Support Hub",
    imageSrc: "/items/rice-cooker.png",
    imageAlt: "Rice cooker requested for a family household",
    condition: "Working",
    description:
      "A newly housed family needs a basic rice cooker and small kitchen appliances as they settle into permanent housing.",
    itemType: "Kitchen Appliance",
    location: "Burien, WA",
    priority: "Low",
    status: "Open",
    isDemo: true,
  },
];

export const demoItemSummaries: ItemSummary[] = demoItemRecords.map(
  ({ id, title, organization, imageSrc, imageAlt, isDemo }) => ({
    id,
    title,
    organization,
    imageSrc,
    imageAlt,
    isDemo,
  }),
);

export function getDemoItemById(id: string) {
  return demoItemRecords.find((item) => item.id === id) ?? null;
}
