import React from 'react';


class App extends React.Component {
  vote = (anecdote) => () => {
    this.props.store.dispatch({ 
      type: 'VOTE', 
      data: anecdote
    })
  }

  addAnecdote = (event) => {
    event.preventDefault()

    this.props.store.dispatch({ 
      type: 'NEW_ANECTODE', 
      data: event.target.anecdote.value
    })

    event.target.anecdote.value = ''
  }

  render() {
    const anecdotes = this.props.store.getState()
      .sort((a, b) => b.votes - a.votes)

    return (
      <div>
        <h2>Anecdotes</h2>
        {anecdotes.map(anecdote=>
          <div key={anecdote.id}>
            <div>
              {anecdote.content} 
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={this.vote(anecdote)}>
                vote
              </button>
            </div>
          </div>
        )}
        <h2>create new</h2>
        <form onSubmit={this.addAnecdote}>
          <div><input name="anecdote"/></div>
          <button>create</button> 
        </form>
      </div>
    )
  }
}

export default App