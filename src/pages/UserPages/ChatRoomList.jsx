import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";

const ChatBox = styled.div`
  /* position: fixed;
  z-index: 10;
  left: 0; */
  width: 20%;
  height: 90vh;
  margin-top: -1px;
  border-right: 1px solid #eeeeee;
  padding: 0px 20px;
  box-sizing: border-box;
  overflow: scroll;
`;

const ChatRoom = styled.li`
  padding: 10px 7px;
  background: ${({ isOn }) => (isOn ? '#f5f5f5' : '#ffffff')};;
  margin-bottom: 10px;
  border-radius: 12px;
  list-style: none;
`;

const UserImg = styled.a`
  display: block;
  height: 50px;
  width: 50px;
  margin-right: 10px;
  & img{
    border-radius: 100px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border: 1px solid #dddddd;
  }
`;

const ChatRoomContent = styled.div`
  flex: 1;
  white-space: nowrap; /* 텍스트를 한 줄로 표시 */
  overflow: hidden;
  & span{
    overflow: hidden;
    text-overflow: ellipsis; 
  }
  
  
`;

const SearchBox = styled.input`
  background: #f5f5f5;
  border-radius: 12px;
  height: 40px;
  width: 100%;
  margin-bottom: 30px;
  border: none;
  color:#333333;
  padding: 0px 10px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  &::placeholder {
      color: #aaaaaa; 
      font-size: 14px;
  }
`;

const BookName = styled.div`
font-size: 14px;
font-weight: 500;
`;

const Title = styled.div`
font-size: 14px;
font-weight: 700;
color: #bcbcbc;
margin-bottom: 12px;
`;

const BookList = styled.ul` 
`;

const FixedBox = styled.div` 
  margin-top: 10px;
`;

const EmptyBox = styled.div` 
  height: 100px;
`;

const ChatRoomList = () => {
  const [chatRoomList, setChatRoomList] = useState([{}, {},{}, {}, {},{}, {}, {},{}, {}, {},{}, {}]);

  const getTimeDiff = (createdAt) => {
    const createDate = new Date(createdAt);
    const now = new Date();

    const diffInMilliseconds = now - createDate;

    if (diffInMilliseconds < 60 * 60 * 1000) {
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      return `${diffInMinutes}분 전`;
    } else if (diffInMilliseconds < 24 * 60 * 60 * 1000) {
      const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      return `${diffInHours}시간 전`;
    } else {
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      return `${diffInDays}일 전`;
    }
  };
  return (
    <ChatBox>
      <FixedBox>
      <SearchBox placeholder={"책 검색"}></SearchBox>
      <Title>도서</Title>
      </FixedBox>
      {/* <EmptyBox>

      </EmptyBox> */}
     

      {chatRoomList.length == 0 ?
       null
        :
        <BookList>
          {chatRoomList.map((chatRoom, index) => (
              <ChatRoom isOn={index == 0} key={index}>
                <ChatRoomContent>
                  <BookName>정의란 무엇인가</BookName>
                </ChatRoomContent>
              </ChatRoom>
          ))}
        </BookList>
        }
    </ChatBox>
  );
};

export default ChatRoomList;