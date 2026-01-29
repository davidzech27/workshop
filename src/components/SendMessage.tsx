import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CHAT_ROOM_ABI, CHAT_ROOM_CONTRACT_ADDRESS } from '../contracts/chatRoom';

function SendMessage() {
  const [message, setMessage] = useState('');
  const { isConnected } = useAccount();
  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      writeContract({
        address: CHAT_ROOM_CONTRACT_ADDRESS,
        abi: CHAT_ROOM_ABI,
        functionName: 'sendMessage',
        args: [message.trim()],
      });
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setMessage('');
    }
  }, [isConfirmed]);

  const buttonText = isConfirming
    ? "Sending..."
    : isPending
    ? "Confirm in wallet..."
    : "Send";

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={280}
        placeholder="Type your message..."
        disabled={!isConnected || isPending || isConfirming}
        style={{ flexGrow: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #ccc' }}
      />
      <button 
        type="submit" 
        disabled={!isConnected || isPending || isConfirming || !message.trim()}
        style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
      >
        {buttonText}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.shortMessage || error.message}</p>}
    </form>
  );
}

export default SendMessage;
