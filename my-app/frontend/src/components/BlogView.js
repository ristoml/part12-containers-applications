// import { useSelector } from "react-redux"
import { useDispatch } from 'react-redux'
import { addLike } from '../reducers/blogReducer'
import Comments from './Comments'
import {  Button } from 'react-bootstrap'

const BlogView = ({ blog }) => {
  const dispatch = useDispatch()

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
        <br />
        {blog.likes} likes{' '}
        <Button onClick={() => dispatch(addLike(blog.id))}>like</Button>
        <br />
        added by {blog.user.name}
      </div>
      <Comments blog={blog} />
    </div>
  )
}
export default BlogView
