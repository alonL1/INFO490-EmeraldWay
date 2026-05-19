export type MessageThreadRow = {
  id: string;
  donationId: string;
  donorId: string;
  organizationId: string;
  donorUnread: boolean;
  orgUnread: boolean;
  createdAt: string;
  // Joined display fields:
  counterpartyName: string;     // org_name for donor view, donor_display_name for org view
  listingTitle: string | null;  // listings(title) may be null if listing was deleted; UI must coalesce
  status: string;               // donation status, for the header pill
};

// `mapThreads` should coalesce listing title for display:
//   listingTitle: listing?.title ?? "Donation Request"
// kept as nullable at the type level so the source of truth is preserved.

export type MessageRow = {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  createdAt: string;
  deletedAt: string | null;
};
