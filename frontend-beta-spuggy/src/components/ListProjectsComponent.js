import React, { Component } from 'react';
import { Container, Button, Message } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import './mainstyle.css';

import ListIssues from './ListIssuesComponent';
import CreateProject from './CreateProjectComponent';
import EditProject from './EditProjectComponent';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ListProjectsjsx from './jsx/ListProjectsjsx';

AOS.init({});

class ListProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testing: [],
      show_projects: true,
      show_issues: false,
      project_detail: null,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      create_project: false,
      project: null,
      edit_project: false,
      all_users: [],
      user_id: JSON.parse(localStorage.getItem('userid')).userid,
      user_status: JSON.parse(localStorage.getItem('user_status')).user_status,
      username: JSON.parse(localStorage.getItem('username')).username,
      show: false,
      no_projects: false,
    };
  }

  async componentDidMount() {
    let value = 'Token ' + this.state.token;

    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Projects/', {
      headers: { Authorization: value },
    });
    const data = await response.json();

    const response2 = await fetch('http://127.0.0.1:8000/spuggy/api/Users', {
      headers: { Authorization: value },
    });
    const data2 = await response2.json();

    if (data.length == 0) {
      this.setState({
        no_projects: true,
      });
    } else {
      this.setState({
        testing: data,
        all_users: data2,
      });
    }
  }
  viewissues = (project) => {
    this.setState({
      show_projects: false,
      show_issues: true,
      project_detail: project,
      token: this.props.token,
    });
  };

  confirm_delete = (id) => {
    confirmAlert({
      title: 'Confirm to Delete ',
      message: 'Are you sure you want to delete the Project ? ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.delete(id),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  delete = (id) => {
    let url1 = 'http://127.0.0.1:8000/spuggy/api/Projects/' + id + '/';
    let value = 'Token ' + this.state.token;

    fetch(url1, {
      method: 'DELETE',

      headers: {
        Authorization: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((response) => {
      console.log(response);
      this.setState({
        show: true,
      });
    });
  };

  user_want_to_edit = (project) => {
    this.setState({
      edit_project: true,
      project: project,
    });
  };

  render() {
    return (
      <div>
        {this.state.edit_project ? (
          <EditProject project={this.state.project} />
        ) : this.state.show_projects ? (
          <div className='main'>
            <Container>
              {this.state.show ? (
                <Message
                  success
                  header='Project Successfully Deleted'
                  content='You may refresh now to see the changes'
                />
              ) : (
                this.state.no_projects && <h1>No Projects yet!</h1>
              )}
              <Card.Group>
                {this.state.testing.map((project) => (
                  <ListProjectsjsx
                    user_id={this.state.userid}
                    user_status={this.state.user_status}
                    user_username={this.state.username}
                    project={project}
                    all_users={this.state.all_users}
                    confirm_delete={this.confirm_delete}
                    viewissues={this.viewissues}
                    user_want_to_edit={this.user_want_to_edit}
                  />
                ))}
              </Card.Group>
            </Container>

            <Button
              className='createproj'
              primary
              onClick={() => {
                this.setState({
                  show_projects: false,
                  create_project: true,
                  show_issues: false,
                });
              }}
            >
              {<FontAwesomeIcon className='fa-fw' icon={faPlusSquare} />} New
              Project
            </Button>
          </div>
        ) : this.state.show_issues ? (
          <ListIssues project_detail={this.state.project_detail} />
        ) : (
          <CreateProject />
        )}
      </div>
    );
  }
}

export default ListProjects;
