// Central site configuration — the one place to edit global identity, nav and
// contact details. (This is "chrome", edited in code, not through the CMS.)

export const site = {
  name: 'MGIRL',
  longName: 'Molecular Genetics of Insecticide Resistance Laboratory',
  tagline: 'Understanding insecticide resistance — and developing practical solutions through innovative research and collaboration.',
  institution: 'Department of Entomology, University of Agriculture Faisalabad',
  email: 'mgirl.ento@gmail.com',
  address:
    'Department of Entomology, Faculty of Agriculture, University of Agriculture Faisalabad, Pakistan',

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Research', href: '/research' },
    { label: 'People', href: '/people' },
    { label: 'Publications', href: '/publications' },
    { label: 'Projects', href: '/projects' },
    { label: 'News', href: '/news' },
    { label: 'Events', href: '/events' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ],

  // Rotating homepage hero slides. (Code-managed "chrome". Add an `image` path
  // to any slide later to show a background photo instead of the gradient.)
  heroSlides: [
    {
      eyebrow: 'Department of Entomology, University of Agriculture Faisalabad',
      title: 'Molecular Genetics of Insecticide Resistance Laboratory',
      text: 'Understanding insecticide resistance — and developing practical solutions through innovative research and collaboration.',
      ctaText: 'Explore our research',
      ctaHref: '/research',
      image: '',
    },
    {
      eyebrow: 'What we study',
      title: 'How insects resist — and how we respond',
      text: 'From molecular detoxification mechanisms to practical field resistance management.',
      ctaText: 'View publications',
      ctaHref: '/publications',
      image: '',
    },
    {
      eyebrow: 'Our team',
      title: 'Training the next generation of entomologists',
      text: 'Meet the researchers and scholars behind the lab and explore our projects.',
      ctaText: 'Meet the team',
      ctaHref: '/people',
      image: '',
    },
  ],

  research: [
    {
      title: 'Insect Resistance',
      body: 'The ability of certain insects to withstand insecticides or other control measures designed to manage them — how it arises, how it spreads, and how to detect it early.',
    },
    {
      title: 'Molecular Detoxification',
      body: 'The biochemical and genetic processes by which insects metabolise and eliminate toxic compounds — the enzymatic machinery that often underlies resistance.',
    },
    {
      title: 'Resistance Management',
      body: 'Strategies that prolong the effectiveness of pest-control tools, balancing crop protection with environmental and economic sustainability.',
    },
  ],

  externalLinks: [
    { label: 'IRAC', href: 'https://irac-online.org/', note: 'Insecticide Resistance Action Committee' },
    { label: 'ITIS', href: 'https://www.itis.gov/', note: 'Integrated Taxonomic Information System' },
    { label: 'CABI ISC', href: 'https://www.cabi.org/isc/', note: 'Invasive Species Compendium' },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
