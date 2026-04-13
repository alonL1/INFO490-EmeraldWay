export type Profile = {
  id: string
  org_name: string
  description: string | null
  location: string | null
  contact_email: string | null
  created_at: string
}

export type Listing = {
  id: string
  profile_id: string
  title: string
  description: string | null
  item_type: string | null
  condition: string | null
  location: string | null
  priority: string
  status: string
  image_url: string | null
  created_at: string
}

export type ListingWithProfile = Listing & {
  profiles: Pick<Profile, 'org_name'>
}
