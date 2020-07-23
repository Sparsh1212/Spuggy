import React, { Component } from 'react';
import { Tab, Container, Card, Button, Label } from 'semantic-ui-react';
import './mainstyle.css';
import { Link } from 'react-router-dom';
import './anchorbtncss.css';
import { faUserNinja, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListComments from './ListCommentsComponent'
import WebSocketInstance from './WebSocket';

let panes = [];

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_issues_by_me: [],
      all_issues_to_me: [],
      all_projects: [],
      issues_display: false,
      issue_id: '',
      issue_detail: false,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      current_project: '',
    };
  }

  async componentDidMount() {
    let value = 'Token ' + this.state.token;
    const response = await fetch(
      'http://127.0.0.1:8000/spuggy/api/MyCreatedIssues/',
      {
        headers: { Authorization: value },
      }
    );
    const data = await response.json();
    this.setState({
      all_issues_by_me: data,
    });
    console.log(this.state.all_issues_by_me);

    const response1 = await fetch(
      'http://127.0.0.1:8000/spuggy/api/MyAssignedIssues/',
      {
        headers: { Authorization: value },
      }
    );
    const data1 = await response1.json();
    this.setState({
      all_issues_to_me: data1,
    });
    console.log(this.state.all_issues_to_me);

    const response2 = await fetch(
      'http://127.0.0.1:8000/spuggy/api/Projects/',
      {
        headers: { Authorization: value },
      }
    );
    const data2 = await response2.json();
    this.setState({
      all_projects: data2,
    });
    console.log(this.state.all_projects);

    this.tabenhancer();
  }

  tabenhancer() {
    console.log('Hello');
    panes = [
      {
        menuItem: 'My Raised Issues',
        render: () => (
          <Tab.Pane attached={false}>
            {
              <Card.Group>
                {this.state.all_issues_by_me.map((issue) => (
                  <Card
                    key={issue.id}
                    fluid
                    color={
                      issue.issue_status === 'Created'
                        ? 'yellow'
                        : issue.issue_status === 'Open'
                          ? 'blue'
                          : issue.issue_status === 'Rejected'
                            ? 'grey'
                            : issue.issue_status === 'Assigned'
                              ? 'purple'
                              : 'green'
                    }
                    header={
                      <div>
                        <h4>{issue.issue_title}</h4>
                        <Label
                          ribbon
                          style={{
                            backgroundColor:
                              issue.issue_status === 'Created'
                                ? 'yellow'
                                : issue.issue_status === 'Open'
                                  ? 'blue'
                                  : issue.issue_status === 'Rejected'
                                    ? 'grey'
                                    : issue.issue_status === 'Assigned'
                                      ? 'violet'
                                      : '#00ff00',
                            color: 'white',
                          }}
                        >
                          <b>Status: {issue.issue_status}</b>
                        </Label>
                        <Label color='teal'>{issue.issue_tag}</Label>
                        <Button
                          onClick={() => {
                            this.issuedetail(issue);
                          }}
                          primary
                          floated='right'
                        >
                          View Issue
                        </Button>{' '}
                      </div>
                    }
                  />
                ))}
              </Card.Group>
            }
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Issues Assigned to me',
        render: () => (
          <Tab.Pane attached={false}>
            {
              <Card.Group>
                {this.state.all_issues_to_me.map((issue) => (
                  <Card
                    key={issue.id}
                    fluid
                    color={
                      issue.issue_status === 'Created'
                        ? 'yellow'
                        : issue.issue_status === 'Open'
                          ? 'blue'
                          : issue.issue_status === 'Rejected'
                            ? 'grey'
                            : issue.issue_status === 'Assigned'
                              ? 'purple'
                              : 'green'
                    }
                    header={
                      <div>
                        <h4>{issue.issue_title}</h4>
                        <Label
                          ribbon
                          style={{
                            backgroundColor:
                              issue.issue_status === 'Created'
                                ? 'yellow'
                                : issue.issue_status === 'Open'
                                  ? 'blue'
                                  : issue.issue_status === 'Rejected'
                                    ? 'grey'
                                    : issue.issue_status === 'Assigned'
                                      ? 'violet'
                                      : '#00ff00',
                            color: 'white',
                          }}
                        >
                          <b>Status: {issue.issue_status}</b>
                        </Label>
                        <Label color='teal'>{issue.issue_tag}</Label>
                        <Button
                          onClick={() => {
                            this.issuedetail(issue);
                          }}
                          primary
                          floated='right'
                        >
                          View Issue
                        </Button>{' '}
                      </div>
                    }
                  />
                ))}
              </Card.Group>
            }
          </Tab.Pane>
        ),
      },
    ];
    this.setState({
      issues_display: true,
    });
  }

  issuedetail(issue) {
    WebSocketInstance.connect(issue.id);
    var issue_project = this.state.all_projects.find(function (project) {
      return project.id == issue.issue_project;
    })
    this.setState({
      issues_display: false,
      current_project: issue_project,
      issue_id: issue,
      issue_detail: true,
    });
  }

  render() {
    return (
      <div>
        {this.state.issues_display ? (
          <div className='main1'>
            <Container>
              <Label
                color='purple'
                style={{ 'text-align': 'center' }}
                attached='top'
              >
                <span style={{ 'font-size': '30px' }}>
                  <FontAwesomeIcon icon={faUserNinja} /> My Page
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
              <br />
              <br />

              <Tab
                menu={{ color: 'purple', secondary: true, pointing: true }}
                panes={panes}
              />
            </Container>
          </div>
        ) : this.state.issue_detail ? (
          <ListComments
            issue_id={this.state.issue_id}
            project_detail={this.state.current_project}
            mypage='yes'
          />
        ) : (
              <div></div>
            )}
      </div>
    );
  }
}

export default MyPage;
