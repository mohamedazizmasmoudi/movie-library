import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';

// import SEND_MESSAGE from '../../../../../apollo/mutations/sendMessage';
// import JOIN_MESSAGES from '../../../../../apollo/queries/joinMessages';
import { connect } from 'react-redux';

import './Chat.css';

const ENDPOINT = process.env.REACT_APP_SOCKET_URL;

let socket;

const Chat = ({ location, gContext, displaychat,person }) => {
  const [id, setID] = useState('');
  console.log('person',person.userData)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [first,setFirst] = useState(false)
  useEffect(() => {
    socket = io(ENDPOINT);

    if (!displaychat) {
      socket.emit('leave', person.userData, (error) => {
        if (error) {
          alert(error);
        }
      });
    } else if (displaychat) {
      socket.emit('join', person.userData, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaychat]);
  useEffect(() => {
    console.log('person.userData',person.userData)
    if(person.userData){
      
      socket = io(ENDPOINT);
      
      socket.emit('join', person.userData, (error) => {
        if (error) {
          alert(error);
        }
        setID(person.userData._id);

        return fetch(`${process.env.REACT_APP_API_MESSAGE_URL}/messages`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((response) => {
            // eslint-disable-next-line array-callback-return
            response.map((res) => {
              setMessages((messages) => [...messages, res]);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person]);

  useEffect(() => {
    if(!first){
      console.log('socket',socket)
      socket.on('message', (msg) => {
        console.log('msg',msg)
        setMessages((msgs) => [...msgs, msg]);
        setFirst(true)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displaychat]);

  const sendMessage = (event) => {
    event.preventDefault();
    // SEND_MESSAGE(socket, gContext, message, setMessage);
    if (message) {
      socket.emit('sendMessage', message, person.userData, () => setMessage(''));
      return fetch(`${process.env.REACT_APP_API_MESSAGE_URL}/send`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: person.userData,
          text: message,
          date: Date.now(),
        }),
      })
        .then((response) => response.json())
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {displaychat && (
        <div
          style={{
            position: 'fixed',
            left: '72%',
            bottom: '4.5rem',
            zIndex: 99999999,
            background: 'white',
            borderRadius: '5px',
            outline: 'none',
            padding: 10,
            height: '40rem',
            minWidth: '40rem',
            boxShadow:'inset -2px 2px #3d3d3d08'
          }}
        >
          <Messages messages={messages} id={id} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            id={id}
          />
        </div>
      )}
    </>
  );
};
// Map State to Component Props
const mapStateToProps = ({ geral, movies, person }) => {
  return { geral, movies, person };
};

export default connect(
  mapStateToProps
  )(Chat);
