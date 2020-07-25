import React, { Component } from 'react';
import { Container, Button, Label, Message } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import './mainstyle.css';
import parse from 'html-react-parser';
import ListIssues from './ListIssuesComponent';
import CreateProject from './CreateProjectComponent';
import EditProject from './EditProjectComponent';
import {
  faPlusSquare,
  faBolt,
  faEdit,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init({

});

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

    if (data.length == 0) {
      this.setState({
        no_projects: true,
      })
    } else {
      this.setState({
        testing: data,
      });
    }
    // console.log(this.state.testing)
    // console.log(data)

    const response2 = await fetch('http://127.0.0.1:8000/spuggy/api/Users', {
      headers: { Authorization: value },
    });
    const data2 = await response2.json();
    this.setState({
      all_users: data2,
    });
    console.log(data2);
  }
  viewissues(project) {
    this.setState({
      show_projects: false,
      show_issues: true,
      project_detail: project,
      token: this.props.token,
    });
  }


  confirm_delete(id) {
    confirmAlert({
      title: 'Confirm to Delete ',
      message: 'Are you sure you want to delete the Project ? ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.delete(id)
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }

  delete(id) {
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

  }

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
              ) : this.state.no_projects ? <h1>No Projects yet!</h1> : <div></div>}
              <Card.Group>
                {this.state.testing.map((project) => (
                  <Card data-aos='slide-left' centered fluid key={project.id}>
                    <Card.Content>
                      <Label
                        color='purple'
                        style={{ 'text-align': 'center' }}
                        attached='top'
                      >
                        <span style={{ 'font-size': '15px' }}>
                          {project.project_name}
                        </span>
                      </Label>
                      <Card.Description>
                        <p>
                          Creator:{' '}
                          <b style={{ color: '#3333ff' }}>
                            <FontAwesomeIcon className='fa-fw' icon={faUser} />{' '}
                            {project.created_by}
                          </b>
                        </p>
                        <p>Other team Members:</p>
                        {project.team_members.map((member) =>
                          this.state.all_users.map((user) => {
                            if (user.id === member) {
                              return (
                                <b style={{ color: '#ff0066' }}>
                                  <FontAwesomeIcon
                                    className='fa-fw'
                                    icon={faUser}
                                  />{' '}
                                  {user.username}
                                </b>
                              );
                            } else {
                              return <div></div>;
                            }
                          })
                        )}
                        <h4>
                          <i>TESTING PROCEDURE:</i>
                        </h4>
                        {parse(project.testing_procedure)}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        onClick={() => {
                          this.viewissues(project);
                        }}
                        primary
                      >
                        {<FontAwesomeIcon className='fa-fw' icon={faBolt} />}{' '}
                        View
                      </Button>
                      <br />
                      <br />
                      {this.state.user_status === 'Admin' ? (
                        <div>
                          <Button
                            onClick={() => {
                              this.setState({
                                edit_project: true,
                                project: project,
                              });
                            }}
                            color='teal'
                          >
                            {<FontAwesomeIcon icon={faEdit} />} Edit
                          </Button>
                          <Button
                            onClick={() => {
                              this.confirm_delete(project.id);
                            }}
                            color='red'
                          >
                            {<FontAwesomeIcon icon={faTrash} />} Delete
                          </Button>
                        </div>
                      ) : this.state.username === project.created_by ? (
                        <div>
                          <Button
                            onClick={() => {
                              this.setState({
                                edit_project: true,
                                project: project,
                              });
                            }}
                            color='teal'
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              this.confirm_delete(project.id);
                            }}
                            color='red'
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                            project.team_members.map((member) => {
                              if (this.state.user_id === member) {
                                return (
                                  <div>
                                    <Button
                                      onClick={() => {
                                        this.setState({
                                          edit_project: true,
                                          project: project,
                                        });
                                      }}
                                      color='teal'
                                    >
                                      Edit
                                </Button>
                                    <Button
                                      onClick={() => {
                                        this.confirm_delete(project.id);
                                      }}
                                      color='red'
                                    >
                                      Delete
                                </Button>
                                  </div>
                                );
                              } else {
                                return <div></div>;
                              }
                            })
                          )}
                    </Card.Content>
                  </Card>
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
