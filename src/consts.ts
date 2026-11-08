// Informations globales du site — à personnaliser.
export const SITE_TITLE = 'Leo-Paul';
export const SITE_TAGLINE = 'Blog sport';
export const SITE_DESCRIPTION =
  'Le blog sport de Leo-Paul : football, running, basket, tennis, fitness. Analyses, entraînements et récits.';
export const SITE_LOCALE = 'fr_FR';

export const CONTACT = {
  email: 'contact@exemple.fr',
  city: '', // ex. 'Lyon, France' — laisser vide pour masquer
};

// Laisser une URL vide pour masquer le lien
export const SOCIALS: { label: string; url: string }[] = [
  { label: 'Instagram', url: 'https://instagram.com/' },
  { label: 'Strava', url: 'https://www.strava.com/' },
  { label: 'YouTube', url: '' },
];

export const NAV = [
  { href: '/sports/', label: 'Sports' },
  { href: '/blog/', label: 'Articles' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' },
];

export const POSTS_PER_PAGE = 9;
