import React, { Component } from 'react';
import {
  Container,
  Card,
  Button,
  Image,
  Form,
  Select,
  Checkbox,
  Label,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './anchorbtncss.css';
import {
  faHome,
  faUserShield,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    console.log(this.state.all_members);
  }
  handle(member) {
    this.setState({
      member: member,

      edit: true,
    });
    this.setState({
      status: member.status,
      isBlocked: member.isBlocked,
    });
  }
  statushandler = (event, data) => {
    this.setState({
      status: data.value,
    });
  };
  update() {
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
  }

  handleblock(e) {
    console.log(e.target.checked);
    this.setState({
      isBlocked: e.target.checked,
    });
    // console.log(this.state.isBlocked);
  }

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
              <div
                style={{
                  margin: '0 auto',
                  border: '4px solid black',
                  padding: '20px',
                  width: '30%',
                  'background-color': 'violet',
                }}
              >
                <h3>
                  Name: <i>{this.state.member.name}</i>
                </h3>
                <h3>
                  Username: <i>{this.state.member.username}</i>
                </h3>
                <h3>
                  Branch: <i>{this.state.member.branch}</i>
                </h3>
                <h3>
                  Year: <i>{this.state.member.current_year}</i>
                </h3>
                <h3>
                  Current Status: <i>{this.state.member.status}</i>
                </h3>
                {this.state.member.isBlocked ? (
                  <h5 style={{ color: 'red' }}>
                    <i>This user is currently blocked by an Admin</i>
                  </h5>
                ) : (
                  <div></div>
                )}
                <b>Status:</b>
                <Form.Field
                  control={Select}
                  options={[
                    { key: 'n', text: 'Normal', value: 'Normal' },
                    { key: 'a', text: 'Admin', value: 'Admin' },
                  ]}
                  onChange={this.statushandler}
                  // label={{
                  //   children: 'Status:',
                  //   htmlFor: 'form-select-control-gender',
                  // }}
                  search
                  searchInput={{ id: 'form-select-control-gender' }}
                />
                <br />
                <Checkbox
                  toggle
                  id='vehicle1'
                  onChange={(e) => {
                    this.handleblock(e);
                  }}
                />
                <label for='vehicle1'>
                  <b> Block Access</b>
                </label>
                <br />
                <br />
                <Button
                  onClick={() => {
                    this.update();
                  }}
                  positive
                >
                  Update Access Permissions
                </Button>
              </div>
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
                <Card key={member.id}>
                  <Card.Content>
                    <Image
                      floated='right'
                      size='mini'
                      src={
                        'https://api.adorable.io/avatars/48/' +
                        member.username +
                        '@adorable.png'
                      }
                    />
                    <Card.Header>{member.name}</Card.Header>
                    <Card.Meta>Username: {member.username}</Card.Meta>
                    <Card.Description>
                      <strong>Branch: </strong>
                      {member.branch}
                      <br />
                      <strong>Year: </strong>
                      {member.current_year}
                      <br />
                      <strong>Status: {}</strong>
                      {member.status}
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      onClick={() => {
                        this.handle(member);
                      }}
                      color='teal'
                    >
                      <FontAwesomeIcon icon={faUserLock} /> Edit Access
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Group>
          </Container>
        )}
      </div>
    );
  }
}
export default Members;
