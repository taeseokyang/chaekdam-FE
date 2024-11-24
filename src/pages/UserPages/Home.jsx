import Header from "../../components/layout/Header";
import styled from "styled-components";
import { useState } from 'react';
import ChatRoomList from "./ChatRoomList";
import Chat from "./Chat";

const HomeContainer = styled.div`
  position: relative;
  height: 100vh;
`;
const Content = styled.div`
  display: flex;
`;

const Home = () => {
  // 현재 채팅방 id
  const [roomId, setRoomId] = useState("");
  return (
    <HomeContainer>
      <Header />
      <Content>
        <ChatRoomList roomId={roomId} setRoomId={setRoomId} />
        <Chat roomId={roomId} />
      </Content>
    </HomeContainer>
  );
};

export default Home;
