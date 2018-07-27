import React from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login"
import LoginForm from "./components/LoginForm";
import NewBlogForm from "./components/NewBlogForm";
import Notification from './components/Notification';
import Togglable from "./components/Togglable";

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      notice: null,
      noticeType: 'notification',
      username: '',
      password: '',
      title: '',
      author: '',
      url: ''
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user, loginVisible: false })
      blogService.setToken(user.token)
    }
  } 

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  login = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)

      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.notification('wrong username or password', 'error')
    }
  }

  logout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    this.setState({ user: null })
  }

  addBlog = async (event) => {
    event.preventDefault()

    try {
      if (this.state.title.length < 1) {
        return this.notification('title is missing', 'error')
      }

      if (this.state.author.length < 1) {
        return this.notification('author is missing', 'error')
      }

      if (this.state.url.length < 1) {
        return this.notification('url is missing', 'error')
      }

      const newBlog = {
        title: this.state.title,
        author: this.state.author,
        url: this.state.url
      }

      const response = await blogService.create(newBlog)
      
      if (response) {
        this.notification(`a new blog '${response.title}' by ${response.author} added`, 'notification')
        this.setState({ 
          blogs: this.state.blogs.concat(response),
          title: '',
          author: '',
          url: ''
        })
      }
    } catch (exception) {
      this.notification(exception.toString(), 'error')
    }
  }

  addLike = async (newBlog) => {
    try {
      const response = await blogService.update(newBlog.id, newBlog)

      if (response) {
        this.setState({ 
          blogs: this.state.blogs.map(b => newBlog.id === b.id ? newBlog : b) })
      }
    } catch (exception) {
      this.notification(exception.toString(), 'error')
    }
  }
  
  delete = (blog) => async (event) => {
    event.preventDefault()

    try {
      if (!window.confirm(`delete '${blog.title}' by ${blog.author}?`))
        return

      await blogService.remove(blog.id)

      this.setState({ 
        blogs: this.state.blogs.filter(b => b.id !== blog.id)
      })

      this.notification(`'${blog.title}' by ${blog.author} removed`, 'notification')
    } catch (exception) {
      this.notification(exception.toString(), 'error')
    }
  }

  notification = (message, type) => {
    this.setState({ notice: message, noticeType: type})
    
    setTimeout(() => {
      this.setState({ notice: null })
    }, 5000);
  }

  render() {
    const blogs = this.state.blogs
      .sort((a, b) => b.likes - a.likes)

    const loginForm = () => {
      return (
        <LoginForm
          state={this.state}
          handleChange={this.handleFieldChange}
          handleSubmit={this.login}
        />
      )
    }

    const blogsForm = () => {
      return (
        <div>
          <h2>blogs</h2>
  
          <Notification 
            message={this.state.notice} 
            type={this.state.noticeType}
          />
  
          {this.state.user.name} logged in 
          <button onClick={this.logout}>logout</button>
          <p/>

          {blogs.map(blog => 
            <Blog 
              key={blog.id}
              blog={blog}
              addLike={this.addLike}
              delete={this.delete(blog)}
              hasButton={
                blog.user ? 
                this.state.user.id === blog.user.id : 
                true
              }
            />
          )}

  
          <h3>create new</h3>
          
          <Togglable buttonLabel="create new">
            <NewBlogForm 
              state={this.state}
              handleSubmit={this.addBlog}
              handleChange={this.handleFieldChange}
            />
          </Togglable>
        </div>
      )
    }
    
    if (!this.state.user) {
      return loginForm()
    }
    
    return blogsForm()
  }
}

export default App;
