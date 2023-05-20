import { Button } from 'react-bootstrap'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const NavigationBar = ({ loggedIn, user, handleLogOut }) => {
  return (
    <Navbar bg='light' expand='lg'>
      <LinkContainer to='/'>
        <Navbar.Brand>Blogs</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          {loggedIn && (
            <LinkContainer to='/users'>
              <Nav.Link>users</Nav.Link>
            </LinkContainer>
          )}
        </Nav>
      </Navbar.Collapse>
      {loggedIn && <Navbar.Text>{user.name} logged in </Navbar.Text>}
      <Button onClick={() => handleLogOut()}>logout</Button>
    </Navbar>
  )
}
export default NavigationBar
