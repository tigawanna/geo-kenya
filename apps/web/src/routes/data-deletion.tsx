import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { dataDeletionPolicy } from "@/content/data-deletion";
import { AppConfig } from "@/utils/system";
import { createFileRoute, notFound } from "@tanstack/react-router";

/**
 * Data deletion is DEV-only as a standalone legal page.
 * Signed-in users should use Account for self-serve waitlist + contribution controls.
 */
export const Route = createFileRoute("/data-deletion")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
  component: DataDeletionPage,
  head: () => ({
    meta: [
      { title: `Data Deletion · ${AppConfig.name}` },
      {
        name: "description",
        content: `How to request deletion of ${AppConfig.name} account, waitlist, and personal data. Prefer Account when signed in.`,
      },
    ],
  }),
});

function DataDeletionPage() {
  return (
    <LegalDocumentLayout
      title={dataDeletionPolicy.title}
      lastUpdated={dataDeletionPolicy.lastUpdated}
      intro={dataDeletionPolicy.intro}
      sections={dataDeletionPolicy.sections}
      currentPath="/data-deletion"
    />
  );
}
