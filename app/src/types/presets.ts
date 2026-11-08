export interface HeaderFooterPreset {
  id: string;
  name: string;
  description: string;
  headerLeft: string;
  headerRight: string;
  footerLeft: string;
  footerRight: string;
  showPageNumbers: boolean;
}

export const HEADER_FOOTER_PRESETS: HeaderFooterPreset[] = [
  {
    id: 'corporate-default',
    name: 'Corporate Standard',
    description: 'Document title with confidential notice and dynamic page numbers.',
    headerLeft: '{title}',
    headerRight: '',
    footerLeft: '',
    footerRight: 'Page {page} of {totalPages}',
    showPageNumbers: true,
  },
  {
    id: 'executive-brief',
    name: 'Executive Briefing',
    description: 'Clean header with author date and minimalist pagination.',
    headerLeft: 'Executive Summary',
    headerRight: 'Q4 2026',
    footerLeft: 'Acme Corporation',
    footerRight: 'Page {page}',
    showPageNumbers: true,
  },
  {
    id: 'legal-formal',
    name: 'Legal & Compliance',
    description: 'Formal contract classification and strict retention tracking.',
    headerLeft: 'CONFIDENTIAL / PRIVILEGED',
    headerRight: 'Matter Ref: 2026-LEG-08',
    footerLeft: 'Subject to Non-Disclosure Agreement',
    footerRight: 'Page {page} of {totalPages}',
    showPageNumbers: true,
  },
  {
    id: 'academic-thesis',
    name: 'Academic & Research',
    description: 'Running author head on top with centered pagination below.',
    headerLeft: 'Running Head: Modern Desktop Frameworks',
    headerRight: '',
    footerLeft: '',
    footerRight: 'Page {page}',
    showPageNumbers: true,
  },
  {
    id: 'blank-clean',
    name: 'Blank / Minimal',
    description: 'No text headers or footers, pure distraction-free canvas.',
    headerLeft: '',
    headerRight: '',
    footerLeft: '',
    footerRight: '',
    showPageNumbers: false,
  },
];
