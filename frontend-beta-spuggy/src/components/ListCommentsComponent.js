import React, { Component } from 'react';
import {
  Comment,
  Header,
  Container,
  Card,
  Form,
  TextArea,
  Button,
  Select,
  Dropdown,
  Label,
  Message,
} from 'semantic-ui-react';
import './mainstyle.css';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListIssues from './ListIssuesComponent';
import WebSocketInstance from './WebSocket';
import {
  faComments,
  faEdit,
  faTrash,
  faComment,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

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
      for (var i = 0; i < this.props.project_detail.team_members.length; i++) { if (user.id == this.props.project_detail.team_members[i]) { return true; } }
      if (this.props.project_detail.created_by == user.username) { return true };
      return false;
    }
    );
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

  update() {
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
  }

  handler = (event, data) => {
    this.setState({
      assigned_to: data.value,
    });
  };

  delete() {
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
  }
  return_to_issues() {
    WebSocketInstance.connect(0);
    this.setState({ display_all_issues: true });
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
                  <Card centered style={{ width: '50%' }}>
                    {issue1.issue_image != null ? (
                      <img
                        alt='avatarprof'
                        src={issue1.issue_image}
                        width='100%'
                        height='100%'
                      />
                    ) : (
                        <div></div>
                      )}
                    <Card.Content>
                      <Card.Header>{issue1.issue_title}</Card.Header>
                      <Card.Meta style={{ padding: '10px' }}>
                        Created By:{' '}
                        <b>
                          <FontAwesomeIcon icon={faUser} /> {issue1.created_by}
                        </b>
                        <br />
                      Assigned To:{' '}
                        <b>
                          <FontAwesomeIcon icon={faUser} />{' '}
                          {issue1.currently_assigned_to}
                        </b>
                      </Card.Meta>
                      <Card.Description style={{ padding: '10px' }}>
                        <h3>Description:</h3>
                        {issue1.issue_description}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Label as='a' color='orange' ribbon>
                        Status:{' '}
                        <b>
                          <i>{issue1.issue_status}</i>
                        </b>
                      </Label>
                      <br />
                      <br />
                      <Label as='a' color='pink' ribbon>
                        Type:{' '}
                        <b>
                          <i>{issue1.issue_tag}</i>
                        </b>
                      </Label>
                    </Card.Content>
                  </Card>

                  {this.state.user_status === 'Admin' ? (
                    <div>
                      <Button
                        onClick={() => {
                          this.setState({ edit_issue: true });
                        }}
                        color='teal'
                      >
                        {<FontAwesomeIcon icon={faEdit} />} Edit Issue
                    </Button>
                      <Button
                        onClick={() => {
                          this.delete();
                        }}
                        color='red'
                      >
                        {<FontAwesomeIcon icon={faTrash} />} Delete Issue
                    </Button>
                    </div>
                  ) : this.state.username ===
                    this.props.project_detail.created_by ? (
                        <div>
                          <Button
                            onClick={() => {
                              this.setState({ edit_issue: true });
                            }}
                            color='teal'
                          >
                            Edit Issue
                    </Button>
                          <Button
                            onClick={() => {
                              this.delete();
                            }}
                            color='red'
                          >
                            Delete Issue
                    </Button>
                        </div>
                      ) : (
                        this.props.project_detail.team_members.map((member) => {
                          if (this.state.user_id == member) {
                            return (
                              <div>
                                <Button
                                  onClick={() => {
                                    this.setState({ edit_issue: true });
                                  }}
                                  color='teal'
                                >
                                  Edit Issue
                          </Button>
                                <Button
                                  onClick={() => {
                                    this.delete();
                                  }}
                                  color='red'
                                >
                                  Delete Issue
                          </Button>
                              </div>
                            );
                          } else {
                            return <div></div>;
                          }
                        })
                      )}
                </Container>
                <br />
                {this.state.edit_issue ? (
                  <Container>
                    <Form.Field
                      control={Select}
                      options={[
                        { key: 'c', text: 'Created', value: 'Created' },
                        { key: 'o', text: 'Open', value: 'Open' },
                        { key: 'rej', text: 'Rejected', value: 'Rejected' },
                        { key: 'as', text: 'Assigned', value: 'Assigned' },
                        { key: 're', text: 'Resolved', value: 'Resolved' },
                      ]}
                      onChange={this.statushandler}
                      label={{
                        children: 'Status: ',
                        htmlFor: 'form-select-control-gender',
                      }}
                      placeholder='Update status of Issue'
                      search
                      searchInput={{ id: 'form-select-control-gender' }}
                    />{' '}
                    <br />
                    <Dropdown
                      onChange={this.handler}
                      placeholder='Select From Your Team'
                      fluid
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
                    >
                      Update
                  </Button>
                    <br />
                    <br />
                  </Container>
                ) : (
                    <div></div>
                  )}
                <Container>
                  <Comment.Group size='large'>
                    <Header as='h1' dividing>
                      {<FontAwesomeIcon className='fa-fw' icon={faComments} />}{' '}
                    Comments
                  </Header>
                    {this.state.messages.map((comment) => (
                      <Comment key={comment.id}>
                        <Comment.Avatar
                          as='a'
                          src={
                            'https://api.adorable.io/avatars/48/' +
                            comment.comment_creator +
                            '@adorable.png'
                          }
                        />
                        <Comment.Content>
                          <Comment.Author as='a'>
                            {comment.comment_creator}
                          </Comment.Author>
                          <Comment.Metadata>
                            <span>{comment.date}</span>
                          </Comment.Metadata>
                          <Comment.Text>{comment.text}</Comment.Text>
                        </Comment.Content>
                      </Comment>
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
