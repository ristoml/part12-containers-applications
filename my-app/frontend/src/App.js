import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import UserView from './components/UserView'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import loginService from './services/login'
import { intializeBlogs } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { configureUser } from './reducers/userReducer'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  Routes,
  Route,
  useNavigate,
  useMatch
} from 'react-router-dom'
import axios from 'axios'
import NavigationBar from './components/NavigationBar'

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [userList, setUserList] = useState([])
  const blogFormRef = useRef()

  const user = useSelector((state) => state.user)
  const blogs = useSelector((state) => state.blogs)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(intializeBlogs())
    axios.get('/api/users').then((res) => {
      setUserList(res.data)
    })
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setLoggedIn(true)
      dispatch(configureUser(user))
      blogService.setToken(user.token)
    }
    // eslint-disable-next-line
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      dispatch(configureUser(user))
      setLoggedIn(true)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('wrong username or password', true, 5))
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setLoggedIn(false)
    navigate('/')
  }

  const hideForm = () => {
    blogFormRef.current.toggleVisibility()
  }

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  return (
    <div className="container">
      <NavigationBar
        loggedIn={loggedIn}
        user={user}
        handleLogOut={handleLogOut}
      />
      {!loggedIn &&
      (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}
      <Notification />
      <Routes>
        <Route
          path='/'
          element={
            loggedIn && (
              <div id='blogList'>
                <Togglable
                  buttonLabelShow='new blog'
                  buttonLabelHide='cancel'
                  ref={blogFormRef}
                >
                  <BlogForm hideForm={hideForm} />
                </Togglable>
                <BlogList />
              </div>
            )
          }
        />
        <Route path='/users' element={<Users userList={userList} />} />
        <Route path='/users/:id' element={<UserView user={user.username} />} />
        <Route
          path='/blogs/:id'
          element={matchedBlog ? <BlogView blog={matchedBlog} /> : null}
        />
      </Routes>
    </div>
  )
}

export default App
