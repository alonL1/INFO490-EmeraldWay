"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "@/components/shared/status-pill";

type PreviewPill = {
  kind: "priority" | "status";
  label: string;
};

type PreviewItem = {
  href: string;
  id: string;
  pills?: PreviewPill[];
  subtitle: string;
  title: string;
};

type ProfileSection = {
  description: string;
  emptyText: string;
  href: string;
  items: PreviewItem[];
  title: string;
};

type ProfileSectionsProps = {
  sections: ProfileSection[];
};

export function ProfileSections({ sections }: ProfileSectionsProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((section, index) => [section.title, index === 0])),
  );

  return (
    <div className="grid gap-4">
      {sections.map((section) => {
        const isOpen = openSections[section.title] ?? false;

        return (
          <section
            key={section.title}
            className="rounded-[28px] border border-brand-forest/10 bg-white p-5 shadow-panel"
          >
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <Link href={section.href} className="group inline-flex items-center gap-2">
                  <h2 className="font-ui text-2xl font-black text-brand-teal transition group-hover:underline">
                    {section.title}
                  </h2>
                  <span className="font-ui text-sm font-bold text-brand-teal">
                    View
                  </span>
                </Link>
                <p className="mt-2 max-w-2xl font-body text-sm text-text-primary/70">
                  {section.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setOpenSections((current) => ({
                    ...current,
                    [section.title]: !isOpen,
                  }))
                }
                aria-expanded={isOpen}
                aria-controls={`${section.title}-panel`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border-accent text-brand-teal transition hover:bg-brand-cream"
              >
                <span
                  className={`text-lg transition ${isOpen ? "rotate-90" : ""}`}
                  aria-hidden="true"
                >
                  ›
                </span>
              </button>
            </div>

            {isOpen ? (
              <div
                id={`${section.title}-panel`}
                className="mt-5 grid gap-3 border-t border-brand-forest/10 pt-5"
              >
                {section.items.length > 0 ? (
                  section.items.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="rounded-[22px] border border-brand-forest/10 px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-panel"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-ui text-lg font-bold text-text-primary">
                            {item.title}
                          </h3>
                          <p className="mt-1 font-body text-sm text-text-primary/70">
                            {item.subtitle}
                          </p>
                        </div>
                        {item.pills && item.pills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {item.pills.map((pill) => (
                              <StatusPill
                                key={`${pill.kind}-${pill.label}`}
                                kind={pill.kind}
                                label={pill.label}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>{section.emptyText}</p>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
