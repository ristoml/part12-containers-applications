import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
    <div><h3>login</h3>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type='text'
            value={username}
            name='Username'
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />

          <Form.Label>password:</Form.Label>

          <Form.Control
            type='password'
            value={password}
            name='Password'
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />

          <Button variant="primary" type='submit'>login</Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LoginForm
