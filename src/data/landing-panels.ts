export interface LandingPanelData {
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

export const landingPanels: LandingPanelData[] = [
  {
    id: 'welcome',
    title: 'WELCOME',
    subtitle: 'ASCENT RESTORATION & CONTRACTING',
    link: '/',
  },
  {
    id: 'about',
    title: 'ABOUT US',
    subtitle: 'Our Story & Values',
    link: '/about',
  },
  {
    id: 'services',
    title: 'OUR SERVICES',
    subtitle: 'Building Excellence',
    link: '/services',
  },
  {
    id: 'projects',
    title: 'OUR PROJECTS',
    subtitle: 'Portfolio of Success',
    link: '/projects',
  },
  {
    id: 'contact',
    title: 'CONTACT US',
    subtitle: 'Get in Touch',
    link: '/contact',
  },
];
