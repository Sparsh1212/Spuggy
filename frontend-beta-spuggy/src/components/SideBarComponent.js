import React, { Component } from 'react';
import './sidebarstyle.css';
import { Link } from 'react-router-dom';
import ListProjects from './ListProjectsComponent';
import {
  faSmile,
  faUsers,
  faSignOutAlt,
  faBug,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      display_profile: false,
      profile: null,
      display_projects: false,
    };
  }

  async componentDidMount() {
    let value = 'Token ' + this.state.token;
    const response = await fetch(
      'http://127.0.0.1:8000/spuggy/api/UserProfile',
      {
        headers: { Authorization: value },
      }
    );
    const data = await response.json();

    this.setState({
      profile: data[0],
      display_profile: true,
    });
    localStorage.setItem(
      'userid',
      JSON.stringify({
        userid: data[0].user,
      })
    );
    localStorage.setItem(
      'user_status',
      JSON.stringify({
        user_status: data[0].status,
      })
    );

    this.setState({ display_projects: true });
  }

  logout() {
    localStorage.clear();
    window.location.href = 'http://127.0.0.1:8000/';
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
        <div className='sidebar'>
          <Link>
            {
              <FontAwesomeIcon
                style={{ 'text-align': 'center' }}
                className='fa-fw fa-4x '
                icon={faBug}
              />
            }{' '}
            <span style={{ 'font-size': '20px' }}>
              <b>SPUGGY</b>
            </span>
          </Link>
          <a className='active'>
            Hello !!{' '}
            {this.state.display_profile ? (
              <div>
                <b> {this.state.profile.name}</b>
                <br /> @{this.state.profile.username}
                <br />
                Branch: <i>{this.state.profile.branch}</i>
                <br />
                Year: <i>{this.state.profile.current_year}</i>
                <br />
                Status: <i>{this.state.profile.status}</i>
              </div>
            ) : (
              <div></div>
            )}
          </a>

          {this.state.display_profile ? (
            this.state.profile.status == 'Admin' ? (
              <Link to='/members'>
                {<FontAwesomeIcon className='fa-fw' icon={faUsers} />} Members
              </Link>
            ) : (
              <div></div>
            )
          ) : (
            <div></div>
          )}
          <Link to='/mypage'>
            {<FontAwesomeIcon className='fa-fw' icon={faSmile} />} My Page
          </Link>
          <a
            onClick={() => {
              this.logout();
            }}
          >
            {<FontAwesomeIcon icon={faSignOutAlt} />} Logout
          </a>
        </div>
        {this.state.display_projects ? <ListProjects /> : <div></div>}
      </div>
    );
  }
}
export default SideBar;
