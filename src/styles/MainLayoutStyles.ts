import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: #121212;
`;

export const LeftPanel = styled.div`
  flex: 0 0 30%;
  background-color: #1a1a1a;
  border-right: 1px solid #333;
  min-width: 300px;
  max-width: 450px;
`;

export const RightPanel = styled.div`
  flex: 1;
  background-color: #121212;
  color: white;
  overflow: auto;
  padding: 20px;
`;
