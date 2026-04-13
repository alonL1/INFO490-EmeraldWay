'use client'
import { createListing } from '@/app/wishlist/actions'

export function AddItemForm() {
  return (
    <div className="max-w-2xl mx-auto rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <h2 className="font-ui text-2xl font-black text-brand-teal mb-6">Add Wishlist Item</h2>

      <form action={createListing} className="grid gap-5">
        {/* Title — full width */}
        <div>
          <label htmlFor="title" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
            Item Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        {/* Description — full width */}
        <div>
          <label htmlFor="description" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        {/* Smaller fields in a 2-col grid */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="item_type" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
              Item Type
            </label>
            <input
              id="item_type"
              name="item_type"
              type="text"
              placeholder="e.g. Clothing, Food, Gear"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="condition" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
              Condition
            </label>
            <input
              id="condition"
              name="condition"
              type="text"
              placeholder="e.g. New, Gently Used"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="location" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="priority" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="Medium"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Image URL — full width */}
        <div>
          <label htmlFor="image_url" className="font-ui text-sm font-black uppercase tracking-wide text-brand-teal mb-2 block">
            Image URL (optional)
          </label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            Add to Wishlist
          </button>
        </div>
      </form>
    </div>
  )
}
