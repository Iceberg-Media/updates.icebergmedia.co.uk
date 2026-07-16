import { localizedPath, t, defaultLocale, type Locale } from '@/i18n';

export interface NavItemOverride {
  label?: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  order: number;
  external?: boolean;
  labelKey?: string;
  locales?: Record<string, NavItemOverride>;
}

export interface LegalLink {
  label: string;
  href: string;
  external?: boolean;
  labelKey?: string;
  locales?: Record<string, NavItemOverride>;
}

export interface ResolvedNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const navItems: NavItem[] = [
  { label: 'Updates', href: '/', order: 0 },
  { label: 'Optimizations', href: 'https://icebergmedia.co.uk', order: 1, external: true },
  { label: 'Reviews', href: 'https://reviews.icebergmedia.co.uk', order: 2, external: true },
];

export const footerNavItems: NavItem[] = [
  { label: 'Updates', href: '/', order: 0 },
  { label: 'Optimizations', href: 'https://icebergmedia.co.uk', order: 1, external: true },
  { label: 'Reviews', href: 'https://reviews.icebergmedia.co.uk', order: 2, external: true },
];

export const legalLinks: LegalLink[] = [];

function isExternalOrAnchorHref(href: string): boolean {
  return (
    /^(https?:)?\/\//.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')
  );
}

export function resolveNavItem(item: NavItem | LegalLink, locale: Locale): ResolvedNavItem {
  const override = item.locales?.[locale];
  const label = override?.label ?? (item.labelKey ? t(item.labelKey, locale) : item.label);
  const rawHref = override?.href ?? item.href;
  const href =
    item.external || isExternalOrAnchorHref(rawHref) ? rawHref : localizedPath(rawHref, locale);
  return { label, href, external: item.external };
}

export function getNavItems(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return [...navItems]
    .sort((a, b) => a.order - b.order)
    .map((item) => resolveNavItem(item, locale));
}

export function getFooterNavItems(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return [...footerNavItems]
    .sort((a, b) => a.order - b.order)
    .map((item) => resolveNavItem(item, locale));
}

export function getLegalLinks(locale: Locale = defaultLocale): ResolvedNavItem[] {
  return legalLinks.map((item) => resolveNavItem(item, locale));
}

export function getLogoHref(locale: Locale = defaultLocale): string {
  return localizedPath('/', locale);
}
