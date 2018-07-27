import React from 'react'
import ReactDOM from 'react-dom';
import {createStore} from 'redux'
import counterReducer from "./reducer";

const store = createStore(counterReducer)

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>anna palautetta</h1>
        <div>
          <Button
            handleClick={e => store.dispatch({ type: 'GOOD'})}
            text="hyvä"
          />
          <Button
            handleClick={e => store.dispatch({ type: 'OK'})}
            text="ok"
          />
          <Button
            handleClick={e => store.dispatch({ type: 'BAD'})}
            text="huono"
          />
        </div>

        <Statistics { ...store.getState() }/>

        <button onClick={e => store.dispatch({ type: 'ZERO'})}>nollaa tilasto</button>
      </div>
    )
  }
}

const Statistics = ({ good, ok, bad }) => {
  if (good + ok + bad === 0) {
    return <div>
      <h1>statistiikka</h1>
      ei yhtään palautetta annettu
    </div>
  }

  const keskiarvo = () => 
    ((good - bad) / (good + ok + bad)).toFixed(2)

  const positiivisia = () => 
    (100 * good / (good + ok + bad)).toFixed(1) + "%"

  return <div>
    <h1>statistiikka</h1>
    <table>
      <tbody>
        <Statistic
          text = "hyvä"
          value = {good}
        />
        <Statistic
          text = "neutraali"
          value = {ok}
        />
        <Statistic
          text = "huono"
          value = {bad}
        />
        <Statistic
          text = "keskiarvo"
          value = {keskiarvo()}
        />
        <Statistic
          text = "hyviä"
          value = {positiivisia()}
        />
      </tbody>
    </table>
  </div>
}

const Statistic = ({ text, value }) => {
  return (
    <tr> 
      <td>{text}</td> 
      <td>{value}</td> 
    </tr>)
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)