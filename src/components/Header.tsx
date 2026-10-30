export function Header() {
  return (
    <header className="header wrap">
      <a className="brand" href="#inicio" aria-label="Adrián Cámara, inicio">Adrián Cámara<span aria-hidden="true">.</span></a>
      <nav aria-label="Navegación principal">
        <a href="#proyectos">Proyectos</a><a href="#servicios">Servicios</a>
        <a href="#sobre-mi">Sobre mí</a><a href="#contacto">Contacto</a>
      </nav>
    </header>
  );
}
