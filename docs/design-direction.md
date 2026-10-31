---
name: hellowork-portfolio
description: Diseñar y desarrollar el portafolio personal HelloWork de Adrian Camara con dirección espacial inspirada en Outer Wilds. Aplicar al concepto, arte, tipografía, sistema solar 3D, animaciones y composición de este proyecto; no a portafolios genéricos.
---

# HelloWork: explorar lo desconocido

## Contexto y alcance

Portafolio de Adrian Rafael Camara Reque, desarrollador de Cochabamba, Bolivia. Su objetivo es conseguir clientes locales para desarrollo web, automatizaciones y sistemas a medida, mostrando también su experiencia docente y técnica. Repositorio existente: `hellowork`; destino previsto por el usuario: `https://4drianc4.github.io/HelloWork/`, con GitHub Pages y CI/CD de GitHub. No asumir que esta carpeta ya contiene el repositorio ni crear otro remoto.

Esta skill fija la dirección de diseño; no implica publicar, configurar servicios externos ni construir el sitio en una solicitud que solo trate de diseño. Consultar el estado del proyecto antes de elegir herramientas. No imponer framework ni proveedor alternativo. Conservar compatibilidad con un sitio estático y la ruta base `/HelloWork/`.

## Dirección aprobada por el usuario

- Una sola página con secciones y navegación por anclas; sin vistas separadas por apartado.
- Exploración espacial como expresión personal: curiosidad, disposición para afrontar lo desconocido, descubrimiento y capacidad de adaptación.
- Referencia emocional principal: Outer Wilds. Referencias personales complementarias: viajes espaciales, Project Hail Mary, 2001: A Space Odyssey, Interstellar, No Man's Sky y Spore.
- Fondos negros y blancos, predominio de noche espacial azul, texto blanco sobre zonas oscuras y estrellas blancas, rojas, celestes y azules alrededor de la presentación.
- Un sistema solar 3D que se va cargando/revelando mientras se hace scroll. Ese es el alcance 3D solicitado; no convertir la web en un videojuego ni añadir navegación libre por obligación.
- Apariciones de texto, animaciones vinculadas al scroll y transiciones de entrada.
- El usuario pide exactamente las tipografías de Outer Wilds. La identificación y los archivos están pendientes; no sustituir silenciosamente por fuentes de estilo parecido ni presentar una aproximación como exacta.

## Interpretación artística propuesta

Estas decisiones concretan el encargo; son ajustables si el usuario las modifica.

Concepto: **HelloWork — una expedición hacia lo que podemos construir**. El visitante descubre el trabajo de Adrian como quien recorre una bitácora de exploración. Mantener calidez humana y asombro además de profundidad cósmica. Evitar la apariencia de dashboard militar, la estética de criptomonedas y el neón indiscriminado.

Usar geometrías planetarias estilizadas, órbitas finas, luz estelar, espacio negativo y etiquetas de bitácora. Crear arte propio inspirado en la exploración; no depender de extraer modelos, música o interfaces del videojuego. No incorporar spoilers del juego. No añadir audio automático.

La metáfora acompaña contenido claro: el visitante debe identificar nombre, servicios y contacto sin conocer Outer Wilds. Humor breve y secundario, sin prometer que Adrian domina cualquier problema. Expresar preparación a través de método, curiosidad y proyectos reales.

### Paleta inicial

| Token | Hex | Uso |
| --- | --- | --- |
| `space-950` | `#05070D` | Fondo principal negro espacial |
| `space-900` | `#0B1426` | Capas y superficies azul noche |
| `space-800` | `#142846` | Profundidad y atmósferas |
| `starlight` | `#F4F6FA` | Texto principal y estrellas blancas |
| `mist` | `#B8C7DB` | Texto secundario |
| `sky` | `#8DDCFF` | Enlaces, foco y estrellas celestes |
| `orbit-blue` | `#5D8FFF` | Órbitas y efectos azules |
| `ember` | `#EFA66A` | Acento cálido de expedición, uso puntual |
| `red-star` | `#FF7A86` | Estrellas rojas y partículas puntuales |
| `paper` | `#F4F1E9` | Superficies claras de bitácora |

Predominio oscuro; las superficies blancas son pausas editoriales o tarjetas de bitácora, no cambios de tema aleatorios. Sobre blanco usar texto `space-950`; mantener la petición de texto blanco en superficies oscuras. Los colores de partículas no deben competir con los CTA ni comunicar estado por sí solos. Comprobar contraste en los pares realmente usados; no asumir que cualquier combinación de tokens es legible.

