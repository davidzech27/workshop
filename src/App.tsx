import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>Blockchain Chat</h1>
        <ConnectButton />
      </header>
      <main>
        {/* The rest of the app will go here */}
      </main>
    </>
  );
}

export default App;
