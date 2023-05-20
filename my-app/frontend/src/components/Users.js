import { Link } from 'react-router-dom'

const Users = ({ userList }) => {
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <h2>Users</h2>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <b>blogs created</b>
            </td>
          </tr>
          {userList.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default Users
