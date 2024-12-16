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
          {user?.username != null? (
            <Nav.Link href="/Cart">Kezdőlap</Nav.Link>
          ): (
            <></>
          )}
          <NavDropdown title="Account" id="account-dropdown">
            {user?.username != null? (
              <>
                <NavDropdown.Item href="/Logout">Logout</NavDropdown.Item>
                <NavDropdown.Item href="/Profile">Profile</NavDropdown.Item>
              </>
            ): (
              <>
              <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/Register">Register</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar></>);}