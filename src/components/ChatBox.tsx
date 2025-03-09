import React, { useState } from 'react';
import { analyzeEmotion } from '../services/emotionAnalysis';
import {
  ChatContainer,
  MessageList,
  MessageBubble,
  InputArea,
  Input,
  SendButton
} from '../styles/ChatBoxStyles';

interface ChatBoxProps {
  onEmotionUpdate: (emotion: string) => void;
}

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
