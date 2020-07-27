import React, { Component } from 'react';
import { Container, Card, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './anchorbtncss.css';
import { faHome, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MemberCard from './jsx/MemberCard';
import EditMemberCard from './jsx/EditMemberCard';
class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      all_members: [],
      member: null,
      edit: false,
      status: '',
      isBlocked: false,
    };
  }
  async componentDidMount() {
    let value = 'Token ' + this.state.token;
    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Profiles', {
      headers: { Authorization: value },
    });
    const data = await response.json();
    this.setState({
      all_members: data,
    });
  }
  handle = (member) => {
    this.setState({
      member: member,

      edit: true,
      status: member.status,
      isBlocked: member.isBlocked,
    });
  };
  statushandler = (event, data) => {
    this.setState({
      status: data.value,
    });
  };
  update = () => {
    var id = this.state.member.id;
    var obj = {
      name: this.state.member.name,
      user: this.state.member.user,
      current_year: this.state.member.current_year,
      branch: this.state.member.branch,
      status: this.state.status,
      isBlocked: this.state.isBlocked,
    };
    let value = 'Token ' + this.state.token;
    let url = 'http://127.0.0.1:8000/spuggy/api/Profiles/' + id + '/';
    fetch(url, {
      method: 'PUT',

      headers: {
        Authorization: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      response.json().then((dictresp) => {
        // alert('Access Permissions updated Successfully for this Member');
        console.log(dictresp);
        window.location.href = 'http://127.0.0.1:8000/';
      });
    });
  };

  handleblock = (e) => {
    this.setState({
      isBlocked: e.target.checked,
    });
  };

  render() {
    return (
      <div>
        {this.state.edit ? (
          <div>
            <Container>
              <Label
                color='purple'
                style={{ 'text-align': 'center' }}
                attached='top'
              >
                <span style={{ 'font-size': '30px' }}>
                  <FontAwesomeIcon icon={faUserShield} /> Admin Panel
                </span>
              </Label>
              <br />
              <br />
              <br />
              <Button
                primary
                onClick={() => {
                  this.setState({
                    edit: false,
                  });
                }}
              >
                Return to Members
              </Button>
              <br />
              <br />
              <EditMemberCard
                member={this.state.member}
                statushandler={this.statushandler}
                handleblock={this.handleblock}
                update={this.update}
              />
            </Container>
          </div>
        ) : (
          <Container>
            <Label
              color='purple'
              style={{ 'text-align': 'center' }}
              attached='top'
            >
              <span style={{ 'font-size': '30px' }}>
                <FontAwesomeIcon icon={faUserShield} /> Admin Panel
              </span>
            </Label>
            <br />
            <br />
            <br />
            <Button primary>
              <Link className='link' to='/'>
                <FontAwesomeIcon icon={faHome} /> Return to Dashboard
              </Link>
            </Button>
            <h1>All Members</h1>
            <Card.Group>
              {this.state.all_members.map((member) => (
                <MemberCard member={member} handle={this.handle} />
              ))}
            </Card.Group>
          </Container>
        )}
      </div>
    );
  }
}
export default Members;
