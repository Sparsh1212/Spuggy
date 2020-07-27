import React from 'react';
import { Card, Button, Label } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'aos/dist/aos.css';

const IssueDetailCard = (props) => {
  const {
    issue,
    user_status,
    username,
    user_id,
    project,
    confirm_delete,
    user_wants_to_edit,
  } = props;

  const isEditAllowed = (user_id, user_status, user_username, project) => {
    if (user_status === 'Admin' || user_username === project.created_by)
      return true;

    project.team_members.forEach((member_id) => {
      if (user_id === member_id) return true;
    });

    return false;
  };

  return (
    <div>
      <Card data-aos='fade' centered style={{ width: '50%' }}>
        {issue.issue_image != null ? (
          <img
            alt='avatarprof'
            src={issue.issue_image}
            width='100%'
            height='100%'
          />
        ) : (
          <div></div>
        )}
        <Card.Content>
          <Card.Header>{issue.issue_title}</Card.Header>
          <h4>
            Project: <i>{issue.projectname}</i>
          </h4>
          <Card.Meta style={{ padding: '10px' }}>
            Created By:{' '}
            <b>
              <FontAwesomeIcon icon={faUser} /> {issue.created_by}
            </b>
            <br />
            Assigned To:{' '}
            <b>
              <FontAwesomeIcon icon={faUser} /> {issue.currently_assigned_to}
            </b>
          </Card.Meta>
          <Card.Description style={{ padding: '10px' }}>
            <h3>Description:</h3>
            {issue.issue_description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Label as='a' color='orange' ribbon>
            Status:{' '}
            <b>
              <i>{issue.issue_status}</i>
            </b>
          </Label>
          <br />
          <br />
          <Label as='a' color='pink' ribbon>
            Type:{' '}
            <b>
              <i>{issue.issue_tag}</i>
            </b>
          </Label>
        </Card.Content>
      </Card>
      {isEditAllowed(user_id, user_status, username, project) && (
        <div>
          <Button onClick={user_wants_to_edit} color='teal'>
            Edit Issue
          </Button>
          <Button onClick={confirm_delete} color='red'>
            Delete Issue
          </Button>
        </div>
      )}
    </div>
  );
};

export default IssueDetailCard;
