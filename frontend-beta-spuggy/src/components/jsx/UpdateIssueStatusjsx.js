import React from 'react';
import { Container, Form, Button, Select, Dropdown } from 'semantic-ui-react';

const UpdateIssueStatusjsx = (props) => {
  const { statushandler, handler, options, update } = props;
  const status_options = [
    { key: 'c', text: 'Created', value: 'Created' },
    { key: 'o', text: 'Open', value: 'Open' },
    { key: 'rej', text: 'Rejected', value: 'Rejected' },
    { key: 'as', text: 'Assigned', value: 'Assigned' },
    { key: 're', text: 'Resolved', value: 'Resolved' },
  ];
  return (
    <Container>
      <Form.Field
        control={Select}
        options={status_options}
        onChange={statushandler}
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
        onChange={handler}
        placeholder='Select From Your Team'
        fluid
        search
        selection
        options={options}
      />
      <br />
      <Button onClick={update} positive>
        Update
      </Button>
      <br />
      <br />
    </Container>
  );
};

export default UpdateIssueStatusjsx;
