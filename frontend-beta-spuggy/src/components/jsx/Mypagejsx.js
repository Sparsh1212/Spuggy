import React from 'react';
import { Card, Button, Label } from 'semantic-ui-react';

const MyPagejsx = (props) => {
  const { issue, issuedetail } = props;
  const colourFinder = (status) => {
    return status === 'Created'
      ? 'yellow'
      : status === 'Open'
      ? 'blue'
      : status === 'Rejected'
      ? 'grey'
      : status === 'Assigned'
      ? 'purple'
      : 'green';
  };

  const colour = colourFinder(issue.issue_status);

  return (
    <Card
      data-aos='slide-left'
      key={issue.id}
      fluid
      color={colour}
      header={
        <div>
          <h4>{issue.issue_title}</h4>
          <Label
            ribbon
            style={{
              backgroundColor: colour,
              color: 'white',
            }}
          >
            <b>Status: {issue.issue_status}</b>
          </Label>
          <Label color='teal'>{issue.issue_tag}</Label>
          <Button onClick={() => issuedetail(issue)} primary floated='right'>
            View Issue
          </Button>{' '}
        </div>
      }
    />
  );
};

export default MyPagejsx;
