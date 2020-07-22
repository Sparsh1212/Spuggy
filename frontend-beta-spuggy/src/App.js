import React, { Component } from 'react';

import Login from './components/LoginComponent';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MyPage from './components/MyPageComponent';
import Members from './components/MembersComponent';

class App extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path='/'>
              <Login />
            </Route>
            <Route exact path='/mypage'>
              <MyPage />
            </Route>
            <Route exact path='/members'>
              <Members />
            </Route>
          </Switch>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
