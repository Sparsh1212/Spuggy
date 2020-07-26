import React, { Component } from 'react';
import { Tab, Container, Card, Button, Label } from 'semantic-ui-react';
import './mainstyle.css';
import { Link } from 'react-router-dom';
import './anchorbtncss.css';
import { faUserNinja, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListComments from './ListCommentsComponent';
import WebSocketInstance from './WebSocket';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MyPagejsx from './jsx/Mypagejsx';

AOS.init({});

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
      no_issues_by_me: false,
      no_issues_for_me: false,
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

    const response1 = await fetch(
      'http://127.0.0.1:8000/spuggy/api/MyAssignedIssues/',
      {
        headers: { Authorization: value },
      }
    );
    const data1 = await response1.json();

    const response2 = await fetch(
      'http://127.0.0.1:8000/spuggy/api/Projects/',
      {
        headers: { Authorization: value },
      }
    );
    const data2 = await response2.json();

    this.list_maker(data, data1, data2);
  }

  list_maker = (all_issues_by_me, all_issues_to_me, all_projects) => {
    if (all_issues_by_me.length && all_issues_to_me.length) {
      this.setState(
        {
          all_issues_by_me: all_issues_by_me,
          all_issues_to_me: all_issues_to_me,
          all_projects: all_projects,
        },
        () => this.tabenhancer()
      );
    } else if (!all_issues_by_me.length && all_issues_to_me.length) {
      this.setState(
        {
          no_issues_by_me: true,
          all_issues_to_me: all_issues_to_me,
          all_projects: all_projects,
        },
        () => this.tabenhancer()
      );
    } else if (all_issues_by_me.length && !all_issues_to_me.length) {
      this.setState(
        {
          all_issues_by_me: all_issues_by_me,
          no_issues_for_me: true,
          all_projects: all_projects,
        },
        () => this.tabenhancer()
      );
    } else {
      this.setState(
        {
          no_issues_by_me: true,
          no_issues_for_me: true,
        },
        () => this.tabenhancer
      );
    }
  };

  tabenhancer() {
    console.log('Hello');
    panes = [
      {
        menuItem: 'My Raised Issues',
        render: () =>
          this.state.no_issues_by_me ? (
            <h1 style={{ 'text-align': 'center' }}>
              You haven't raised any issues yet!
            </h1>
          ) : (
            <Tab.Pane attached={false}>
              {
                <Card.Group>
                  {this.state.all_issues_by_me.map((issue) => (
                    <MyPagejsx
                      key={issue.id}
                      issue={issue}
                      issuedetail={this.issuedetail}
                    />
                  ))}
                </Card.Group>
              }
            </Tab.Pane>
          ),
      },
      {
        menuItem: 'Issues Assigned to me',
        render: () =>
          this.state.no_issues_for_me ? (
            <h1 style={{ 'text-align': 'center' }}>No work for you yet!</h1>
          ) : (
            <Tab.Pane attached={false}>
              {
                <Card.Group>
                  {this.state.all_issues_to_me.map((issue) => (
                    <MyPagejsx
                      key={issue.id}
                      issue={issue}
                      issuedetail={this.issuedetail}
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

  issuedetail = (issue) => {
    WebSocketInstance.connect(issue.id);
    var issue_project = this.state.all_projects.find(function (project) {
      return project.id == issue.issue_project;
    });
    this.setState({
      issues_display: false,
      current_project: issue_project,
      issue_id: issue,
      issue_detail: true,
    });
  };

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
