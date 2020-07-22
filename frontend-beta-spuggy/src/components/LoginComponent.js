import React, { Component } from 'react';
import { Form, Button, Container } from 'semantic-ui-react';
import SideBar from './SideBarComponent';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      login: false,
      token: null,
      invalid: false,
      invalid2: false,
    };
  }
  async componentDidMount() {
    const queryString = window.location.search;
    if (queryString != '') {
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get('token');
      const username = urlParams.get('username');
      console.log(token);
      localStorage.setItem(
        'username',
        JSON.stringify({
          username: username,
        })
      );
      localStorage.setItem(
        'LoginStatus',
        JSON.stringify({
          token: token,
        })
      );
      let value = 'Token ' + token;
      const response = await fetch(
        'http://127.0.0.1:8000/spuggy/api/UserProfile',
        {
          headers: { Authorization: value },
        }
      );
      const data = await response.json();

      if (data[0].isBlocked === true) {
        console.log('I was blocked');
        this.setState({
          invalid2: true,
          invalid: false,
        });
      } else {
        localStorage.setItem(
          'loggedin1',
          JSON.stringify({
            loggedin1: true,
          })
        );
        this.setState({
          login: true,
          token: token,
        });
      }
    }
  }

  async storagestatus() {
    let stored = JSON.parse(localStorage.getItem('LoginStatus'));
    if (stored.token != null) {
      let value = 'Token ' + stored.token;
      const response = await fetch(
        'http://127.0.0.1:8000/spuggy/api/UserProfile',
        {
          headers: { Authorization: value },
        }
      );
      const data = await response.json();
      console.log(data[0]);
      console.log('LOGIN SUCCESSFULL');
      if (data[0].isBlocked === true) {
        console.log('I was blocked');
        this.setState({
          invalid2: true,
          invalid: false,
        });
      } else {
        console.log(data[0].isBlocked);
        localStorage.setItem(
          'loggedin1',
          JSON.stringify({
            loggedin1: true,
          })
        );
        this.setState({
          login: true,
          token: stored.token,
        });
        console.log(this.state);
      }
    } else {
      this.setState({
        invalid: true,
        invalid2: false,
      });
      console.log('INVALID CREDENTIALS');
      console.log(this.state);
    }
  }

  login1() {
    fetch('http://127.0.0.1:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(this.state),
    }).then((response) => {
      response.json().then((dict) => {
        localStorage.setItem(
          'LoginStatus',
          JSON.stringify({
            token: dict.token,
          })
        );
        localStorage.setItem(
          'username',
          JSON.stringify({
            username: this.state.username,
          })
        );

        this.storagestatus();
      });
    });
  }
  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  render() {
    return (
      <div>
        {this.state.login ||
        !this.isEmpty(JSON.parse(localStorage.getItem('loggedin1'))) ||
        !this.isEmpty(JSON.parse(localStorage.getItem('loggedin'))) ? (
          <div>
            <SideBar />
          </div>
        ) : (
          <Container
            style={{
              width: '40%',
              border: '2px solid black',
              padding: '20px',
              'margin-top': '30px',
            }}
          >
            <h1>Hello, welcome to Spuggy, Please login to continue !!</h1>
            <Form>
              <Form.Field>
                <label>Username</label>
                <input
                  onChange={(data) => {
                    this.setState({ username: data.target.value });
                  }}
                  placeholder='Enter User Name'
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <input
                  type='password'
                  onChange={(data) => {
                    this.setState({ password: data.target.value });
                  }}
                  placeholder='Enter Password'
                />
              </Form.Field>

              <Button
                onClick={() => {
                  this.login1();
                }}
                primary
              >
                Login
              </Button>
              <Button color='violet'>
                <a
                  style={{ color: 'white' }}
                  href='https://internet.channeli.in/oauth/authorise/?client_id=FpManHnDgfhdL2CxZseuB82cDBzsj9VY14QKILhn&redirect_url=http://127.0.0.1:8000/spuggy/oauth/&state=RANDOM_STATE_STRING'
                >
                  Login Through Omniport
                </a>
              </Button>
            </Form>
            {this.state.invalid ? (
              <h3>Invalid Credentials, Please try again !!</h3>
            ) : this.state.invalid2 ? (
              <h3>You have been blocked by one of the Admins !!</h3>
            ) : (
              <div></div>
            )}
          </Container>
        )}
      </div>
    );
  }
}

export default Login;
