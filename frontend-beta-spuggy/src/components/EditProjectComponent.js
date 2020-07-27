import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Form, Container, Header, Message } from 'semantic-ui-react';
import './mainstyle.css';
import { Dropdown } from 'semantic-ui-react';
import ListProjects from './ListProjectsComponent';

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      project_name: this.props.project.project_name,
      testing_procedure: this.props.project.testing_procedure,
      all_users: [],
      team_members: this.props.project.team_members,
      options: [],
      project: this.props.project,
      display_projects: false,
      show: false,
      failure: false,
    };
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
    console.log(this.state.all_users);
    this.setState({
      options: this.state.all_users.map((user) => {
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

  update() {
    // console.log(this.state)
    let value = 'Token ' + this.state.token;
    let id = this.state.project.id;
    let url = 'http://127.0.0.1:8000/spuggy/api/Projects/' + id + '/';
    let projectdetails = this.state;
    fetch(url, {
      method: 'PUT',

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

  render() {
    return (
      <div>
        {this.state.display_projects ? (
          <ListProjects />
        ) : (
          <div className='main'>
            <Container>
              <Button
                primary
                onClick={() => {
                  this.setState({ display_projects: true });
                }}
              >
                Return to Projects
              </Button>
              <br />
              {this.state.show ? (
                <Message
                  success
                  header='Project Successfully Updated'
                  content='You may now return to the Dashboard to view your changes'
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
              <Header as='h2'>Edit Project Details</Header>
              <Form>
                <Form.Field>
                  <label>App Name</label>
                  <input
                    defaultValue={this.state.project.project_name}
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
                    data={this.state.project.testing_procedure}
                    onChange={(event, editor) => {
                      this.setState({ testing_procedure: editor.getData() });
                    }}
                    editor={ClassicEditor}
                  />
                </Form.Field>

                <Dropdown
                  defaultValue={this.state.project.team_members}
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
                    this.update();
                  }}
                  positive
                  type='submit'
                >
                  Update Project
                </Button>
              </Form>
            </Container>
          </div>
        )}
      </div>
    );
  }
}
export default EditProject;
