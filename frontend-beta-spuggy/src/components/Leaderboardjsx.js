import React from 'react';
import { faMedal, faUser, faBug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'semantic-ui-react';

const LeaderBoard = (props) => {
  const { leaders } = props;
  return (
    <Container style={{ 'background-color': 'black' }}>
      <p
        style={{
          'text-align': 'center',
          color: 'blue',
          'font-size': '40px',
          'padding-top': '40px',
          'font-family': 'Verdana',
        }}
      >
        {<FontAwesomeIcon icon={faMedal} />} <b>LEADERBOARD</b>
      </p>
      <div style={{ padding: '3%' }}>
        {leaders.map((leader) => (
          <div
            style={{
              clear: 'both',
              'border-bottom': '2px solid blue',
              'padding-top': '20px',
            }}
          >
            <p style={{ float: 'left' }}>
              <b>
                <span
                  style={{
                    color: 'white',
                    'font-size': '30px',
                    'font-family': 'monospace',
                  }}
                >
                  {<FontAwesomeIcon className='fa-fw' icon={faUser} />}
                  {leader.name}
                </span>
              </b>
            </p>
            <p style={{ float: 'right' }}>
              <span
                style={{
                  color: 'orange',
                  'font-size': '30px',
                }}
              >
                {<FontAwesomeIcon icon={faBug} />} {leader.count}
              </span>
            </p>
            <br />
            <br />
          </div>
        ))}
      </div>
    </Container>
  );
};

export default LeaderBoard;
