import React, { Component } from 'react';
import {
  Container,
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Message,
} from 'semantic-ui-react';
import './mainstyle.css';
import ListIssues from './ListIssuesComponent';
import { faHome, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CreateIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display_issues: false,
      token: JSON.parse(localStorage.getItem('LoginStatus')).token,
      show: false,
      failure: false,
      include_image: false,
      new_issue: {
        issue_title: '',
        issue_description: '',
        issue_status: 'Created',
        issue_tag: 'Bug',
        issue_project: this.props.project_id,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // For uploading media
  fileInputRef = React.createRef();

  // Method to update the issue_tag in state (Not like a regular function in class based component)
  handleChange = (event, data) => {
    this.setState((prevState) => ({
      new_issue: {
        // object that we want to update
        ...prevState.new_issue, // keeping all other key-value pairs
        issue_tag: data.value, // updating the value of specific key
      },
    }));
  };

  // Method to update the issue_title
  handleChange2 = (event, data) => {
    this.setState((prevState) => ({
      new_issue: {
        ...prevState.new_issue,
        issue_title: data.value,
      },
    }));
  };

  // Method to update the issue_description
  handleChange3 = (event, data) => {
    this.setState((prevState) => ({
      new_issue: {
        ...prevState.new_issue,
        issue_description: data.value,
      },
    }));
  };

  handleImageChange = (e) => {
    this.setState({
      issue_image: e.target.files[0],
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    this.state.include_image
      ? form_data.append('issue_image', this.state.issue_image)
      : console.log('No media to upload');
    form_data.append('issue_title', this.state.new_issue.issue_title);
    form_data.append(
      'issue_description',
      this.state.new_issue.issue_description
    );
    form_data.append('issue_status', this.state.new_issue.issue_status);
    form_data.append('issue_tag', this.state.new_issue.issue_tag);
    form_data.append('issue_project', this.state.new_issue.issue_project);

    let value = 'Token ' + this.state.token;
    let url = 'http://127.0.0.1:8000/spuggy/api/Issues/';

    fetch(url, {
      method: 'POST',
      headers: { Authorization: value },
      body: form_data,
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
  };

  render() {
    return (
      <div>
        {
          // Checking if display_issues is true
          this.state.display_issues ? (
            <ListIssues
              project_id={this.state.new_issue.issue_project}
              project_detail={this.props.project_detail}
            />
          ) : (
              // If not then rendering Create Issue form
              <div className='main'>
                <Container>
                  <Button
                    onClick={() => {
                      this.setState({ display_issues: true });
                    }}
                    primary
                  >
                    <FontAwesomeIcon icon={faHome} /> Return to Issues
                </Button>
                  <br />
                  <br />
                  {this.state.show ? (
                    <Message
                      success
                      header='Issue Successfully Raised'
                      content='You may now return to the Issues to view your newly raised issue.'
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
                  <Form onSubmit={this.handleSubmit}>
                    <h1>Create a New Issue</h1>
                    <Form.Group widths='equal'>
                      <Form.Field
                        id='form-input-control-first-name'
                        onChange={this.handleChange2}
                        control={Input}
                        label='Issue Title'
                        placeholder='Enter the title of Issue'
                      />

                      <Form.Field
                        control={Select}
                        options={[
                          { key: 'b', text: 'Bug', value: 'Bug' },
                          { key: 'u', text: 'Enhancement/UI', value: 'UI' },
                        ]}
                        label={{
                          children: 'Type of Issue',
                          htmlFor: 'form-select-control-gender',
                        }}
                        placeholder='Enter type of Issue'
                        search
                        searchInput={{ id: 'form-select-control-gender' }}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Button
                      onClick={() => {
                        this.setState({
                          include_image: !this.state.include_image,
                        });
                      }}
                      color='teal'
                    >
                      <FontAwesomeIcon icon={faImage} /> Image (Optional)
                  </Button>
                    <br /> <br />
                    {this.state.include_image ? (
                      <Form.Field>
                        <input
                          type='file'
                          id='image'
                          accept='image/png, image/jpeg'
                          onChange={this.handleImageChange}
                        />
                      </Form.Field>
                    ) : (
                        <div></div>
                      )}
                    <br />
                    <Form.Field
                      id='form-textarea-control-opinion'
                      control={TextArea}
                      label='Issue Description (Optional)'
                      onChange={this.handleChange3}
                      placeholder='Give a nice description that could be understood by everyone'
                    />
                    <br />
                    <Button positive type='submit'>
                      Submit
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

export default CreateIssue;
