import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Chat from './components/Chat';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      maxWidth: 680,
      margin: '0 auto',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <h1 style={{
          fontSize: '1.0625rem',
          fontWeight: 600,
          color: '#000',
          letterSpacing: '-0.01em',
        }}>
          Blockchain Chat
        </h1>
        <ConnectButton showBalance={false} />
      </header>
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Chat />
      </main>
    </div>
  );
}

export default App;
