export const profile = {
  name: 'Adrian Camara',
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
  caseStudy: { challenge: string; contribution: string; solution: string[] };
}

export const projects: Project[] = [
  {
    id: 'ivento', title: 'Ivento', category: 'events',
    role: 'Desarrollo full-stack',
    description: 'Módulos para gestionar eventos, personalizar el mapa de recintos y organizar registros de asistentes.',
    technologies: ['Angular', 'Express', 'PostgreSQL'],
    caseStudy: {
      challenge: 'Organizar la distribución de un recinto y los registros de asistentes dentro de una aplicación de gestión de eventos.',
      contribution: 'Diseñé y desarrollé módulos full-stack, la interfaz para personalizar el mapa del recinto y la arquitectura de la base de datos relacional.',
      solution: ['Mapa interactivo para personalizar la infraestructura del lugar.', 'Módulos para registrar y gestionar asistentes.', 'Base de datos relacional y sincronización de información en tiempo real.'],
    },
  },
  {
    id: 'aranjuez', title: 'Asistente Paseo Aranjuez', category: 'automation',
    role: 'Desarrollo de automatización',
    description: 'Asistente conversacional para responder consultas de visitantes mediante flujos automatizados e inteligencia artificial.',
    technologies: ['n8n', 'JavaScript', 'IA'],
    caseStudy: {
      challenge: 'Atender las consultas frecuentes de los visitantes del Paseo Aranjuez y reducir el trabajo manual asociado a esas respuestas.',
      contribution: 'Construí un asistente conversacional con inteligencia artificial e implementé los flujos de automatización con n8n y JavaScript.',
      solution: ['Flujos para automatizar respuestas a preguntas frecuentes.', 'Lógica de integración mediante scripts de JavaScript.', 'Asistente orientado a la atención de visitantes del centro comercial.'],
    },
  },
  {
    id: 'inventarios', title: 'Inventarios · Digital Services', category: 'inventory',
    role: 'Dirección técnica · trabajo en equipo',
    description: 'Dirección del equipo y arquitectura técnica para sistemas de inventario, páginas web y automatizaciones corporativas.',
    technologies: ['React', 'Go / Fiber', 'CI/CD'],
    caseStudy: {
      challenge: 'Coordinar la construcción y entrega de sistemas de inventario y otras herramientas corporativas en Digital Services.',
      contribution: 'Como CTO dirigí un equipo ágil de 10 desarrolladores. Mi participación se centró en la dirección técnica, la arquitectura y los flujos de integración y despliegue.',
      solution: ['Desarrollo en equipo de sistemas de gestión de inventario con React y Fiber (Go).', 'Definición de arquitectura técnica.', 'Flujos de integración y despliegue continuo para organizar las entregas.'],
    },
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
