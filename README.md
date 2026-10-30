# HelloWork

Portafolio de Adrian Camara, desarrollador de software en Cochabamba, Bolivia.

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

El build ejecuta TypeScript y genera `dist/`. GitHub Actions ejecuta pruebas y build en pushes a `main` y pull requests. En `main`, el workflow también prepara el artefacto de Pages y despliega cuando Pages está habilitado. Puede iniciarse manualmente con Run workflow.

## Estructura

- `src/components/`: elementos compartidos y navegación.
- `src/sections/`: portada, proyectos, servicios, proceso, presentación, experiencia y contacto.
- `src/data/portfolio.ts`: contenido editable y tipado. Agregar proyectos aquí; los enlaces son opcionales y solo se muestran si existen.
- `src/styles/`: tokens visuales y estilos adaptables (proyectos en 3/2/1 columnas).
- `src/scene/`: sistema solar 3D, texturas procedurales propias, carga diferida y alternativa estática.
- `src/hooks/`: preferencias de movimiento y animaciones GSAP de entrada/scroll.
- `public/fonts/`: ubicación prevista para fuentes web verificadas; no se han añadido fuentes comerciales.
- `docs/design-direction.md`: dirección visual aprobada y referencias.

## Estado de esta entrega

Estructura funcional de una sola página con contenido del CV, iconos transparentes y enlaces de contacto reales. Los paneles de proyecto son composiciones abstractas, no capturas reales. No se incluyen enlaces de demostración inventados.

La escena usa Three.js, React Three Fiber y Drei; GSAP anima las entradas de texto. El sistema solar se presenta completo y mantiene órbitas y rotaciones lentas independientes del scroll. Las texturas son generadas localmente, sin descargar recursos del videojuego. El código 3D se carga por separado; anima mientras está visible y se pausa fuera de pantalla o con la pestaña oculta. Móvil reduce resolución, geometría y estrellas.

Con movimiento reducido se usa directamente la representación CSS estática y se desactivan entradas animadas. Errores de carga, falta de WebGL o pérdida del contexto conservan una alternativa visual sin eliminar el contenido. Las fuentes actuales siguen siendo fallbacks locales temporales; no son las fuentes exactas de Outer Wilds. Faltan capturas autorizadas, el PDF público del CV y el arte final de las secciones.

```sh
npm test
```

Las pruebas cubren la alternativa con movimiento reducido, el cambio de preferencia durante la visita y la contención de fallos de la escena. La revisión visual del 3D se realiza en navegador.

## GitHub Pages

El repositorio se llama `4drianC4/HelloWork`; Vite usa `base: '/HelloWork/'` respetando mayúsculas. Si se renombra, actualizar la base. No contiene servidor, secretos ni formulario con back-end. No cambiar la visibilidad del repositorio para habilitar Pages sin autorización.

## Interacciones de la bitácora

Las tarjetas de proyectos responden al cursor con una inclinación de hasta 2,5 grados y un reflejo tenue. El efecto se desactiva con movimiento reducido o entrada táctil. «Abrir bitácora» muestra un diálogo nativo con reto, participación y solución; Escape y el botón de cierre devuelven el foco al proyecto original. El fondo queda bloqueado mientras está abierto.

El navbar marca la sección actual con `aria-current` y una línea decorativa indica el progreso de lectura. Su actualización se agrupa por frame y limpia listeners al desmontar. El contenido ampliado de cada proyecto se edita en `src/data/portfolio.ts` (`caseStudy`); los enlaces públicos siguen siendo opcionales.

## Descubrimientos y etapas

En «Sobre mí», la estrella junto a Cochabamba abre una señal personal al hacer clic, pulsar Enter o mantenerla presionada 700 ms. Soltar antes, salir del botón o cancelar el gesto detiene el temporizador. El mensaje se cierra con Escape o su botón y devuelve el foco a la estrella.

Los planetas de «Cómo trabajo» y sus títulos son controles `details/summary` nativos: muestran un ejemplo de cada etapa al tocarlos o activarlos con teclado. La descripción principal permanece visible. Hover y foco aportan una pequeña elevación y giro; movimiento reducido conserva las funciones sin esos efectos.

Las entradas de tarjetas y etapas tienen un desfase breve y la línea de trayectoria se dibuja con el scroll. Las preferencias de movimiento reducido desactivan estas animaciones.

### Activación del hosting

En Settings → Pages → Build and deployment, seleccionar **GitHub Actions** como Source. El workflow `.github/workflows/ci.yml` instala con `npm ci`, ejecuta pruebas y build, sube `dist/` y despliega en el entorno `github-pages`. Los pull requests solo validan: no publican.

La URL prevista es `https://4drianc4.github.io/HelloWork/`. Cada push a `main` actualizará el sitio una vez habilitado Pages. Si hay aprobaciones de entorno configuradas en GitHub, deben resolverse allí.

La activación inicial devolvió HTTP 422: el plan actual no admite Pages para este repositorio privado. Es necesario elegir entre hacer público el repositorio (código e historial incluidos) o mantenerlo privado con un plan compatible. No cambiar visibilidad sin autorización del propietario.
