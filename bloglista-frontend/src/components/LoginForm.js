import React from 'react'
import Notification from "./Notification"

const LoginForm = ({ state, handleSubmit, handleChange }) => (
  <div>
    <h1>Log in to application</h1>  

    <Notification 
    message={state.notice} 
    type={state.noticeType}
    />

    <form onSubmit={handleSubmit}>
      <div>
        username:
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
        />
      </div>
      <div>
        password:
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>  
)

export default LoginForm