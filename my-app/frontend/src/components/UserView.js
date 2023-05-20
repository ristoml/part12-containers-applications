import { useSelector } from 'react-redux'

const UserView = ({ user }) => {
  const blogs = useSelector((state) => state.blogs)
  const authorBlogs = blogs.filter((blog) => blog.user.username === user)
  if (!user) return null
  return (
    <>
      <h3>added blogs</h3>
      {authorBlogs.map((blog) => (
        <li key={blog.id}>{blog.title}</li>
      ))}
    </>
  )
}
export default UserView
