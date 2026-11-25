export type RouteId = 'empleo' | 'clientes' | 'personal';
export type SectionId = 'projects' | 'services' | 'process' | 'about' | 'experience' | 'contact';

export interface Route {
  id: RouteId;
  planet: 'mars' | 'earth' | 'saturn';
  title: string;
  summary: string;
  intro: string;
  order: SectionId[];
}

export const defaultOrder: SectionId[] = ['projects', 'services', 'process', 'about', 'experience', 'contact'];

export const routes: Route[] = [
  {
    id: 'empleo', planet: 'mars', title: 'Empleo',
    summary: 'Full-stack Go y React, experiencia y CV',
    intro: 'Primero, mi trayectoria y los proyectos en los que trabajé.',
    order: ['experience', 'projects', 'about', 'services', 'process', 'contact'],
  },
  {
    id: 'clientes', planet: 'earth', title: 'Clientes',
    summary: 'Desarrollo web, automatizaciones y sistemas',
    intro: 'Primero, qué puedo hacer por tu negocio y cómo trabajamos.',
    order: ['services', 'projects', 'process', 'about', 'experience', 'contact'],
  },
  {
    id: 'personal', planet: 'saturn', title: 'Personal',
    summary: 'Sobre mí, docencia y curiosidad',
    intro: 'Primero, quién soy y qué me mueve.',
    order: ['about', 'projects', 'experience', 'services', 'process', 'contact'],
  },
];

export const routeById = (id: RouteId | null) => routes.find(route => route.id === id) ?? null;
export const isRouteId = (value: string): value is RouteId => routes.some(route => route.id === value);
