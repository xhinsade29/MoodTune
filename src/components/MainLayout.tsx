import styled from 'styled-components';
import ChatBox from './ChatBox';
import MusicPlayer from './MusicPlayer';
import { useState } from 'react';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const LeftPanel = styled.div`
  flex: 0 0 400px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: #121212;
  color: white;
`;

const MainLayout = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');

  const handleEmotionUpdate = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  return (
    <LayoutContainer>
      <LeftPanel>
        <ChatBox onEmotionUpdate={handleEmotionUpdate} />
      </LeftPanel>
      <RightPanel>
        <MusicPlayer emotion={currentEmotion} />
      </RightPanel>
    </LayoutContainer>
  );
};

export default MainLayout;
