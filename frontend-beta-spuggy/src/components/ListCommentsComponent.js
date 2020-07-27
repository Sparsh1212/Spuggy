import React, { Component } from 'react';
import {
  Comment,
  Header,
  Container,
  Form,
  Button,
  Message,
} from 'semantic-ui-react';
import './mainstyle.css';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListIssues from './ListIssuesComponent';
import WebSocketInstance from './WebSocket';
import { faComments, faComment } from '@fortawesome/free-solid-svg-icons';
import MyPage from './MyPageComponent';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import IssueDetailCard from './jsx/IssueDetailjsx';
import UpdateIssueStatusjsx from './jsx/UpdateIssueStatusjsx';
import CommentCard from './jsx/Commentjsx';

AOS.init({});

class ListComments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //    all_comments: [] ,
      display_all_issues: false,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      edit_issue: false,
      status: this.props.issue_id.issue_status,
      all_users: [],
      comment_detail: {
        comment_text: null,
        comment_project: this.props.issue_id.issue_project,
        comment_issue: this.props.issue_id.id,
      },

      assigned_to: null,
      options: [],

      user_id: JSON.parse(localStorage.getItem('userid')).userid,
      user_status: JSON.parse(localStorage.getItem('user_status')).user_status,
      username: JSON.parse(localStorage.getItem('username')).username,

      message: '78t78t',
      messages: [],
      show: false,
      delete_show: false,
      display_my_page: false,
    };
    // WebSocketInstance.connect(this.props.issue_id.id)
    console.log('Socket connection called');
    this.waitForSocketConnection(() => {
      //   WebSocketInstance.initChatUser(this.props.currentUser);
      WebSocketInstance.addCallbacks(
        this.setMessages.bind(this),
        this.addMessage.bind(this)
      );
      WebSocketInstance.fetchMessages(this.props.issue_id.id);
    });
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log('Connection is made');
        callback();
        return;
      } else {
        console.log('Waiting for connection..');
        component.waitForSocketConnection(callback);
      }
    }, 100);
  }
  addMessage(message) {
    this.setState({
      messages: [message, ...this.state.messages],
    });
    console.log('Main do baar execute hua dekhna !!');
  }

  setMessages(messages) {
    this.setState({
      messages: messages.reverse(),
    });
    console.log(this.state.messages);
  }

  // Getting all comments from API
  async componentDidMount() {
    window.scrollTo(0, 0);
    let value = 'Token ' + this.state.token;

    console.log(this.state.comment_detail);

    const response2 = await fetch('http://127.0.0.1:8000/spuggy/api/Users', {
      headers: { Authorization: value },
    });
    const data1 = await response2.json();
    var eligible_members = data1.filter((user) => {
      for (var i = 0; i < this.props.project_detail.team_members.length; i++) {
        if (user.id == this.props.project_detail.team_members[i]) {
          return true;
        }
      }
      if (this.props.project_detail.created_by == user.username) {
        return true;
      }
      return false;
    });
    this.setState({
      all_users: eligible_members,
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
  }

  messageChangeHandler = (event) => {
    this.setState({
      message: event.target.value,
    });
    console.log(this.state.message);
  };

  sendMessageHandler() {
    const messageObject = {
      comment_project: this.props.issue_id.issue_project,
      comment_issue: this.props.issue_id.id,
      commented_by: this.state.user_id,
      comment_text: this.state.message,
    };

    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: '',
    });
    //  alert('Comment bhej to diya hai bro !!')

    //    e.preventDefault();
  }

  statushandler = (event, data) => {
    this.setState({
      status: data.value,
    });
  };

  update = () => {
    var issue_title = this.props.issue_id.issue_title;
    var issue_project = this.props.issue_id.issue_project;
    var issue_tag = this.props.issue_id.issue_tag;
    var issue_status = this.state.status;
    var id = this.props.issue_id.id;
    var assigned_to = this.state.assigned_to;

    let value = 'Token ' + this.state.token;
    // console.log(this.state)
    let url = 'http://127.0.0.1:8000/spuggy/api/Issues/' + id + '/';
    let obj = {
      issue_title: issue_title,
      issue_status: issue_status,
      issue_tag: issue_tag,
      issue_project: issue_project,
      assigned_to: assigned_to,
    };
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
        console.log(dictresp);
        this.setState({
          show: true,
          delete_show: false,
        });
      });
    });
  };

  handler = (event, data) => {
    this.setState({
      assigned_to: data.value,
    });
  };

  user_wants_to_edit = () =>
    this.setState({
      edit_issue: true,
    });

  confirm_delete = () => {
    confirmAlert({
      title: 'Confirm to Delete Issue',
      message: 'Are you sure you want to delete this Issue ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.delete(),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  delete = () => {
    let value = 'Token ' + this.state.token;
    var id = this.props.issue_id.id;
    let url = 'http://127.0.0.1:8000/spuggy/api/Issues/' + id + '/';

    fetch(url, {
      method: 'DELETE',

      headers: {
        Authorization: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    this.setState({
      delete_show: true,
      show: false,
    });
  };
  return_to_issues() {
    WebSocketInstance.connect(0);
    if (this.props.mypage != null) {
      this.setState({
        display_my_page: true,
      });
    } else {
      this.setState({ display_all_issues: true });
    }
  }

  render() {
    // Getting the issue for which the comments are to be rendered
    const issue1 = this.props.issue_id;
    return (
      <div>
        {
          // Checking if display all issues is true
          this.state.display_all_issues ? (
            <ListIssues
              project_id={this.state.comment_detail.comment_project}
              project_detail={this.props.project_detail}
            />
          ) : this.state.display_my_page ? (
            <MyPage />
          ) : (
            // If not then displaying the detail of a particular issue along with its associated comments
            <div className='main'>
              <Container>
                <Button
                  primary
                  onClick={() => {
                    this.return_to_issues();
                  }}
                  float='right'
                >
                  {<FontAwesomeIcon icon={faHome} />} Return to Issues
                </Button>
                <br />
                <br />
              </Container>
              {this.state.show ? (
                <Message
                  success
                  header='Issue Successfully Updated'
                  content='You may return to issues to see the updated list'
                />
              ) : (
                <div></div>
              )}
              {this.state.delete_show ? (
                <Message
                  success
                  header='Issue Successfully Deleted'
                  content='You may go return to issues to see the updated list'
                />
              ) : (
                <div></div>
              )}
              <Container>
                <IssueDetailCard
                  issue={issue1}
                  user_id={this.state.user_id}
                  username={this.state.username}
                  user_status={this.state.user_status}
                  confirm_delete={this.confirm_delete}
                  user_wants_to_edit={this.user_wants_to_edit}
                  project={this.props.project_detail}
                />
              </Container>
              <br />
              {this.state.edit_issue && (
                <UpdateIssueStatusjsx
                  statushandler={this.statushandler}
                  handler={this.handler}
                  options={this.state.options}
                  update={this.update}
                />
              )}
              <Container>
                <Comment.Group size='large'>
                  <Header as='h1' dividing>
                    {<FontAwesomeIcon className='fa-fw' icon={faComments} />}{' '}
                    Comments
                  </Header>
                  {this.state.messages.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </Comment.Group>
              </Container>
              <br />

              <Container>
                <h3>Add a new comment</h3>
                <Form>
                  <input
                    type='text'
                    onChange={this.messageChangeHandler}
                    placeholder='Your Comment Goes here'
                  />
                  <br /> <br />
                  <Button
                    onClick={() => {
                      this.sendMessageHandler();
                    }}
                    positive
                  >
                    {' '}
                    {
                      <FontAwesomeIcon className='fa-fw' icon={faComment} />
                    }{' '}
                    Comment
                  </Button>
                </Form>
              </Container>
            </div>
          )
        }
      </div>
    );
  }
}

export default ListComments;
