import React, { Component } from 'react';
import { Container, Button, Card } from 'semantic-ui-react';
import './mainstyle.css';
import CreateIssue from './CreateIssueComponent';
import ListComments from './ListCommentsComponent';
import {
  faHome,
  faTrophy,
  faPlusSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ListProjects from './ListProjectsComponent';
import WebSocketInstance from './WebSocket';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IssuesCard } from './jsx/ListIssuesjsx';
import Leaderboard from './Leaderboardjsx';
import img_savers_func from './Leaderboardbrain';

AOS.init({});

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
      no_issues: false,
    };
  }
  async componentDidMount() {
    window.scrollTo(0, 0);

    let value = 'Token ' + this.state.token;
    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Issues/', {
      headers: { Authorization: value },
    });
    const data = await response.json();
    var this_project_issues = data.filter(
      (issue) => issue.issue_project === this.props.project_detail.id
    );
    if (this_project_issues.length == 0) {
      this.setState({
        no_issues: true,
      });
    } else {
      let img_savers = img_savers_func(this_project_issues);
      this.setState({
        all_issues: this_project_issues,
        leaders: img_savers,
      });
    }
  }
  createissue(project_id) {
    this.setState({
      issues_display: false,
      create_issue: true,
      project_id: project_id,
    });
  }
  issuedetail = (issue) => {
    this.setState({
      issues_display: false,
      create_issue: false,
      issue_id: issue,
      issue_detail: true,
    });
    WebSocketInstance.connect(issue.id);
  };

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
            {this.state.show_leaderboard && (
              <Leaderboard leaders={this.state.leaders} />
            )}
            <br />
            {this.state.no_issues && (
              <h1 style={{ 'text-align': 'center' }}>No issues yet!</h1>
            )}
            <Container>
              <Card.Group>
                {this.state.all_issues.map((issue) => (
                  <IssuesCard
                    key={issue.id}
                    issue={issue}
                    issuedetail={this.issuedetail}
                  />
                ))}
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
