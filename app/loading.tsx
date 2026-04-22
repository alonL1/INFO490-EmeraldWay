import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function AppLoading() {
  return (
    <main className="min-h-screen bg-surface-canvas px-4 py-16">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[28px] border border-brand-forest/10 bg-white px-8 py-10 text-center shadow-panel">
          <LoadingSpinner className="text-brand-teal" label="Loading page" />
          <div>
            <p className="font-ui text-lg font-black text-brand-teal">
              Loading
            </p>
            <p className="mt-2 font-body text-sm text-text-primary/70">
              Fetching the latest page data.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
