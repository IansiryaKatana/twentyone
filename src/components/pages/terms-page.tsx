import { useMemo } from "react";
import { termsPage } from "@/data/content";
import { LegalDocumentPage, resolveLegalDoc } from "@/components/pages/legal-document-page";
import { useCmsContent } from "@/hooks/useCmsContent";

export function TermsPage() {
  const { marketingPages, siteSettings } = useCmsContent();

  const doc = useMemo(
    () => resolveLegalDoc(marketingPages.terms, termsPage, siteSettings.legal_controller),
    [marketingPages.terms, siteSettings.legal_controller],
  );

  return <LegalDocumentPage doc={doc} />;
}
