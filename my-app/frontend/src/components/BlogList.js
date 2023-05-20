import Blog from './Blog'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addLike, deleteBlog } from '../reducers/blogReducer'

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user.username)

  const dispatch = useDispatch()

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => dispatch(addLike(blog.id))}
          deleteBlog={() => dispatch(deleteBlog(blog.id, blog.title))}
          user={user}
        />
      ))}
    </div>
  )
}

export default BlogList
