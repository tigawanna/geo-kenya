import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { dataDeletionPolicy } from "@/content/data-deletion";
import { AppConfig } from "@/utils/system";
import { createFileRoute, notFound } from "@tanstack/react-router";

/**
 * Data deletion is DEV-only until account creation + a user dashboard exist.
 * Planned: signed-in users see waitlist email + synced contributions, can remove
 * the email, and can withdraw pending-review contributions (merged records stay).
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
        content: `How to request deletion of ${AppConfig.name} account, waitlist, and personal data.`,
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
