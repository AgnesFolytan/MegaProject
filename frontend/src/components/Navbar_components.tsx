import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export function NavBar (){
  return (<><Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand href="/"></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Kezdőlap</Nav.Link>
          <Nav.Link href="/">Tabletek Lista</Nav.Link>
          <Nav.Link href="/">Tabletek Felvétel</Nav.Link>
          <Nav.Link href="/">Tabletek Törlés</Nav.Link>
          <Nav.Link href="/">Tabletek Keresés és Rendezés</Nav.Link>
          <Nav.Link href="/">Tabletek Pagination</Nav.Link>
          <NavDropdown title="Account" id="account-dropdown">
              <NavDropdown.Item href="#">Login</NavDropdown.Item>
              <NavDropdown.Item href="#">Register</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar></>);}