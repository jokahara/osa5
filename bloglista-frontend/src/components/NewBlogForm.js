import React from 'react'

const NewBlogForm = ({ state, handleSubmit, handleChange }) => (
  <div>
    <form onSubmit={handleSubmit}>
      <div>
        title 
        <input 
          type="text"
          name="title"
          value={state.title}
          onChange={handleChange}
        />
      </div>
      <div>
        author 
        <input 
          type="text"
          name="author"
          value={state.author}
          onChange={handleChange}
        />
      </div>
      <div>
        url
        <input 
          type="text"
          name="url"
          value={state.url}
          onChange={handleChange}
        />
      </div>
      <button type="submit">create</button>
    </form>
  </div>
)

export default NewBlogForm