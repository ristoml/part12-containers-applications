import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addLikeBlog(state, action) {
      return state.map((a) => (a.id !== action.payload.id ? a : action.payload))
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      return state.filter(function (item) {
        return item.id !== action.payload
      })
    },
    commentBlog(state, action) {
      return state.map((a) => (a.id !== action.payload.id ? a : action.payload))
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { addLikeBlog, appendBlog, setBlogs, removeBlog, commentBlog } =
  blogSlice.actions

export const intializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch(setBlogs(blogs))
  }
}
export const createBlog = (object) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(object)
    dispatch(
      setNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
        false,
        5
      )
    )
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = (id, title) => {
  return async (dispatch) => {
    if (window.confirm(`Remove blog ${title}`)) {
      try {
        blogService.remove(id)
        dispatch(setNotification('blog deleted', false, 5))
        dispatch(removeBlog(id))
      } catch (error) {
        dispatch(setNotification(error.message, true, 5))
      }
    }
  }
}

export const addLike = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blog = blogs.find((b) => b.id === id)
    const newLikes = Number(blog.likes) + 1
    const likedBlog = { ...blog, likes: newLikes }
    try {
      const result = await blogService.update(id, likedBlog)
      console.log(result)
      dispatch(addLikeBlog(likedBlog))
    } catch (error) {
      dispatch(setNotification('something went wrong', true, 5))
    }
  }
}

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blog = blogs.find((b) => b.id === id)
    const newComments = blog.comments.concat(comment)
    try {
      const result = await blogService.comment(id, comment)
      console.log(result)
      dispatch(commentBlog(newComments))
    } catch (error) {
      dispatch(setNotification('something went wrong', true, 5))
    }
  }
}

export default blogSlice.reducer
