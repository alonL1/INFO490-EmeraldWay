# Seattle Bridge (Capstone Project)

Seattle Bridge is a moderated wishlist platform that helps connect people experiencing homelessness in Seattle with donors who want to provide direct, tangible support. Individuals create a profile through a partner organization (moderation + verification). They can post wishlist items (e.g., warm clothing, hygiene supplies, interview attire). Donors fulfill items, which are shipped to the partner organization for intake and distribution.

## Problem
People experiencing homelessness often need specific items quickly, while donors want a trustworthy way to help without risking privacy or fraud. Traditional donation channels can be hard to personalize, and direct peer-to-peer giving can be unsafe. Seattle Bridge aims to be a safe middle layer: verified recipients, moderated requests, and organizational distribution.

## Core Concept
- **Recipients**: Maintain an org-moderated profile and wishlist of needed items.
- **Donors**: Browse wishlists and fulfill item requests.
- **Partner Organization**: Moderates profiles and requests, receives shipments, and distributes items.

## Key Features (Planned)
- Recipient profiles with organization verification
- Wishlist creation with categories, sizes, and urgency
- Donor browsing + item pledging to prevent duplicate fulfillment
- Shipping/tracking submission by donors
- Organization intake dashboard (received → stored → distributed)
- Notifications and status tracking for each wishlist item
- Moderation queue and safety controls (flagging, audit logs)

## Roles & Permissions
- **Recipient**
  - Create/edit wishlist items (subject to org moderation)
  - View item status and distribution updates
- **Donor**
  - Browse recipients and wishlists
  - Pledge and fulfill items
  - Submit tracking/order confirmation
- **Organization Admin/Moderator**
  - Approve recipients and wishlist items
  - Manage intake and distribution
  - Resolve disputes and flags
  - View reporting/metrics

## Privacy & Safety Principles
- No recipient home addresses are ever shared with donors.
- Shipments go to the partner organization, not to recipients.
- Recipient information is minimized and moderated.
- Donor-to-recipient messaging is disabled by default (communication routes through the organization if needed).

## MVP Scope (Suggested)
1. Auth + role-based access (Recipient/Donor/Org Admin)
2. Recipient profile (minimal public fields) + verification status
3. Wishlist CRUD + moderation queue
4. Donor browse + pledge + mark fulfilled
5. Org intake/distribution status updates
6. Basic reporting (items requested/fulfilled, time-to-fulfill)

## Tech Stack (Fill In)
- Frontend:
- Backend/API:
- Database:
- Auth:
- File storage:
- Hosting/CI:

## Local Development (Fill In)
### Prerequisites
- Node.js:
- Package manager:
- Environment variables:

### Setup
1. Clone the repo
2. Install dependencies
3. Configure `.env`
4. Run database migrations (if applicable)
5. Start the dev server

## Data Model (High Level)
- **User**: role (donor/recipient/org_admin), auth identifiers
- **RecipientProfile**: public fields, verification status, org_id
- **WishlistItem**: title, category, size/notes, urgency, status
- **Pledge/Fulfillment**: donor_id, wishlist_item_id, tracking/status
- **Organization**: moderators, intake location, distribution notes
- **AuditLog/Flag**: moderation actions and safety reporting

## Success Metrics (Capstone Friendly)
- Time from request → pledge → intake → distribution
- % of wishlist items fulfilled
- Most requested categories
- Donor retention (repeat donors)
- Active recipients (with periodic check-ins)

## Roadmap
- Multi-organization support
- Need bundles (winter kit, hygiene kit, interview kit)
- Smarter matching/recommendations
- Retailer integrations for easier purchasing/tracking
- Advanced fraud detection + anomaly alerts

## Contributing
This is a capstone project. Contributions are welcome via issues and pull requests. Please follow the code style and add tests where possible.

## License
MIT
