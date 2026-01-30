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

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) setMessage('');
  }, [isConfirmed]);

  const busy = isPending || isConfirming;
  const canSend = isConnected && !busy && message.trim().length > 0;
  const buttonLabel = isConfirming ? 'Confirming...' : isPending ? 'Confirm in wallet' : 'Send';

  return (
    <div style={{
      padding: '10px 16px 12px',
      position: 'relative',
    }}>
      {error && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 16,
          right: 16,
          marginBottom: 8,
          background: '#FFF2F2',
          border: '1px solid #FECACA',
          borderRadius: 10,
          padding: '8px 12px',
          color: '#DC2626',
          fontSize: '0.8125rem',
          lineHeight: 1.4,
        }}>
          {error.shortMessage || error.message}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={280}
          placeholder={isConnected ? 'Type a message...' : 'Connect wallet to chat'}
          disabled={!isConnected || busy}
          style={{
            flex: 1,
            padding: '9px 14px',
            borderRadius: 20,
            border: '1px solid #D1D1D6',
            backgroundColor: '#FFF',
            color: '#000',
            fontSize: '0.9375rem',
          }}
        />
        <button
          type="submit"
          disabled={!canSend}
          style={{
            padding: '9px 18px',
            borderRadius: 20,
            border: 'none',
            backgroundColor: canSend ? '#33A1FD' : '#D1D1D6',
            color: '#FFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: canSend ? 'pointer' : undefined,
            whiteSpace: 'nowrap',
          }}
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}

export default SendMessage;
