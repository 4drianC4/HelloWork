# HelloWork

Portafolio de Adrián Cámara, desarrollador de software en Cochabamba, Bolivia.

## Desarrollo

Requiere Node.js 22.12+ (recomendado: 24) y npm.

```sh
npm ci
npm run dev
```

Abrir la dirección local indicada por Vite, bajo `/HelloWork/`.

```sh
npm run build
npm run preview
```

El build ejecuta TypeScript y genera `dist/`. GitHub Actions verifica el build en pushes a `main` y en pull requests. La publicación de Pages se configurará en una etapa posterior; este workflow no despliega.

## Estructura

- `src/components/`: elementos compartidos y navegación.
- `src/sections/`: portada, proyectos, servicios, proceso, presentación, experiencia y contacto.
- `src/data/portfolio.ts`: contenido editable y tipado. Agregar proyectos aquí; los enlaces son opcionales y solo se muestran si existen.
- `src/styles/`: tokens visuales y estilos adaptables (proyectos en 3/2/1 columnas).
- `src/scene/`: representación estática decorativa; punto de integración del futuro sistema solar 3D.
- `public/fonts/`: ubicación prevista para fuentes web verificadas; no se han añadido fuentes comerciales.
- `docs/design-direction.md`: dirección visual aprobada y referencias.

## Estado de esta entrega

Estructura funcional de una sola página con contenido del CV, iconos transparentes y enlaces de contacto reales. Los paneles de proyecto son composiciones abstractas, no capturas reales. No se incluyen enlaces de demostración inventados.

La escena actual es CSS estático. Three.js / React Three Fiber, Drei y GSAP se incorporarán al implementar el 3D y las animaciones. Las fuentes actuales son fallbacks locales temporales; no son las fuentes exactas de Outer Wilds. Faltan capturas autorizadas, el PDF público del CV y la implementación del arte definitivo.

## GitHub Pages

El repositorio se llama `4drianC4/HelloWork`; Vite usa `base: '/HelloWork/'` respetando mayúsculas. Si se renombra, actualizar la base. No contiene servidor, secretos ni formulario con back-end. No cambiar la visibilidad del repositorio para habilitar Pages sin autorización.
