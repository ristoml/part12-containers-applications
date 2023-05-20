import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer, { setBlogs } from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import blogService from './services/blogs'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer
  }
})

blogService.getAll().then((blogs) => store.dispatch(setBlogs(blogs)))

export default store
