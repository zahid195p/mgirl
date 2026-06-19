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
