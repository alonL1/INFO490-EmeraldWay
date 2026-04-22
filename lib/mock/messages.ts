export type MessageThread = {
  id: string;
  name: string;
  preview: string;
  subtitle: string;
  unread?: boolean;
  messages: Array<{
    id: string;
    direction: "incoming" | "outgoing";
    text: string;
  }>;
};

export const donorThreads: MessageThread[] = [
  {
    id: "marys-place",
    name: "Mary's Place",
    subtitle: "Women's socks drop-off",
    preview: "We can receive those on Friday afternoon.",
    unread: true,
    messages: [
      {
        id: "d1",
        direction: "outgoing",
        text: "Hi, I can cover the sock request. What drop-off window works best?",
      },
      {
        id: "d2",
        direction: "incoming",
        text: "We can receive those on Friday afternoon at the main intake desk.",
      },
      {
        id: "d3",
        direction: "outgoing",
        text: "Perfect. I'll message again once I'm on the way.",
      },
    ],
  },
  {
    id: "treehouse",
    name: "TreeHouse",
    subtitle: "Sleeping bags request",
    preview: "Thank you for taking this one on.",
    messages: [
      {
        id: "d4",
        direction: "incoming",
        text: "Thank you for taking this one on.",
      },
      {
        id: "d5",
        direction: "outgoing",
        text: "Happy to help. I'm checking stock tonight and will confirm quantity.",
      },
    ],
  },
  {
    id: "food-lifeline",
    name: "Food Lifeline",
    subtitle: "Pantry staples",
    preview: "Canned soup is still our top need this week.",
    messages: [
      {
        id: "d6",
        direction: "incoming",
        text: "Canned soup is still our top need this week.",
      },
    ],
  },
];

export const organizationThreads: MessageThread[] = [
  {
    id: "amanda",
    name: "Amanda",
    subtitle: "Women's socks donation",
    preview: "I can drop them off tonight at 5 PM!",
    unread: true,
    messages: [
      {
        id: "o1",
        direction: "outgoing",
        text: "Any updates on when you can drop off those socks?",
      },
      {
        id: "o2",
        direction: "incoming",
        text: "I can drop them off tonight at 5 PM!",
      },
      {
        id: "o3",
        direction: "outgoing",
        text: "Perfect, thank you so much.",
      },
    ],
  },
  {
    id: "raizel",
    name: "Raizel",
    subtitle: "Rice cooker pledge",
    preview: "Thank you!",
    messages: [
      {
        id: "o4",
        direction: "incoming",
        text: "Thank you!",
      },
      {
        id: "o5",
        direction: "outgoing",
        text: "You're welcome. We will mark the item received once intake confirms it.",
      },
    ],
  },
  {
    id: "helen",
    name: "Helen",
    subtitle: "Blanket drop-off",
    preview: "I'll be at Maple around 7 PM.",
    messages: [
      {
        id: "o6",
        direction: "incoming",
        text: "I'll be at Maple around 7 PM.",
      },
    ],
  },
];
