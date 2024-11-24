import Header from "../../components/layout/Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import RecentPosts from "../../components/page/Home/RecentPosts";
import { useCookies } from "react-cookie";
import moment from "moment";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import ChatRoomList from "./ChatRoomList";
import Chat from "./Chat";


const HomeContainer = styled.div`
  position: relative;
  height: 100vh;  /* 화면 크기에 맞게 높이 설정 */
  /* background: #eeeeee; */
`;


const Content = styled.div`
  display: flex;

`;



const Home = () => {

  return (
    <HomeContainer>
      <Header/>
      <Content>
        <ChatRoomList/>
        <Chat/>
      </Content>
    
    </HomeContainer>
  );
};

export default Home;
