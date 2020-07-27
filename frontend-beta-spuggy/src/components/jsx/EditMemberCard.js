import React from 'react';
import { Button, Form, Select, Checkbox } from 'semantic-ui-react';

const EditMemberCard = (props) => {
  const { member, statushandler, handleblock, update } = props;
  return (
    <div
      style={{
        margin: '0 auto',
        border: '4px solid black',
        padding: '20px',
        width: '30%',
        'background-color': 'violet',
      }}
    >
      <h3>
        Name: <i>{member.name}</i>
      </h3>
      <h3>
        Username: <i>{member.username}</i>
      </h3>
      <h3>
        Branch: <i>{member.branch}</i>
      </h3>
      <h3>
        Year: <i>{member.current_year}</i>
      </h3>
      <h3>
        Current Status: <i>{member.status}</i>
      </h3>
      {member.isBlocked && (
        <h5 style={{ color: 'red' }}>
          <i>This user is currently blocked by an Admin</i>
        </h5>
      )}
      <b>Status:</b>
      <Form.Field
        control={Select}
        options={[
          { key: 'n', text: 'Normal', value: 'Normal' },
          { key: 'a', text: 'Admin', value: 'Admin' },
        ]}
        onChange={statushandler}
        search
        searchInput={{ id: 'form-select-control-gender' }}
      />
      <br />
      <Checkbox toggle id='vehicle1' onChange={handleblock} />
      <label for='vehicle1'>
        <b> Block Access</b>
      </label>
      <br />
      <br />
      <Button onClick={update} positive>
        Update Access Permissions
      </Button>
    </div>
  );
};

export default EditMemberCard;
