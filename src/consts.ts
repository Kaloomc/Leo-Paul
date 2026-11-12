// Informations globales du site — à personnaliser.
export const SITE_TITLE = 'SportFlash';
export const SITE_TAGLINE = "L'actu sport";
export const SITE_DESCRIPTION =
  "SportFlash, l'actualité sportive : foot, cyclisme, sports auto, basket, tennis, rugby, sports US et plus.";
export const SITE_LOCALE = 'fr_FR';

export const CONTACT = {
  email: 'sportflash2025@gmail.com',
  city: '', // ex. 'Lyon, France' — laisser vide pour masquer
};

// Réseaux (icônes dans l'en-tête, le menu mobile, le pied de page et Contact).
// Laisser une URL vide pour masquer l'icône.
export const SOCIALS: { label: string; icon: 'instagram' | 'tiktok'; url: string }[] = [
  { label: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com/sport_.flash/' },
  { label: 'TikTok', icon: 'tiktok', url: 'https://www.tiktok.com/@sport..flash' },
];

export const NAV = [
  { href: '/sports/', label: 'Sports' },
  { href: '/blog/', label: 'Actu' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' },
];

export const POSTS_PER_PAGE = 9;
