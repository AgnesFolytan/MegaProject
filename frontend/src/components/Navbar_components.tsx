import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Context } from '../context/Context';
import { useContext } from 'react';

export function NavBar (){
  const { user, login, logout } = useContext(Context);
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
            {user?.username != null? (
              <>
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              </>
            ): (
              <>
              <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/register">Register</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar></>);}