### Tipografía: intención y verificación pendiente

Separar logotipo/titulares, texto de lectura y etiquetas de instrumentos. Las identificaciones comunitarias consultadas apuntan a **ITC Avant Garde Gothic Medium** e **ITC Serif Gothic Roman** para el logotipo, con modificaciones; **Space Mono** aparece asociada a texto de interfaz. No existe en la investigación realizada una confirmación oficial de todas las fuentes, sus pesos ni sus usos dentro del juego.

Antes de implementar la tipografía definitiva, verificar contra referencias visuales del usuario y una fuente fiable; distinguir logotipo de UI. Comprobar disponibilidad de archivos y permiso de uso web. No descargar paquetes de fuentes de procedencia incierta. Si falta una fuente, indicar cuál y usar únicamente una sustitución temporal identificada como tal. No exigir una compra durante la fase de definición.

## Escena 3D y movimiento

La lectura de «cargando al hacer scroll» propuesta es un **revelado progresivo de la escena**, no un cargador artificial que impida leer el contenido.

- Portada: Adrian, propuesta de valor y CTA visibles desde el inicio; sistema solar pequeño o parcialmente revelado detrás/lateral, con una zona despejada para leer.
- Primer tramo del scroll: aparecen estrella central, órbitas y planetas por etapas. La cámara se abre suavemente y muestra el sistema completo.
- Tramo posterior: la escena pierde protagonismo para dejar leer los proyectos; las secciones siguen el orden acordado. Se puede mantener una presencia ambiental discreta sin fijar una escena costosa durante toda la página.
- Estrellas de distintos colores y pequeñas ráfagas radiales en la presentación: interpretar «explotando» como expansión suave de partículas, sin destellos rápidos ni explosiones que tapen el texto.
- Texto: opacidad y desplazamiento corto de 12–24 px, normalmente 450–700 ms. Aparecer una vez por sección; no animar cada letra de los párrafos.
- Escena vinculada al progreso del scroll nativo. No secuestrar la rueda, obligar a esperar una secuencia ni impedir volver atrás.
- No añadir por defecto controles de vuelo, modelos de naves, avatar, minijuegos, física compleja ni un planeta por servicio. Esas ideas ampliarían el alcance solicitado.
- Respetar `prefers-reduced-motion`, navegación por teclado y lectura sin WebGL. Mantener contenido HTML accesible y una imagen o representación estática alternativa de la escena.
- En móviles reducir partículas, resolución y efectos; pausar renderizado fuera de pantalla y evitar trabajo continuo innecesario. Una carga 3D fallida nunca debe ocultar proyectos o contacto.

## Contenido y orden ya aceptados

### Revisión aceptada después de la primera muestra

El usuario aprobó la muestra completa: conservar composición, arte, paleta y apariencia tipográfica. La aprobación visual no confirma la identidad de los archivos de fuentes pendientes de verificar.

- Bitácora: permitir todos los proyectos relevantes en una cuadrícula de tres columnas en escritorio, dos en tablet y una en móvil. Usar tarjetas verticales con imagen arriba y texto debajo, no la composición horizontal de la primera muestra. Cada tarjeta admite nombre, participación personal, resumen y enlace; los proyectos de equipo deben identificar el rol. No inventar proyectos para llenar columnas. Si el catálogo crece, usar un control accesible «Ver más proyectos» o filtros solo cuando el volumen real lo justifique.
- Servicios y proyectos deben usar tarjetas con superficies oscuras sutiles y bordes finos. Iconos de trazo con fondo transparente, sin discos blancos, cuadrados sólidos ni placas rígidas detrás. Los contenedores de tarjeta sí pueden tener fondo; la restricción se refiere al icono.
- Incluir en trayectoria Digital Services, Cochabamba: Chief Technology Officer (CTO), diciembre 2025–julio 2026; instructor, febrero 2025–presente, según el CV aportado. Resumir dirección de equipo ágil de 10 desarrolladores, inventarios, landing pages, automatizaciones con Fiber (Go) y React, arquitectura y CI/CD; reducción de tiempos de entrega del 50% y ciclos de 3 meses según el CV. Para docencia, capacitación de más de 15 estudiantes en React, Next.js y Go; planes de estudio y tasa de aprobación/retención del 80% según el CV. No transformar estas métricas del CV en resultados de clientes independientes. En una muestra visual resumida priorizar empresa, roles, fechas y responsabilidades; ampliar detalles en el sitio final o CV.

