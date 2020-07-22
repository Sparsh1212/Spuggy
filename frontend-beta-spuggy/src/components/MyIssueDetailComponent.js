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
  Label,
  Message,
} from 'semantic-ui-react';
import './mainstyle.css';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MyPage from './MyPageComponent';
import {
  faUserNinja,
  faUser,
  faComment,
  faEdit,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

class MyIssueDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_comments: [],
      display_all_issues: false,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      status: 'Assigned',
      comment_detail: {
        comment_text: null,

        comment_issue: this.props.issue_id.id,
      },
      edit_issue: false,
      show: false,
    };
  }

  // Getting all comments from API
  async componentDidMount() {
    let value = 'Token ' + this.state.token;
    const response = await fetch('http://127.0.0.1:8000/spuggy/api/Comments/', {
      headers: { Authorization: value },
    });
    const data = await response.json();
    this.setState({
      all_comments: data,
    });
    console.log(this.state.all_comments);
    console.log(this.state.comment_detail);
  }

  //  POST Request of Comment to API
  postcomment() {
    let value = 'Token ' + this.state.token;
    // console.log(this.state)
    let url = 'http://127.0.0.1:8000/spuggy/api/Comments/';
    let commentdetails = this.state.comment_detail;
    fetch(url, {
      method: 'POST',

      headers: {
        Authorization: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(commentdetails),
    }).then((response) => {
      response.json().then((dictresp) => {
        alert('Comment Successfully Posted');
      });
    });
  }

  update() {
    var issue_title = this.props.issue_id.issue_title;
    var issue_project = this.props.issue_id.issue_project;
    var issue_tag = this.props.issue_id.issue_tag;
    var issue_status = this.state.status;
    var id = this.props.issue_id.id;

    let value = 'Token ' + this.state.token;
    // console.log(this.state)
    let url = 'http://127.0.0.1:8000/spuggy/api/Issues/' + id + '/';
    let obj = {
      issue_title: issue_title,
      issue_status: issue_status,
      issue_tag: issue_tag,
      issue_project: issue_project,
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
        });
      });
    });
  }
  statushandler = (event, data) => {
    this.setState({
      status: data.value,
    });
  };

  render() {
    // Getting the issue for which the comments are to be rendered
    const issue1 = this.props.issue_id;
    return (
      <div>
        {
          // Checking if display all issues is true
          this.state.display_all_issues ? (
            <MyPage />
          ) : (
            // If not then displaying the detail of a particular issue along with its associated comments
            <div className='main1'>
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
              <Container>
                <br />
                {this.state.show ? (
                  <Message
                    success
                    header='Issue Status Successfully Updated'
                    content='You may return to issues to see the updated list'
                  />
                ) : (
                  <div></div>
                )}
                <Button
                  primary
                  onClick={() => {
                    this.setState({ display_all_issues: true });
                  }}
                  float='right'
                >
                  {<FontAwesomeIcon icon={faHome} />} Return to Issues
                </Button>
                <br />
                <br />
              </Container>
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
                    <h4>
                      Project: <i>{issue1.projectname}</i>
                    </h4>
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

                <Button
                  onClick={() => {
                    this.setState({ edit_issue: true });
                  }}
                  color='teal'
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit Issue
                </Button>
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
                    <FontAwesomeIcon className='fa-fw' icon={faComments} />{' '}
                    Comments
                  </Header>
                  {this.state.all_comments.map((comment) => {
                    // Filtering comments of a particular issue
                    if (comment.comment_issue === this.props.issue_id.id) {
                      return (
                        <Comment key={comment.id}>
                          <Comment.Avatar
                            as='a'
                            src={
                              'https://api.adorable.io/avatars/48/' +
                              comment.commented_by +
                              '@adorable.png'
                            }
                          />
                          <Comment.Content>
                            <Comment.Author as='a'>
                              {comment.commented_by}
                            </Comment.Author>
                            <Comment.Metadata>
                              <span>{comment.comment_date}</span>
                            </Comment.Metadata>
                            <Comment.Text>{comment.comment_text}</Comment.Text>
                          </Comment.Content>
                        </Comment>
                      );
                    }

                    return <div key={comment.id}></div>;
                  })}
                </Comment.Group>
              </Container>
              <br />

              <Container>
                <h3>Add a new comment</h3>
                <Form>
                  <input
                    type='text'
                    onChange={(data) => {
                      this.setState({
                        comment_detail: {
                          comment_text: data.target.value,
                          comment_project: this.props.issue_id.issue_project,
                          comment_issue: this.props.issue_id.id,
                          commented_by: 2,
                        },
                      });
                    }}
                    placeholder='Your Comment Goes here'
                  />
                  <br /> <br />
                  <Button
                    onClick={() => {
                      this.postcomment();
                    }}
                    positive
                  >
                    <FontAwesomeIcon className='fa-fw' icon={faComment} />{' '}
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

export default MyIssueDetail;
