import React from 'react';

import { Card, Button, Image } from 'semantic-ui-react';

import { faUserLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MemberCard = (props) => {
  const { member, handle } = props;

  return (
    <Card key={member.id}>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src={
            'https://api.adorable.io/avatars/48/' +
            member.username +
            '@adorable.png'
          }
        />
        <Card.Header>{member.name}</Card.Header>
        <Card.Meta>Username: {member.username}</Card.Meta>
        <Card.Description>
          <strong>Branch: </strong>
          {member.branch}
          <br />
          <strong>Year: </strong>
          {member.current_year}
          <br />
          <strong>Status: {}</strong>
          {member.status}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          onClick={() => {
            handle(member);
          }}
          color='teal'
        >
          <FontAwesomeIcon icon={faUserLock} /> Edit Access
        </Button>
      </Card.Content>
    </Card>
  );
};

export default MemberCard;
