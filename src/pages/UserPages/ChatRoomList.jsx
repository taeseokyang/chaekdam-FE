import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie"; 
import { useNavigate } from "react-router-dom";

const ChatBox = styled.div`
  width: 20%;
  height: 90vh;
  margin-top: -1px;
  border-right: 1px solid #eeeeee;
  padding: 0px 20px;
  box-sizing: border-box;
  overflow: scroll;
`;
const SearchBox = styled.input`
  background: #f5f5f5;
  border-radius: 12px;
  height: 40px;
  width: 100%;
  margin-bottom: 30px;
  border: none;
  color: #333333;
  padding: 0px 7px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
  &::placeholder {
    color: #aaaaaa;
    font-size: 14px;
  }
`;
const BookList = styled.ul``;
const ChatRoom = styled.li`
  padding: 10px 7px;
  background: ${({ isOn }) => (isOn ? "#f5f5f5" : "#ffffff")};
  margin-bottom: 10px;
  border-radius: 12px;
  list-style: none;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5; 
  }
`;
const BookName = styled.div`
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;       
  overflow: hidden;          
  text-overflow: ellipsis;    
`;
const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #bcbcbc;
  margin-bottom: 12px;
`;
const FixedBox = styled.div`
  margin-top: 10px;
`;
const Nodata = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #bcbcbc;
`;
const PeopleCount = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #bcbcbc;
  margin-left: 5px;
`;
const TopInfo = styled.div`
  display: flex;
  align-items: center;
`;
const SubInfo = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #bcbcbc;
  white-space: nowrap; 
  overflow: hidden;        
  text-overflow: ellipsis;   
`;

const ChatRoomList = ({ roomId, setRoomId }) => {

  const [cookies] = useCookies(); 
  const navigate = useNavigate();

  // 도서 검색어
  const [searchKeyword, setSearchKeyword] = useState(""); 

  // 채팅방 리스트
  const [chatRoomList, setChatRoomList] = useState([]); 

  // 도서 검색 리스트
  const [bookList, setBookList] = useState([]); 

  // 디바운스 타이머 상태
  const [debounceTimer, setDebounceTimer] = useState(null); 

  // 채팅방 목록 get
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/chat/user`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      setChatRoomList(response.data.data);
    } catch (error) {
      console.error("채팅방 데이터 요청 실패", error);
      navigate("/signin");
    }
  };

  // 책 목록 get
  const fetchBooks = async (keyword) => {
    if (!keyword) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/books/search?keyword=${keyword}`
      );
      setBookList(response.data.data);
    } catch (error) {
      console.error("API 요청 실패", error);
      navigate("/signin"); 
    }
  };

  // 채팅방 참여
  const handleBookClick = async (isbn) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACK_URL}/participant/${isbn}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );
      console.log("참여 요청 성공:", response.data);
      setSearchKeyword(""); 
      fetchChatRooms();
    } catch (error) {
      console.error("참여 요청 실패:", error);
    }
  };

  // 검색어가 변경될 때마다 0.5초 뒤에 책 검색
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer); // 이전 타이머 취소

    const timer = setTimeout(() => {
      fetchBooks(searchKeyword);
    }, 500);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 채팅방 목록 불러오기
  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <ChatBox>
      <FixedBox>
        <SearchBox
          placeholder={"책 검색"}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Title>도서</Title>
      </FixedBox>

      {searchKeyword.length !== 0 ? (
        <BookList>
          {bookList.length === 0 ? (
            <Nodata>검색 결과가 없습니다.</Nodata>
          ) : (
            bookList.map((book, index) => (
              <ChatRoom key={index} onClick={() => handleBookClick(book.isbn)}>
                <BookName>{book.title}</BookName>
                <SubInfo>{book.author}</SubInfo>
              </ChatRoom>
            ))
          )}
        </BookList>
      ) : (
        <BookList>
          {chatRoomList.length === 0 ? (
            <Nodata>도서를 추가하세요.</Nodata>
          ) : (
            chatRoomList.map((chatRoom, index) => (
              <ChatRoom isOn={chatRoom.roomId === roomId} key={index} onClick={() => setRoomId(chatRoom.roomId)}>
                <TopInfo>
                  <BookName>{chatRoom.bookName}</BookName>
                  <PeopleCount>{chatRoom.peopleCount}</PeopleCount>
                </TopInfo>
                <SubInfo>{chatRoom.lastMessage}</SubInfo>
              </ChatRoom>
            ))
          )}
        </BookList>
      )}
    </ChatBox>
  );
};

export default ChatRoomList;
