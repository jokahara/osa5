import React from 'react'

class Blog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blog: this.props.blog,
      expanded: this.props.expanded
    }
  }
  
  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  
  addLike = () => {
    const newBlog = {
      ...this.state.blog,
      likes: this.state.blog.likes + 1
    }
    this.props.addLike(newBlog)
    this.setState({ blog: newBlog })
  }

  render() {
    const blog = this.state.blog

    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }

    const showWhenExpanded = {
      paddingTop: 5,
      paddingLeft: 10,
      display: this.state.expanded ? '' : 'none'
    }

    const deleteButton = 
      this.props.hasButton ?
      <button onClick={this.props.delete}>delete</button> :
      null

    return (
      <div style={blogStyle} className="wrapper">
        <div onClick={this.toggleExpanded} className="title">
          {blog.title} {blog.author}
        </div>
        <div style={showWhenExpanded} className="togglableContent">
          <div> <a href={blog.url}>{blog.url}</a> </div>
          <div> {blog.likes} likes <button onClick={this.addLike}>like</button> </div>
          {blog.user ? 
            <div> added by {blog.user.name} </div> : 
            null
          }
          {deleteButton}
        </div>
      </div>
    )
  }
}

export default Blog