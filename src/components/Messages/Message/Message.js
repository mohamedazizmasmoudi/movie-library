import React, { useEffect, useState } from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({
  message: {
    text, user, _id, role,
  }, id,
}) => {
  const [admin, setadmin] = useState(false);
  const [isSentByCurrentUser, setisSentByCurrentUser] = useState(false);
  useEffect(() => {
    if (user) {
      if (user._id === id) {
        setisSentByCurrentUser(true);
      }
      if (user.id === id) {
        setisSentByCurrentUser(true);
      }
      if (role) {
        setadmin(true);
        setisSentByCurrentUser(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id, id]);

  return (
    <>
      {admin && (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          </div>
          <p className="sentText pl-10 ">{role}</p>
        </div>
      )}

      {isSentByCurrentUser && (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{user.name}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
        </div>
      )}

      {!isSentByCurrentUser && !admin && (
        <div className="messageContainer justifyStart">
          <div className="messageBox backgroundLight">
            <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          </div>
          <p className="sentText pl-10 ">
            {user ? user.name : 'deleted user'}
          </p>
        </div>
      )}
    </>
  );
};

export default Message;
