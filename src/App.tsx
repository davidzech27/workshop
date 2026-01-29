import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SendMessage from './components/SendMessage';

function App() {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>Blockchain Chat</h1>
        <ConnectButton />
      </header>
      <main>
        <SendMessage />
      </main>
    </>
  );
}

export default App;
