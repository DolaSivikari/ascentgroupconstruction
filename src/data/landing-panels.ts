export interface LandingPanelData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export const landingPanels: LandingPanelData[] = [
  {
    id: 'about',
    title: 'About Us',
    description: 'Discover our story, values, and commitment to building excellence',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
    link: '/about',
  },
  {
    id: 'services',
    title: 'Our Services',
    description: 'Comprehensive building envelope and restoration solutions',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070',
    link: '/services',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Explore our portfolio of successful restoration and construction projects',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031',
    link: '/projects',
  },
  {
    id: 'expertise',
    title: 'Expertise',
    description: '15+ years of specialized experience in building envelope systems',
    imageUrl: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?q=80&w=2069',
    link: '/services',
  },
];
