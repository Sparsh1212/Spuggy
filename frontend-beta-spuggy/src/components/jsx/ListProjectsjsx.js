import React from 'react';
import { Button, Label } from 'semantic-ui-react';
import { Card } from 'semantic-ui-react';
import parse from 'html-react-parser';
import {
  faBolt,
  faEdit,
  faTrash,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ListProjectsjsx = (props) => {
  const {
    user_id,
    user_status,
    user_username,
    project,
    all_users,
    viewissues,
    confirm_delete,
    user_want_to_edit,
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
    <Card data-aos='slide-left' centered fluid key={project.id}>
      <Card.Content>
        <Label color='purple' style={{ 'text-align': 'center' }} attached='top'>
          <span style={{ 'font-size': '15px' }}>{project.project_name}</span>
        </Label>
        <Card.Description>
          <p>
            Creator:{' '}
            <b style={{ color: '#3333ff' }}>
              <FontAwesomeIcon className='fa-fw' icon={faUser} />{' '}
              {project.created_by}
            </b>
          </p>
          <p>Other team Members:</p>
          {project.team_members.map((member) =>
            all_users.map((user) => {
              if (user.id === member) {
                return (
                  <b style={{ color: '#ff0066' }}>
                    <FontAwesomeIcon className='fa-fw' icon={faUser} />{' '}
                    {user.username}
                  </b>
                );
              } else {
                return <div></div>;
              }
            })
          )}
          <h4>
            <i>TESTING PROCEDURE:</i>
          </h4>
          {parse(project.testing_procedure)}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button onClick={() => viewissues(project)} primary>
          {<FontAwesomeIcon className='fa-fw' icon={faBolt} />} View
        </Button>
        <br />
        <br />
        {isEditAllowed(user_id, user_status, user_username, project) && (
          <div>
            <Button onClick={() => user_want_to_edit(project)} color='teal'>
              {<FontAwesomeIcon icon={faEdit} />} Edit
            </Button>
            <Button onClick={() => confirm_delete(project.id)} color='red'>
              {<FontAwesomeIcon icon={faTrash} />} Delete
            </Button>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default ListProjectsjsx;
