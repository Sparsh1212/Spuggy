import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Form, Container, Header, Message } from 'semantic-ui-react';
import './mainstyle.css';
import ListProjects from './ListProjectsComponent';
import { Dropdown } from 'semantic-ui-react';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//var options = [];

class CreateProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project_name: '',
      testing_procedure: '',
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      display_projects: false,
      all_users: [],
      team_members: [],
      options: [],
      show: false,
      failure: false,
    };
  }

  // Method for POST request to API
  create() {
    // console.log(this.state)
    let value = 'Token ' + this.state.token;
    let url = 'http://127.0.0.1:8000/spuggy/api/Projects/';
    let projectdetails = this.state;
    fetch(url, {
      method: 'POST',

      headers: {
        Authorization: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(projectdetails),
    }).then((response) => {
      response.json().then((dictresp) => {
        console.log(dictresp);
        if (Object.keys(dictresp).length > 2) {
          this.setState({ show: true, failure: false });
        } else {
          this.setState({ failure: true });
        }
      });
    });
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    let value = 'Token ' + this.state.token;
    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Users', {
      headers: { Authorization: value },
    });
    const data = await response.json();
    this.setState({
      all_users: data,
    });

    var filtered_list = this.state.all_users.filter(
      (user) =>
        user.username != JSON.parse(localStorage.getItem('username')).username
    );
    console.log(filtered_list);
    this.setState({
      options: filtered_list.map((user) => {
        return {
          key: user.id,
          text: user.username,
          value: user.id,
        };
      }),
    });
    console.log(this.state.options);
  }

  handler = (event, data) => {
    this.setState({
      team_members: data.value,
    });
  };

  render() {
    return (
      <div>
        {!this.state.display_projects ? (
          <div className='main'>
            <Container>
              <Button
                primary
                onClick={() => {
                  this.setState({ display_projects: true });
                }}
              >
                {<FontAwesomeIcon icon={faHome} />} Return to Projects
              </Button>
              <br />

              {this.state.show ? (
                <Message
                  success
                  header='Project Successfully Created'
                  content='You may now return to the Dashboard to view your newly created project.'
                />
              ) : (
                  <div></div>
                )}
              {this.state.failure ? (
                <Message
                  warning
                  header='Oops Something Went Wrong'
                  content='Looks like you left something important'
                />
              ) : (
                  <div></div>
                )}
              <Header as='h2'>Create a New Project</Header>
              <Form>
                <Form.Field>
                  <label>App Name</label>
                  <input
                    required
                    name='project_name'
                    onChange={(data) => {
                      this.setState({ project_name: data.target.value });
                    }}
                    placeholder='Enter the name of app'
                  />
                </Form.Field>

                <Form.Field>
                  <label>Testing Instructions</label>
                  <CKEditor
                    onChange={(event, editor) => {
                      this.setState({ testing_procedure: editor.getData() });
                    }}
                    editor={ClassicEditor}
                  />
                </Form.Field>

                <Dropdown
                  onChange={this.handler}
                  placeholder='Add Team Members'
                  fluid
                  multiple
                  search
                  selection
                  options={this.state.options}
                />
                <br />

                <Button
                  onClick={() => {
                    this.create();
                  }}
                  positive
                  type='submit'
                >
                  Create Project
                </Button>
              </Form>

            </Container>
          </div>
        ) : (
            <ListProjects />
          )}
      </div>
    );
  }
}

export default CreateProject;
