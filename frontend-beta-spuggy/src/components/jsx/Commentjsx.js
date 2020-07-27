import React from 'react';
import Moment from 'react-moment';
import { Comment } from 'semantic-ui-react';

const CommentCard = (props) => {
  const { comment } = props;
  return (
    <Comment data-aos='zoom-in' key={comment.id}>
      <Comment.Avatar
        as='a'
        src={
          'https://api.adorable.io/avatars/48/' +
          comment.comment_creator +
          '@adorable.png'
        }
      />
      <Comment.Content>
        <Comment.Author as='a'>{comment.comment_creator}</Comment.Author>
        <Comment.Metadata>
          <span>
            <Moment>{comment.date}</Moment>
          </span>
        </Comment.Metadata>
        <Comment.Text>{comment.text}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default CommentCard;
