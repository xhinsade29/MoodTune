import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

export const MessageBubble = styled.div<{ isUser: boolean }>`
  background-color: ${props => props.isUser ? '#007AFF' : '#E9ECEF'};
  color: ${props => props.isUser ? 'white' : 'black'};
  padding: 10px 15px;
  border-radius: 18px;
  margin: 8px;
  max-width: 70%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

export const InputArea = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 14px;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
