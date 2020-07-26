import { Button, Card, Label } from 'semantic-ui-react';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const IssuesCard = (props) => {
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

  const issue_colour = colourFinder(issue.issue_status);

  return (
    <Card
      data-aos='slide-left'
      key={issue.id}
      fluid
      color={issue_colour}
      header={
        <div>
          <h4>{issue.issue_title}</h4>
          <Label
            ribbon
            style={{
              backgroundColor: issue_colour,
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
            onClick={() => issuedetail(issue)}
            primary
            floated='right'
          >
            {<FontAwesomeIcon className='fa-fw' icon={faBolt} />}
            Details
          </Button>{' '}
        </div>
      }
    />
  );
};
