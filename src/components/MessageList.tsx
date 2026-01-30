import React, { useEffect, useRef } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CHAT_ROOM_ABI, CHAT_ROOM_CONTRACT_ADDRESS } from '../contracts/chatRoom';

const formatAddress = (address: string) => `${address.slice(0, 6)}${address.slice(-4)}`;

const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

function MessageList() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { address: connectedAddress } = useAccount();

  const { data: messages, isLoading, error } = useReadContract({
    address: CHAT_ROOM_CONTRACT_ADDRESS,
    abi: CHAT_ROOM_ABI,
    functionName: 'getMessages',
    query: { refetchInterval: 4000 },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 40px', color: '#8E8E93' }}>
        <span>Loading messages...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 20px 40px' }}>
        <div style={{
          background: '#FFF2F2',
          border: '1px solid #FECACA',
          borderRadius: 12,
          padding: '10px 14px',
          color: '#DC2626',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
        }}>
          Failed to load messages: {error.shortMessage || error.message}
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 40,
        gap: 4,
      }}>
        <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#8E8E93' }}>No messages yet</div>
        <div style={{ fontSize: '0.8125rem', color: '#AEAEB2' }}>Send the first message to the chain</div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        marginTop: 'auto',
        padding: '16px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.map((msg, index) => {
          const isOwn = connectedAddress?.toLowerCase() === msg.sender.toLowerCase();
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const isNewGroup = !prevMsg || prevMsg.sender.toLowerCase() !== msg.sender.toLowerCase();
          const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
          const isLastInGroup = !nextMsg || nextMsg.sender.toLowerCase() !== msg.sender.toLowerCase();
          const isMiddle = !isNewGroup && !isLastInGroup;

          return (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isOwn ? 'flex-end' : 'flex-start',
              marginTop: isNewGroup ? 14 : 2,
            }}>
              {isNewGroup && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: '#8E8E93',
                  marginBottom: 3,
                  paddingLeft: isOwn ? 0 : 14,
                  paddingRight: isOwn ? 14 : 0,
                  fontWeight: 500,
                }}>
                  {isOwn ? 'You' : formatAddress(msg.sender)}
                </span>
              )}
              <div style={{
                maxWidth: '72%',
                padding: '8px 14px',
                fontSize: '0.9375rem',
                lineHeight: 1.45,
                wordBreak: 'break-word',
                ...(isOwn ? {
                  backgroundColor: '#33A1FD',
                  color: '#FFF',
                  borderRadius: isMiddle ? '18px 4px 4px 18px' : '18px 18px 4px 18px',
                } : {
                  backgroundColor: '#E9E9EB',
                  color: '#000',
                  borderRadius: isMiddle ? '4px 18px 18px 4px' : '18px 18px 18px 4px',
                }),
              }}>
                {msg.message}
              </div>
              {isLastInGroup && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: '#8E8E93',
                  marginTop: 3,
                  paddingLeft: isOwn ? 0 : 14,
                  paddingRight: isOwn ? 14 : 0,
                }}>
                  {formatTimestamp(msg.timestamp)}
                </span>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessageList;
