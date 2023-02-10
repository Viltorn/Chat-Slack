import React from 'react';

const Message = ({ message }) => {
  const { body, username, id } = message;

  return (
    <div key={id} className="text-break mb-2">
      <b>{username}</b>
      :
      {body}
    </div>
  );
};

export default Message;
