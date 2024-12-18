import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { AuthProvider, Context } from '../context/Context';
import { useContext } from 'react';

export function NavBar (){
  const { user } = useContext(Context);
  console.log(user);
  return (<><Navbar bg='dark' sticky='top' variant="dark" expand="lg">
    <Container>
      <Navbar.Brand href="/"></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          
          {user? (
            <Nav.Link href="/Cart">Cart</Nav.Link>
          ): (
            <></>
          )}
          <NavDropdown title="Account" id="account-dropdown">
            {user? (
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