import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import LoginForm from './pages/LoginForm'
import GameRoom from './pages/GameRoom'

export default class Root extends React.Component {
  public render(): JSX.Element {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginForm} />
          <Route exact path="/dobble" component={GameRoom} />
        </Switch>
      </BrowserRouter>
    )
  }
}
