import { PageShell } from '@/components/layout/page-shell'
import { AddItemForm } from '@/components/wishlist/add-item-form'

export default function NewListingPage() {
  return (
    <PageShell activeKey="home" variant="nonprofit">
      <AddItemForm />
    </PageShell>
  )
}
