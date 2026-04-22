import Link from "next/link";
import { createListing } from "@/app/wishlist/actions";

type ListingFormValues = {
  condition?: string | null;
  description?: string | null;
  id?: string;
  image_url?: string | null;
  item_type?: string | null;
  location?: string | null;
  priority?: string | null;
  status?: string | null;
  title?: string | null;
};

type AddItemFormProps = {
  action?: (formData: FormData) => void | Promise<void>;
  cancelHref?: string;
  description?: string;
  heading?: string;
  initialValues?: ListingFormValues;
  submitLabel?: string;
};

export function AddItemForm({
  action = createListing,
  cancelHref = "/wishlist",
  description = "Create or update a request using the same clean item-management layout.",
  heading = "Add Wishlist Item",
  initialValues,
  submitLabel = "Confirm Item",
}: AddItemFormProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-[28px] border border-brand-forest/10 bg-white p-8 shadow-panel">
      <div className="mb-8">
        <p className="section-eyebrow">Wishlist Management</p>
        <h2 className="font-ui text-2xl font-black text-brand-teal">{heading}</h2>
        <p className="mt-2 max-w-2xl font-body text-sm text-text-primary/70">{description}</p>
      </div>

      <form action={action} className="grid gap-5">
        {initialValues?.id ? (
          <input type="hidden" name="listingId" value={initialValues.id} />
        ) : null}

        <div>
          <label htmlFor="title" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Item Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initialValues?.title ?? ""}
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initialValues?.description ?? ""}
            className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="item_type" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Item Type
            </label>
            <input
              id="item_type"
              name="item_type"
              type="text"
              defaultValue={initialValues?.item_type ?? ""}
              placeholder="e.g. Clothing, Food, Gear"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="condition" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Condition
            </label>
            <input
              id="condition"
              name="condition"
              type="text"
              defaultValue={initialValues?.condition ?? ""}
              placeholder="e.g. New, Gently Used"
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={initialValues?.location ?? ""}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>

          <div>
            <label htmlFor="priority" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue={initialValues?.priority ?? "Medium"}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={initialValues?.status ?? "Open"}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>

          <div>
            <label htmlFor="image_url" className="mb-2 block font-ui text-sm font-black uppercase tracking-wide text-brand-teal">
              Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="text"
              defaultValue={initialValues?.image_url ?? ""}
              className="w-full rounded-[14px] border border-brand-forest/15 px-4 py-3 font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-brand-forest px-6 py-3 font-ui text-sm font-bold text-brand-cream"
          >
            {submitLabel}
          </button>
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-full border border-border-accent px-6 py-3 font-ui text-sm font-bold text-brand-teal"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
