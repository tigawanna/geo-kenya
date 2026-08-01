import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import { dataDeletionPolicy } from "@/content/data-deletion";
import { AppConfig } from "@/utils/system";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data-deletion")({
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
