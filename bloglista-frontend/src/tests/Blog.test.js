import React from 'react'
import { shallow, mount } from 'enzyme'
import Blog from '../components/Blog'
import App from "../App"
jest.mock('../services/blogs')
import blogService from "../services/blogs";
import LoginForm from '../components/LoginForm';

describe('<Blog />', () => {
  let blog, blogComponent

  beforeEach(() => {
    blog = {
      title: "React patterns",
      author: "Michael Chan",
      likes: 0
    }

    const mockHandler = jest.fn()
    
    blogComponent = shallow(
      <Blog 
        blog={blog} 
        addLike={mockHandler}
      />
    )
  })

  it('blog renders title, author and likes', () => {
    const contentDiv = blogComponent.find('.wrapper')
    
    expect(contentDiv.text()).toContain(blog.title)
    expect(contentDiv.text()).toContain(blog.author)
    expect(contentDiv.text()).toContain(`${blog.likes} likes`)
  })

  it('clicking the button twice calls adds two likes', () => {
    const button = blogComponent.find('button')
    button.simulate('click')
    button.simulate('click')
    
    const contentDiv = blogComponent.find('.wrapper')
    expect(contentDiv.text()).toContain(`${blog.likes + 2} likes`)
  })

  it('before clicking name the details are hidden', () => {
    const contentDiv = blogComponent.find('.togglableContent')
    expect(contentDiv.getElement().props.style.display).toEqual('none')
  })

  it('after clicking name the details are displayed', () => {
    const nameDiv = blogComponent.find('.title')
    nameDiv.simulate('click')
    
    const contentDiv = blogComponent.find('.togglableContent')
    expect(contentDiv.getElement().props.style.display).toEqual('')
  })
})

describe('<App />', () => {
  let app

  beforeEach(() => {
    let savedItems = {}

    const localStorageMock = {
      setItem: (key, item) => {
        savedItems[key] = item
      },
      getItem: (key) => savedItems[key],
      clear: savedItems = {}
    }
    
    window.localStorage = localStorageMock
  })
  
  describe('when user is not logged', () => {

    beforeEach(() => {
      localStorage.setItem('loggedBlogAppUser', null)

      app = mount(<App />)
    })

    it('only login form is rendered', () => {
      app.update()
      
      const loginFormComponents = app.find(LoginForm)
      expect(loginFormComponents.length).toEqual(1)

      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(0)
    })
  })

  describe('when user is logged', () => {
    
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
      }

      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      app = mount(<App />)
    })

    it('all notes are rendered', () => {
      app.update()

      const blogComponents = app.find(Blog)
      expect(blogComponents.length).toEqual(blogService.blogs.length)
    })
  })
})