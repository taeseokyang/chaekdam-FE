import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie"; // 쿠키에서 토큰을 가져오기 위해 사용
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
    background: #f5f5f5; /* 마우스를 올렸을 때 배경색 변경 */
  }
`;

const BookName = styled.div`
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;        /* 텍스트를 한 줄로 표시 */
  overflow: hidden;           /* 넘치는 텍스트를 숨김 */
  text-overflow: ellipsis;    /* 넘친 텍스트에 '...'을 표시 */
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


const ChatRoomList = ({roomId, setRoomId}) => {
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태
  const [chatRoomList, setChatRoomList] = useState([]); // 채팅방 리스트 상태
  const [bookList, setBookList] = useState([]); // 책 리스트 상태
  const [debounceTimer, setDebounceTimer] = useState(null); // 디바운스 타이머 상태
  const [cookies] = useCookies(); // 쿠키에서 토큰을 가져오기 위해 사용
  const navigate = useNavigate();

  // 1. 채팅방 목록을 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/chat/user`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });
      console.log(response.data.data);
      setChatRoomList(response.data.data); // API 응답에서 채팅방 데이터 추출
    } catch (error) {
      console.error("채팅방 데이터 요청 실패", error);
      navigate("/signin"); // 오류 발생 시 로그인 페이지로 리다이렉트
    }
  };

  // 2. 검색어로 책 목록을 가져오는 함수
  const fetchBooks = async (keyword) => {
    if (!keyword) return; // 검색어가 없으면 요청을 하지 않음

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACK_URL}/books/search?keyword=${keyword}`
      );
      setBookList(response.data.data); // API 응답에서 books 데이터 추출
    } catch (error) {
      console.error("API 요청 실패", error);
      navigate("/signin"); // 오류 발생 시 로그인 페이지로 리다이렉트
    }
  };

  // 3. 책 클릭 시 참여 요청 및 검색어 초기화
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

      // 참여 후 검색어 초기화하고 채팅방 목록 새로 불러오기
      setSearchKeyword(""); // 검색어 초기화
      fetchChatRooms(); // 채팅방 목록 새로 불러오기
    } catch (error) {
      console.error("참여 요청 실패:", error);
    }
  };

  // 디바운스 기능 - 검색어가 변경될 때마다 0.5초 뒤에 책 검색
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer); // 이전 타이머 취소

    const timer = setTimeout(() => {
      fetchBooks(searchKeyword); // 0.5초 후에 API 호출
    }, 500);

    setDebounceTimer(timer); // 새로 설정된 타이머를 상태에 저장

    return () => clearTimeout(timer); // 컴포넌트가 unmount 될 때 타이머 정리
  }, [searchKeyword]); // searchKeyword가 변경될 때마다 실행

  // 컴포넌트가 마운트될 때 채팅방 목록을 불러오기
  useEffect(() => {
    fetchChatRooms(); // 채팅방 목록 불러오기
  }, []);

  return (
    <ChatBox>
      <FixedBox>
        <SearchBox
          placeholder={"책 검색"}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 입력 처리
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
