import React, { memo } from 'react';

const ActivityComments = memo(function ActivityComments({ comments }) {
  if (!comments || comments.length === 0) {
    return null;
  }

  return (
    <div className="comments-container">
      {comments.map((comment, index) => (
        <div key={index} className="comment-item">
          <div className="comment-header">
            <strong className="comment-author">
              {comment.athlete?.firstname} {comment.athlete?.lastname}
            </strong>
            <span className="comment-date">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>
      ))}
    </div>
  );
});

export default ActivityComments;
