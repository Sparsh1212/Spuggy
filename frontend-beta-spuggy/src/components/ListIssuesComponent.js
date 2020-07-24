import React, { Component } from 'react';
import { Container, Button, Card, Label } from 'semantic-ui-react';
import './mainstyle.css';
import CreateIssue from './CreateIssueComponent';
import ListComments from './ListCommentsComponent';
import {
  faHome,
  faTrophy,
  faPlusSquare,
  faBolt,
  faMedal,
  faUser,
  faBug,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ListProjects from './ListProjectsComponent';
import WebSocketInstance from './WebSocket';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
// ..
AOS.init({

});

class ListIssues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      all_issues: [],
      issues_display: true,
      create_issue: false,
      project_id: null,
      issue_detail: false,
      issue_id: '',
      display_projects: false,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      leaders: [],
      show_leaderboard: false,
    };
  }
  async componentDidMount() {
    window.scrollTo(0, 0);

    let value = 'Token ' + this.state.token;
    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Issues/', {
      headers: { Authorization: value },
    });
    const data = await response.json();
    this.setState({
      all_issues: data,
    });
    console.log(this.state.all_issues);
    this.leaderboard();
  }
  createissue(project_id) {
    this.setState({
      issues_display: false,
      create_issue: true,
      project_id: project_id,
    });
  }
  issuedetail(issue) {
    this.setState({
      issues_display: false,
      create_issue: false,
      issue_id: issue,
      issue_detail: true,
    });
    WebSocketInstance.connect(issue.id);
  }
  leaderboard() {
    var valid_issues = this.state.all_issues.filter(
      (issue) =>
        (issue.issue_status === 'Open' ||
          issue.issue_status === 'Assigned' ||
          issue.issue_status === 'Resolved') &&
        issue.issue_project === this.props.project_detail.id
    );
    // console.log(valid_issues);
    var img_savers = valid_issues.map((issue) => issue.created_by);
    var a = [],
      b = [],
      prev;

    img_savers.sort();
    for (var i = 0; i < img_savers.length; i++) {
      if (img_savers[i] !== prev) {
        a.push(img_savers[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = img_savers[i];
    }
    var b_copy = [...b];
    b_copy.sort(function (c, d) {
      return d - c;
    });
    var invalid_indexes = [];
    //console.log(a);
    //console.log(b);

    var result = [];
    for (var i = 0; i < b_copy.length; i++) {
      for (var j = 0; j < b.length; j++) {
        if (b[j] == b_copy[i] && invalid_indexes.indexOf(j) == -1) {
          invalid_indexes.push(j);
          result.push({
            name: a[j],
            count: b[j],
          });
        }
      }
    }

    console.log(result);
    this.setState({
      leaders: result,
    });
  }

  render() {
    return (
      <div>
        {this.state.display_projects ? (
          <ListProjects />
        ) : this.state.issues_display ? (
          <div className='main'>
            <Container>
              <Button
                onClick={() => {
                  this.setState({ display_projects: true });
                }}
                primary
                float='right'
              >
                {<FontAwesomeIcon icon={faHome} />} Return to Projects
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    show_leaderboard: !this.state.show_leaderboard,
                  });
                }}
                color='purple'
              >
                {<FontAwesomeIcon icon={faTrophy} />} Leaderboard
              </Button>
              <br />
              <br />
            </Container>
            {this.state.show_leaderboard ? (
              <Container style={{ 'background-color': 'black' }}>
                <p
                  style={{
                    'text-align': 'center',
                    color: 'blue',
                    'font-size': '40px',
                    'padding-top': '40px',
                    'font-family': 'Verdana',
                  }}
                >
                  {<FontAwesomeIcon icon={faMedal} />} <b>LEADERBOARD</b>
                </p>
                <div style={{ padding: '3%' }}>
                  {this.state.leaders.map((leader) => (
                    <div
                      style={{
                        clear: 'both',
                        'border-bottom': '2px solid blue',
                        'padding-top': '20px',
                      }}
                    >
                      <p style={{ float: 'left' }}>
                        <b>
                          <span
                            style={{
                              color: 'white',
                              'font-size': '30px',
                              'font-family': 'monospace',
                            }}
                          >
                            {
                              <FontAwesomeIcon
                                className='fa-fw'
                                icon={faUser}
                              />
                            }
                            {leader.name}
                          </span>
                        </b>
                      </p>
                      <p style={{ float: 'right' }}>
                        <span
                          style={{
                            color: 'orange',
                            'font-size': '30px',
                          }}
                        >
                          {<FontAwesomeIcon icon={faBug} />} {leader.count}
                        </span>
                      </p>
                      <br />
                      <br />
                    </div>
                  ))}
                </div>
              </Container>
            ) : (
                <div></div>
              )}
            <br />
            <Container>
              <Card.Group>
                {this.state.all_issues.map((issue) => {
                  return issue.issue_project ===
                    this.props.project_detail.id ? (
                      <Card data-aos='slide-left'
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
                            <Label as='a' basic image>
                              <img
                                src={
                                  'https://api.adorable.io/avatars/48/' +
                                  issue.created_by +
                                  '@adorable.png'
                                }
                              />
                              {issue.created_by}
                            </Label>
                            <Button
                              style={{ padding: '10px' }}
                              onClick={() => {
                                this.issuedetail(issue);
                              }}
                              primary
                              floated='right'
                            >
                              {
                                <FontAwesomeIcon
                                  className='fa-fw'
                                  icon={faBolt}
                                />
                              }
                            Details
                          </Button>{' '}
                          </div>
                        }
                      />
                    ) : (
                      <div key={issue.id}></div>
                    );
                })}
              </Card.Group>
              <br />
              <br />
              <Button
                positive
                onClick={() => {
                  this.createissue(this.props.project_detail.id);
                }}
                floated='right'
              >
                {<FontAwesomeIcon icon={faPlusSquare} />} New Issue
              </Button>
            </Container>
          </div>
        ) : this.state.create_issue ? (
          <CreateIssue
            project_id={this.state.project_id}
            project_detail={this.props.project_detail}
          />
        ) : (
                <ListComments
                  issue_id={this.state.issue_id}
                  project_detail={this.props.project_detail}
                />
              )}
      </div>
    );
  }
}
export default ListIssues;
