// Informations globales du site — à personnaliser.
export const SITE_TITLE = 'Leo-Paul';
export const SITE_DESCRIPTION =
  'Site de Leo-Paul : présentation, services, réalisations et blog.';
export const SITE_LOCALE = 'fr_FR';

export const CONTACT = {
  email: 'contact@exemple.fr',
  phone: '', // ex. '06 00 00 00 00' — laisser vide pour masquer
  city: 'Ville, France',
};

// Laisser une URL vide pour masquer le lien
export const SOCIALS: { label: string; url: string }[] = [
  { label: 'Instagram', url: 'https://instagram.com/' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
];

export const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/services/', label: 'Services' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];

export const POSTS_PER_PAGE = 6;
