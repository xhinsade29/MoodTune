import React, { useState } from 'react';
import styled from 'styled-components';
import { analyzeEmotion } from '../services/emotionAnalysis';

interface ChatBoxProps {
  onEmotionUpdate: (emotion: string) => void;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  background-color: ${props => props.isUser ? '#007AFF' : '#E9ECEF'};
  color: ${props => props.isUser ? 'white' : 'black'};
  padding: 10px 15px;
  border-radius: 18px;
  margin: 8px;
  max-width: 70%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 14px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatBox: React.FC<ChatBoxProps> = ({ onEmotionUpdate }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{text: string; isUser: boolean}>>([]);

  const handleSend = async () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      
      // Analyze emotion and update parent
      const result = await analyzeEmotion(message);
      onEmotionUpdate(result.emotion);
      
      setMessage('');
    }
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageBubble key={index} isUser={msg.isUser}>
            {msg.text}
          </MessageBubble>
        ))}
      </MessageList>
      <InputArea>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatBox;
