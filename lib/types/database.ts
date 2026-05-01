export type UserRole = {
  id: string;
  role: "donor" | "organization";
  created_at: string;
  updated_at: string;
};

export type OrganizationProfile = {
  id: string;
  org_name: string;
  description: string | null;
  location: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
};

export type DonorProfile = {
  id: string;
  full_name: string;
  bio: string | null;
  location: string | null;
  contact_email: string | null;
  focus_area: string | null;
  created_at: string;
  updated_at: string;
};

export type Listing = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  item_type: string | null;
  condition: string | null;
  location: string | null;
  priority: string;
  status: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type SavedListing = {
  id: string;
  donor_id: string;
  listing_id: string;
  created_at: string;
};

export type DonationStatus = "submitted" | "accepted" | "declined";

export type DonationRecord = {
  id: string;
  listing_id: string;
  donor_id: string;
  organization_id: string;
  donor_display_name: string;
  donor_email: string;
  message: string | null;
  preferred_dropoff_window: string | null;
  confirmation_code: string;
  status: DonationStatus;
  scheduled_for: string | null;
  organization_response: string | null;
  created_at: string;
  updated_at: string;
};

export type ListingWithProfile = Listing & {
  profiles: Pick<OrganizationProfile, "org_name">;
};