Fuente de experiencia: CV aportado por Adrian y leído durante la definición del portafolio. Las fechas «presente» reflejan el CV y deben actualizarse si el usuario indica cambios.

1. Portada: quién es, qué resuelve, «Ver proyectos» y «Cuéntame tu idea».
2. Proyectos seleccionados: problema, participación personal, solución y evidencia. Distinguir trabajo propio y de equipo.
3. Servicios: desarrollo web, automatizaciones y sistemas a medida.
4. Cómo trabajo: conversación inicial, alcance, desarrollo, entrega y soporte acordado.
5. Sobre mí: experiencia técnica y docente, Cochabamba y personalidad.
6. Trayectoria y CV ampliado.
7. Contacto.

La experiencia docente y de asesoría refuerza la capacidad de explicar y orientar; no reducir la identidad a vender páginas. No inventar testimonios, métricas, clientes, disponibilidad ni proyectos. Las etiquetas espaciales pueden ser secundarias («Bitácora / Proyectos»); conservar nombres comprensibles en navegación y acciones.

## Referencias y límites de la investigación

- [Outer Wilds, Mobius Digital](https://www.mobiusdigitalgames.com/outer-wilds.html): contexto oficial de exploración y misterio en un sistema solar.
- [The Intentionality of Wandering, Mobius Digital](https://www.mobiusdigitalgames.com/news/the-intentionality-of-wandering): referencia conceptual para curiosidad y pistas claras.
- [Wiki aportada](https://outerwilds.fandom.com/wiki/Outer_Wilds_Wiki): bloqueó la consulta inicial; no afirmar haber inspeccionado sus imágenes o artículos.
- [3D Solar System](https://3dsolarsystem.online/): referencia del usuario para sistema solar; se obtuvo contenido textual, no se verificó el comportamiento visual completo.
- [EnduroSat Space Service](https://www.endurosat.com/space-service/): referencia del usuario para presentación espacial y recorrido; contenido textual consultado, animaciones pendientes de inspección visual.
- [ONU, The Race to Save Space](https://www.un.org/en/content/feature/theracetosavespace/#section-4): referencia del usuario; bloqueó la consulta inicial.
- [Identificación comunitaria del logotipo](https://fontmeme.com/outer-wilds-font/) y [discusión de Space Mono](https://www.reddit.com/r/outerwilds/comments/jg0cf1/): pistas tipográficas, no confirmación oficial.

Antes de atribuir movimientos, colores o composiciones específicas a las referencias, inspeccionarlas visualmente. No presentar las propuestas propias como rasgos observados de esas webs.

## Aplicación

Para trabajo de diseño, mostrar decisiones o muestras focalizadas antes de ampliar al sitio completo, conforme a la solicitud del usuario de avanzar paso a paso. Para implementación autorizada, aplicar estas bases y verificar página en escritorio y móvil, contenido disponible sin 3D, anclas, contraste, movimiento reducido y recursos bajo `/HelloWork/`. No declarar la tipografía exacta ni el despliegue completos sin verificarlos.

## Actualización de movimiento y perspectiva

El usuario solicita movimiento lento continuo e infinito, independiente del scroll. Esta decisión reemplaza el revelado por scroll: presentar todos los planetas desde el inicio, con giro axial y órbitas lentas. Pausar al salir de pantalla o esconder la pestaña; mantener la alternativa estática con movimiento reducido. La portada vuelve a un recorrido normal sin un tramo sticky largo. Buscar una perspectiva baja y oblicua, con planetas grandes en primer plano, tomando como referencia la lámina aprobada. No declarar fidelidad visual sin compararla en navegador.

## Actualización profesional y fotografías (31 de octubre de 2026)

Adrian confirma que su cargo es Director de Digital Services Develop, desde diciembre de 2025 hasta el presente. Esta información reemplaza la denominación CTO y el cierre en julio de 2026 del CV inicial, también en las bitácoras de proyectos. Las capturas aportadas corresponden a Paseo Aranjuez (flujo n8n), inventarios (pantalla de ventas) e Ivento (espacios/eventos). Integrar su retrato en Sobre mí sin modificar su apariencia.
