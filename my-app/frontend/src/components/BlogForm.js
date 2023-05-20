import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ hideForm }) => {
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)

  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: {
        username: user
      }
    }
    dispatch(createBlog(newBlog))
    hideForm()
    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <Form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>title:</Form.Label>
        <Form.Control
          value={newBlogTitle}
          onChange={({ target }) => setNewBlogTitle(target.value)}
          id='blogFormTitle'
        />
        <Form.Label>author:</Form.Label>
        <Form.Control
          value={newBlogAuthor}
          onChange={({ target }) => setNewBlogAuthor(target.value)}
          id='blogFormAuthor'
        />
        <Form.Label>url:</Form.Label>
        <Form.Control
          value={newBlogUrl}
          onChange={({ target }) => setNewBlogUrl(target.value)}
          id='blogFormUrl'
        />
        <Button type='submit'>create</Button>
      </Form.Group>
    </Form>
  )
}

export default BlogForm
