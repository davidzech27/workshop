import React from 'react';
import MessageList from './MessageList';
import SendMessage from './SendMessage';

function Chat() {
  const chatStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  };

  return (
    <div style={chatStyle}>
      <MessageList />
      <SendMessage />
    </div>
  );
}

export default Chat;
