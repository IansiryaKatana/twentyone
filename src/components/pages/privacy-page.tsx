import { useMemo } from "react";
import { privacyPage } from "@/data/content";
import { LegalDocumentPage, resolveLegalDoc } from "@/components/pages/legal-document-page";
import { useCmsContent } from "@/hooks/useCmsContent";

export function PrivacyPage() {
  const { marketingPages, siteSettings } = useCmsContent();

  const doc = useMemo(
    () => resolveLegalDoc(marketingPages.privacy, privacyPage, siteSettings.legal_controller),
    [marketingPages.privacy, siteSettings.legal_controller],
  );

  return <LegalDocumentPage doc={doc} />;
}
