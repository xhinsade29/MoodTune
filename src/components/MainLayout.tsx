import { useState } from 'react';
import ChatBox from './ChatBox';
import MusicPlayer from './MusicPlayer';
import {
  LayoutContainer,
  LeftPanel,
  RightPanel
} from '../styles/MainLayoutStyles';

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
