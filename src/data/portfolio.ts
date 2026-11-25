export const profile = {
  name: 'Adrian Camara',
  location: 'Cochabamba, Bolivia',
  email: 'camararequeadrianrafael@gmail.com',
  github: 'https://github.com/4drianC4',
  linkedin: 'https://www.linkedin.com/in/adrian-c-r/',
  // Pending: add these to turn on the "Descargar CV" and WhatsApp buttons.
  cvUrl: '' as string, // e.g. 'cv-adrian-camara.pdf' placed in public/
  whatsapp: '' as string, // international format without "+", e.g. '5917XXXXXXX'
};

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  technologies: string[];
  category: 'events' | 'automation' | 'inventory' | 'monitoring' | 'community';
  /** Where and with whom it was built, e.g. a hackathon or a thesis. */
  context?: string;
  /** The first link is the live demo; it also shows on the card. */
  links?: { label: string; href: string }[];
  screenshot?: { src: string; alt: string };
  caseStudy: { challenge: string; contribution: string; solution: string[] };
}

export const projects: Project[] = [
  {
    id: 'tunariguard', title: 'TunariGuard', category: 'monitoring',
    context: 'NASA Space Apps Challenge Cochabamba · equipo 404 Not Brain Found',
    links: [
      { label: 'Ver demo', href: 'https://tunariguard.ivento.tech/inicio' },
      { label: 'Publicación en LinkedIn', href: 'https://lnkd.in/p/dpnHaKEU' },
    ],
    screenshot: { src: 'images/projects/tunariguard.webp', alt: 'Panel de monitoreo de TunariGuard con focos detectados, alertas y un mapa de detecciones satelitales del Parque Nacional Tunari.' },
    role: 'Backend · proyecto en equipo',
    description: 'Monitoreo de anomalías térmicas en el Parque Nacional Tunari con datos satelitales MODIS y VIIRS de la NASA.',
    technologies: ['Angular', 'Leaflet', 'NASA FIRMS'],
    caseStudy: {
      challenge: 'Dar seguimiento a los focos de calor del Parque Nacional Tunari, cuando dos satélites con resoluciones distintas (MODIS y VIIRS) entregan detecciones que no se pueden comparar directamente.',
      contribution: 'Fui el encargado del backend en el equipo 404 Not Brain Found: conecté los datos satelitales existentes con el frontend para alimentar el panel, el mapa y las series históricas.',
      solution: [
        'Panel con focos detectados, alertas por prioridad y 15 distritos monitoreados.',
        'Mapa interactivo de detecciones y un histórico de 303 meses (2001–2026).',
        'Índice que armoniza VIIRS con MODIS por celda de 1 km y día, validado con un error anual de 16,3 %.',
        'Proyección del índice esperado hasta 2031.',
      ],
    },
  },
  {
    id: 'gommunity', title: 'Gommunity', category: 'community',
    context: 'Proyecto de grado',
    links: [{ label: 'Ver demo', href: 'https://gommunity.ivento.tech/' }],
    screenshot: { src: 'images/projects/gommunity.webp', alt: 'Directorio público de Gommunity con buscador, filtros por departamento y municipio, y tarjetas de comunidades de Cochabamba.' },
    role: 'Full-stack · proyecto personal',
    description: 'Plataforma para que las comunidades de barrio se organicen, vendan lo que producen y recauden fondos para sus eventos.',
    technologies: ['React', 'TypeScript', 'Go / Fiber', 'PostgreSQL', 'Redis', 'MinIO'],
    caseStudy: {
      challenge: 'Las comunidades de barrio organizan ventas, eventos y colectas con herramientas sueltas, sin un registro claro de quién aporta y qué se vende.',
      contribution: 'Es mi proyecto de grado y lo desarrollé de principio a fin. El frontend usa React con TypeScript estricto, TanStack Query, Zustand y React Hook Form con Zod. El backend está en Go con Fiber, GORM sobre PostgreSQL, Redis y MinIO para archivos.',
      solution: [
        'Comunidades con revisión de registro, roles e invitaciones, y permisos por comunidad y por propietario.',
        'Catálogo con inventario, pago por QR y revisión manual de comprobantes, con constancia descargable.',
        'Eventos con reservas, asistencia gratuita, metas de recaudación y un libro de aportes transparente.',
        'Autenticación con tokens opacos de acceso y renovación en cookies HttpOnly, y auditoría durable de cambios.',
      ],
    },
  },
  {
    id: 'ivento', title: 'Ivento', category: 'events',
    screenshot: { src: 'images/projects/ivento.webp', alt: 'Panel de Ivento con espacios, eventos y tickets.' },
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
    screenshot: { src: 'images/projects/aranjuez.webp', alt: 'Flujo de n8n del asistente de Paseo Aranjuez con agentes para gastronomía, retail, cine y consultas generales.' },
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
    screenshot: { src: 'images/projects/inventarios.webp', alt: 'Pantalla de ventas del sistema de gestión con filtros, estados e historial por sucursal.' },
    role: 'Dirección técnica · trabajo en equipo',
    description: 'Dirección del equipo y arquitectura técnica para sistemas de inventario, páginas web y automatizaciones corporativas.',
    technologies: ['React', 'Go / Fiber', 'CI/CD'],
    caseStudy: {
      challenge: 'Coordinar la construcción y entrega de sistemas de inventario y otras herramientas corporativas en Digital Services.',
      contribution: 'Como Director de Digital Services Develop dirijo un equipo ágil de 10 desarrolladores. Mi participación se centra en la dirección técnica, la arquitectura y los flujos de integración y despliegue.',
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
  { company: 'Digital Services Develop', role: 'Director', dates: 'Dic 2025 — Presente', description: 'Dirijo un equipo ágil de 10 desarrolladores en inventarios, landing pages y automatizaciones con Fiber (Go) y React. Definí arquitectura y CI/CD, reduciendo los tiempos de entrega en un 50%, con ciclos de lanzamiento de 3 meses.' },
  { company: 'Digital Services', role: 'Instructor', dates: 'Feb 2025 — Presente', description: 'Capacitación de más de 15 estudiantes en React, Next.js y Go. Diseño de planes de estudio prácticos con una tasa de aprobación y retención del 80%.' },
  { company: 'Watcheye', role: 'Pasante de desarrollo back-end', dates: 'Jul 2025 — Ene 2026', description: 'Desarrollo de dos APIs REST con Go para ventas y gestión de usuarios. Resolución de más de 50 tickets de soporte técnico del servidor.' },
];
