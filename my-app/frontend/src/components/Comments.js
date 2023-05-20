import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const Comments = ({ blog }) => {
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const makeComment = (id, cmt) => {
    dispatch(addComment(id, cmt))
    setComment('')
  }

  return (
    <div>
      <div id='comments'>
        <Form onSubmit={() => makeComment(blog.id, comment)}>
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type='submit'>comment</Button>
        </Form>
        {blog.comments &&
          blog.comments.map((comment) => (
            <li key={comment.id}>{comment.body}</li>
          ))}
      </div>
    </div>
  )
}

export default Comments
