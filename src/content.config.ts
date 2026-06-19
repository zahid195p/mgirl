import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * CONTENT MODEL — the "data layer" that admins edit through the CMS.
 *
 * Interlinking rule (the important one):
 *   A publication is stored ONCE and lists its lab authors via `labAuthors`
 *   (references to people). A person's page does NOT re-list papers by hand —
 *   it derives them by asking "which publications reference me?". So one paper
 *   shows up on every co-author's page with zero duplication.
 *
 * Files matching `_*.md` are ignored (handy for drafts).
 */

const md = (folder: string) =>
  glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${folder}` });

// People: PI, students, postdocs, staff, collaborators, alumni. Drives the "tree".
const people = defineCollection({
  loader: md('people'),
  schema: z.object({
    name: z.string(),
    role: z.string(),                 // free text shown under the name, e.g. "PhD Scholar"
    group: z
      .enum(['pi', 'postdoc', 'phd', 'msc', 'undergrad', 'staff', 'collaborator', 'alumni'])
      .default('msc'),               // controls grouping in the team "tree"
    order: z.number().default(100),   // lower = higher in its group
    status: z.enum(['current', 'alumni']).default('current'),
    title: z.string().optional(),     // e.g. "Assistant Professor"
    photo: z.string().optional(),     // /images/uploads/... (falls back to initials avatar)
    email: z.string().optional(),
    scholar: z.string().optional(),
    orcid: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    interests: z.array(z.string()).default([]),
    joined: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

// Publications: single source of truth, linked to people via `labAuthors`.
const publications = defineCollection({
  loader: md('publications'),
  schema: z.object({
    title: z.string(),
    authors: z.string(),              // full author line exactly as printed
    labAuthors: z.array(reference('people')).default([]),
    year: z.number(),
    journal: z.string().optional(),
    type: z
      .enum(['journal', 'conference', 'preprint', 'review', 'book-chapter', 'thesis'])
      .default('journal'),
    doi: z.string().optional(),
    url: z.string().optional(),       // link to the authentic journal / DOI page
    pdf: z.string().optional(),
    image: z.string().optional(),     // optional figure / graphical abstract
    featured: z.boolean().default(false),
  }),
});

// Projects: link a lead + members + related publications.
const projects = defineCollection({
  loader: md('projects'),
  schema: z.object({
    title: z.string(),
    status: z.enum(['ongoing', 'completed', 'planned']).default('ongoing'),
    summary: z.string().optional(),
    lead: reference('people').optional(),
    members: z.array(reference('people')).default([]),
    start: z.string().optional(),
    end: z.string().optional(),
    funding: z.string().optional(),
    image: z.string().optional(),
    relatedPublications: z.array(reference('publications')).default([]),
    featured: z.boolean().default(false),
  }),
});

// News / Announcements: `pinned` floats an item to the top of the homepage.
const news = defineCollection({
  loader: md('news'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z
      .enum(['announcement', 'event', 'finding', 'award', 'general'])
      .default('general'),
    pinned: z.boolean().default(false),
    summary: z.string().optional(),
    image: z.string().optional(),
  }),
});

// Events: conferences, seminars, presentations, defenses, visits.
const events = defineCollection({
  loader: md('events'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    end: z.coerce.date().optional(),
    type: z
      .enum(['conference', 'seminar', 'workshop', 'presentation', 'defense', 'visit'])
      .default('seminar'),
    location: z.string().optional(),
    link: z.string().optional(),
    presenters: z.array(reference('people')).default([]),
    summary: z.string().optional(),
  }),
});

// Gallery: photo albums. Each image may be left without a file for now — the
// page shows a labelled placeholder tile until the editor uploads the real one.
const gallery = defineCollection({
  loader: md('gallery'),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    cover: z.string().optional(),
    images: z
      .array(z.object({ image: z.string().optional(), caption: z.string().optional() }))
      .default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { people, publications, projects, news, events, gallery };
