import { Container, Nav, Navbar } from 'react-bootstrap';

export function NavBar (){
  return (<><Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand href="/">Tablet App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Kezdőlap</Nav.Link>
          <Nav.Link href="/tabletek-lista">Tabletek Lista</Nav.Link>
          <Nav.Link href="/tabletek-felvetel">Tabletek Felvétel</Nav.Link>
          <Nav.Link href="/tabletek-torles">Tabletek Törlés</Nav.Link>
          <Nav.Link href="/tabletek-kereses">Tabletek Keresés és Rendezés</Nav.Link>
          <Nav.Link href="/tabletek-pagination">Tabletek Pagination</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar></>);}