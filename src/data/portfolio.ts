export const profile = {
  name: 'Adrián Cámara',
  location: 'Cochabamba, Bolivia',
  email: 'camararequeadrianrafael@gmail.com',
  github: 'https://github.com/4drianC4',
  linkedin: 'https://www.linkedin.com/in/adrian-c-r/',
};

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  technologies: string[];
  category: 'events' | 'automation' | 'inventory';
  url?: string;
}

export const projects: Project[] = [
  {
    id: 'ivento', title: 'Ivento', category: 'events',
    role: 'Desarrollo full-stack',
    description: 'Módulos para gestionar eventos, personalizar el mapa de recintos y organizar registros de asistentes.',
    technologies: ['Angular', 'Express', 'PostgreSQL'],
  },
  {
    id: 'aranjuez', title: 'Asistente Paseo Aranjuez', category: 'automation',
    role: 'Desarrollo de automatización',
    description: 'Asistente conversacional para responder consultas de visitantes mediante flujos automatizados e inteligencia artificial.',
    technologies: ['n8n', 'JavaScript', 'IA'],
  },
  {
    id: 'inventarios', title: 'Inventarios · Digital Services', category: 'inventory',
    role: 'Dirección técnica · trabajo en equipo',
    description: 'Dirección del equipo y arquitectura técnica para sistemas de inventario, páginas web y automatizaciones corporativas.',
    technologies: ['React', 'Go / Fiber', 'CI/CD'],
  },
];

export const services = [
  { id: 'web', title: 'Desarrollo web', description: 'Sitios y aplicaciones que presentan tu negocio y facilitan el contacto con tus clientes.' },
  { id: 'automation', title: 'Automatizaciones', description: 'Conecto herramientas y simplifico tareas repetitivas para que puedas dedicar tiempo a lo importante.' },
  { id: 'systems', title: 'Sistemas a medida', description: 'Herramientas para organizar pedidos, inventarios y procesos según las necesidades de tu negocio.' },
] as const;

export const process = [
  { title: 'Exploramos', description: 'Conversamos sobre tu negocio, tus ideas y el problema que necesitas resolver.' },
  { title: 'Definimos', description: 'Acordamos alcance, prioridades, entregables y tiempos.' },
  { title: 'Construimos', description: 'Desarrollo con avances que puedes revisar y comentar.' },
  { title: 'Entregamos', description: 'Preparamos la puesta en marcha y el soporte acordado.' },
];

export const experience = [
  { company: 'Digital Services', role: 'Chief Technology Officer (CTO)', dates: 'Dic 2025 — Jul 2026', description: 'Dirigí un equipo ágil de 10 desarrolladores en inventarios, landing pages y automatizaciones con Fiber (Go) y React. Definí arquitectura y CI/CD, reduciendo los tiempos de entrega en un 50%, con ciclos de lanzamiento de 3 meses.' },
  { company: 'Digital Services', role: 'Instructor', dates: 'Feb 2025 — Presente', description: 'Capacitación de más de 15 estudiantes en React, Next.js y Go. Diseño de planes de estudio prácticos con una tasa de aprobación y retención del 80%.' },
  { company: 'Watcheye', role: 'Pasante de desarrollo back-end', dates: 'Jul 2025 — Ene 2026', description: 'Desarrollo de dos APIs REST con Go para ventas y gestión de usuarios. Resolución de más de 50 tickets de soporte técnico del servidor.' },
];
