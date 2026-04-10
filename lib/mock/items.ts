import type { ItemRecord } from "@/lib/types/item";

export const featuredItems: ItemRecord[] = [
  {
    id: "womens-socks",
    title: "Women’s Socks",
    organization: "Mary’s Place",
    imageSrc: "/items/womens-socks.png",
    imageAlt: "Packaged women's socks arranged in stacks",
    itemType: "Clothing",
    condition: "New",
    location: "Seattle, WA",
    priority: "Medium",
    status: "Pending",
    description:
      "A bundled clothing request from Mary’s Place for warm women’s socks.",
  },
  {
    id: "canned-soups",
    title: "Canned Soups",
    organization: "Food Lifeline",
    imageSrc: "/items/canned-soups.png",
    imageAlt: "Stacks of canned soup on a shelf",
    itemType: "Food",
    condition: "Shelf stable",
    location: "Seattle, WA",
    priority: "Low",
    status: "Received",
    description:
      "A pantry restock request focused on canned soups for rapid food distribution.",
  },
  {
    id: "sleeping-bags",
    title: "Sleeping Bags",
    organization: "TreeHouse",
    imageSrc: "/items/sleeping-bags.png",
    imageAlt: "Sleeping bags laid out side by side",
    itemType: "Gear",
    condition: "New / Like New",
    location: "2100 24th Ave S, Suite 200, Seattle, WA 98144",
    priority: "High",
    status: "Not Received",
    description:
      "A high-priority request for sleeping bags to support emergency shelter transitions.",
  },
  {
    id: "blankets",
    title: "Blankets",
    organization: "United Way",
    imageSrc: "/items/blankets.png",
    imageAlt: "Folded blankets photographed from above",
    itemType: "Bedding",
    condition: "Gently used",
    location: "Seattle, WA",
    priority: "Medium",
    status: "Pending",
    description:
      "A seasonal request for blankets to support local community relief efforts.",
  },
  {
    id: "rice-cooker",
    title: "Rice Cooker",
    organization: "Mary’s Place",
    imageSrc: "/items/rice-cooker.png",
    imageAlt: "Open rice cooker with cooked rice inside",
    itemType: "Appliance",
    condition: "Working",
    location: "Seattle, WA",
    priority: "High",
    status: "Pending",
    description:
      "A kitchen equipment request for a functioning rice cooker to support meal prep.",
  },
  {
    id: "childrens-jackets",
    title: "Children’s Jackets",
    organization: "Solid Ground",
    imageSrc: "/items/childrens-jackets.png",
    imageAlt: "Colorful children's jackets hanging on a rack",
    itemType: "Clothing",
    condition: "Warm / seasonal",
    location: "Seattle, WA",
    priority: "Critical",
    status: "Pending",
    description:
      "A cold-weather request for children’s jackets with fast turnaround needs.",
  },
];

export const itemsById = Object.fromEntries(
  featuredItems.map((item) => [item.id, item]),
) satisfies Record<string, ItemRecord>;

