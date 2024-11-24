import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import axios from "axios";

const ChatBox = styled.div`
  position: relative;
  width: 80%;
  height: 90vh;
`;

const DateChange = styled.div`
  margin: 20px auto;
  width: 70%;
  height: 30px;
  border-radius: 20px;
  background: #eeeeee56;
  text-align: center;
  line-height: 30px;
  color:#aaaaaa;
`;

// 메세지 입력 박스
const MessageInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 80%;
  height: 75px;
  background: #ffffff;
`;

// 메세지 입력
const InputBox = styled.input`
  margin: 10px;
  width: 85%;
  height: 40px;
  background: #f5f5f5;
  border: none;
  border-radius: 20px;
  color:#333333;
  padding: 0px 20px;
  font-size: 18px;
  outline: none;
  &::placeholder {
      color: #aaaaaa; 
      font-size: 18px;
  }
`;

// 전송 버튼
const SendBtn = styled.button`
  margin: 10px 10px 0px 0px;
  height: 40px;
  background: none;
  border: none;
  width: 15%;
  border-radius: 13px;
  color: #ffffff;
  font-weight: 600;
  background: #F96B5B;
`;

// 최하단 메세지 앵커
const BottomPoint = styled.div`
`;


// 메세지들
const MessagesBox = styled.ul`
  background: #ffffff;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

// 메세지 라인 박스
const MessageBlock = styled.div`
  text-align:  ${({ isMe }) => (isMe ? 'right' : 'left')};
  width: 100%;
  display: flex;
  /* flex-direction: column; */
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
`;

// 메세지 전송 시각
const MessageTime = styled.span`
  font-size: 12px;
  color: #aaaaaa;
  order:  ${({ isMe }) => (isMe ? 1 : 2)};
  position: relative;
  top: 5px;
  right: ${({ isMe }) => (isMe ? '5px' : '-5px')};
`;

// 메세지
const Message = styled.li`
  font-family: 'Noto Sans KR';
  order:  ${({ isMe }) => (isMe ? 2 : 1)};
  word-break: break-all;
  margin: 3px 0px;
  display:inline-block ;
  vertical-align: left;
  text-align: left;
  max-width: 250px;
  background: ${({ isMe }) => (isMe ? '#F96B5B' : 'none')};
  color: ${({ isMe }) => (isMe ? '#ffffff' : '000000')};
  padding: 10px 15px;
  line-height: 20px;
  list-style: none;
  border:${({ isMe }) => (isMe ? 'none' : '1px solid #eeeeee')};
  
  border-radius: 20px;
  border-top-right-radius: ${({ isMe }) => (isMe ? '10px' : 'none')};
  border-top-left-radius: ${({ isMe }) => (isMe ? 'none' : '10px')};
  font-weight: 400;
`;

const UserInfoBox = styled.div`
`;
const UserImg = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid #eeeeee;
  border-radius: 100px;
  margin-right: 10px;
`;
const UserName = styled.div`
  font-weight: 500;
  color: #333333;
`;

const MessageBox = styled.div`
  text-align:  ${({ isMe }) => (isMe ? 'right' : 'left')};
  display: flex;
  flex-direction: column;
`;

const MessageContent = styled.div`
  display: flex;
`;


const Chat = () => {
  const location = useLocation(); // 상태 전달 받기 위해
  const [cookies] = useCookies(); // 쿠키 사용을 위해
  const { metype, id, interlocutorId, post } = useParams(); // 주소의 파라미터 값 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위해
  const [rateData, setRateData] = useState(-1);
  const [review, setReview] = useState("");

  const postId = post;
  // 오랜 시간이 지나고 채팅 안에서 채팅룸으로 나가면 오류나는 이슈 있음.

  const inputMessageRef = useRef(); // 입력 박스 포커스용
  const messagesEndRef = useRef(null); // 메세지 최하단 이동용
  const ws = useRef(null); // 웹소켓

  // 상태
  const [interlocutorInfo, setInterlocutorInfo] = useState({});
  const [messageList, setMessageList] = useState([{message:"hello", userId:"1"},{message:"hello", userId:"2"}]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [postInfo, setPostInfo] = useState({ needAt: [], returnAt: [] });

  const [isDoneModalOn, setIsDoneModalOn] = useState(false);
  const [isReviewModalOn, setIsReviewModalOn] = useState(false);

  const [isBorrower, setIsBorrower] = useState(false);
  // 최하단 이동용
  // useEffect(() => {
  //   messagesEndRef.current.scrollIntoView();
  // },);

//   useEffect(() => {
//     if (!cookies.token) {
//       navigate("/signin");
//       return;
//     }
//     // 로딩 시작
//     setLoading(true);
//     // 모든 메세지 가져오기
//     const fetchUserInfo = async () => {
//       try {
//         // 토큰 쿠키가 없다면 로그인 페이지로 이동
//         if (!cookies.token) {
//           navigate("/signin");
//           return;
//         }
//         // 메세지 가져오기 api요청
//         const response = await axios.get(process.env.REACT_APP_BACK_URL + "/account?id=" + interlocutorId, {
//           headers: {
//             Authorization: `Bearer ${cookies.token}`,
//           },
//         });
//         // 메세지 상태 저장
//         setInterlocutorInfo(response.data.data);
        

//         if (response.data.code != 200) {
//           navigate("/signin");
//         }
//       } catch (error) {
//         console.error("오류 발생:", error);
//       }
//     };

//     const fetchMessages = async () => {
//       try {
//         // 토큰 쿠키가 없다면 로그인 페이지로 이동
//         if (!cookies.token) {
//           navigate("/signin");
//           return;
//         }
//         // 메세지 가져오기 api요청
//         const response = await axios.get(process.env.REACT_APP_BACK_URL + "/message/" + id, {
//           headers: {
//             Authorization: `Bearer ${cookies.token}`,
//           },
//         });
//         // 메세지 상태 저장
//         setMessageList(response.data.data);
//       } catch (error) {
//         console.error("오류 발생:", error);
//       }

//     };

//     // 게시물 정보 가져오기
//     const fetchPostInfo = async () => {
//       try {
//         // 토큰 쿠키가 없다면 로그인 페이지로 이동
//         if (!cookies.token) {
//           navigate("/signin");
//           return;
//         }

//         // 게시물 정보 가져오기 api 요청
//         const response = await axios.get(process.env.REACT_APP_BACK_URL + "/post/" + postId, {
//           headers: {
//             Authorization: `Bearer ${cookies.token}`,
//           },
//         });

//         setPostInfo(response.data.data);
//       } catch (error) {
//         // 없는 게시물 이라면
//         if (error.response && error.response.status === 404) {
//           console.error("존재하지 않는 게시물", error);
//           navigate("/");
//         } else {
//           console.error("오류 발생:", error);
//         }
//       }
//     };
//     fetchMessages();
//     fetchPostInfo();
//     fetchUserInfo();

//     let prevVisualViewport = 0
//     function handleVisualViewportResize() {  
//       const currentVisualViewport = window.visualViewport.height
    
//       if (
//         prevVisualViewport - 30 > currentVisualViewport &&
//         prevVisualViewport - 100 < currentVisualViewport
//       ) {
//         const scrollHeight = window.document.scrollingElement.scrollHeight
//         const scrollTop = scrollHeight - window.visualViewport.height
    
//         window.scrollTo(0, scrollTop) // 입력창이 키보드에 가려지지 않도록 조절
//       }
    
//       prevVisualViewport = window.visualViewport.height
//     }
    
//     window.visualViewport.onresize = handleVisualViewportResize  
//     // 0.3초 동안 로딩후 로딩 종료
//     setTimeout(() => {
//       setLoading(false);
//     }, 300)

//   }, [cookies.token, id, navigate]);


// useEffect(() => {
//   // 컴포넌트가 마운트되면 웹 소켓 연결
//   ws.current = new WebSocket(process.env.REACT_APP_BACK_SOKET_URL + '/ws/chat');

//   // 세션 등록
//   ws.current.onopen = () => {
//     const message = {
//       type: 'ENTER',
//       userType: metype === "b" ? "LENDER" : "BORROWER",
//       roomId: id,
//       sender: cookies.userId,
//       message: "",
//     };
//     // JSON 형식으로 문자열 변환 후 웹 소켓으로 전송
//     ws.current.send(JSON.stringify(message));
//   };

//   // 메시지를 받으면 실행될 코드
//   ws.current.onmessage = (event) => {
//     const receivedMessage = JSON.parse(event.data);
//     const currentDate = new Date();

//     // 받은 메세지 메세지 리스트 상태에 넣기위해 딕셔너리화
//     var d= new Date();
//     const newMessage = {
//       chatId: new Date(),
//       sentAt: new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString(),
//       message: receivedMessage.message,
//       userType: receivedMessage.userType,
//     };
//     setMessageList(prevMessageList => [...prevMessageList, newMessage]);
//   };
//   // 컴포넌트가 언마운트될 때 웹 소켓 연결 해제
//   return () => {
//     ws.current.close();
//   };
// }, [cookies.userId, id, metype]);

// // 메세지 보내기
// const sendMessage = () => {

//   // 아무 입력도 안했다면
//   if (inputMessage < 1) {
//     inputMessageRef.current.focus();
//     return;
//   }
//   // 메세지 형식으로 변환후 전송
//   const message = {
//     type: 'TALK',
//     userType: metype === "b" ? "BORROWER" : "LENDER",
//     roomId: id,
//     sender: cookies.userId,
//     message: inputMessage,
//   };
//   ws.current.send(JSON.stringify(message));
//   setInputMessage('');
//   inputMessageRef.current.focus();
// };

// // 엔터 입력하면 전송하도록
// const activeEnter = (event) => {
//   if (event.code === 'Enter') {
//     sendMessage();
//   }
// };


return (
  <ChatBox>
    <MessagesBox>
      {messageList.length == 0 ? null : messageList.map((message, index) => {
        const isMe = (message.userId == 2);
        return (
          <div>
            {/* {index !== 0 && messageList[index - 1].sentAt.slice(5,10) !== message.sentAt.slice(5,10) ? <DateChange>{ message.sentAt.slice(0,10).split("-").join("/") }</DateChange> : null} */}
            <MessageBlock isMe={isMe}>
              {isMe ? null :
              <UserInfoBox>
                  <UserImg>

                  </UserImg>
                  <UserName>

                  </UserName>
              </UserInfoBox>
              }

              <MessageBox>
              {isMe ? null :
              <UserName>한강</UserName>}
              <MessageContent>
              <MessageTime isMe={isMe}>{"12:30"}</MessageTime>
              <Message key={index} isMe={isMe}>
                {message.message}
              </Message>
              </MessageContent>
             
              </MessageBox>
            
            </MessageBlock>
          </div>
        );

      })}
      <BottomPoint ref={messagesEndRef}></BottomPoint>
    </MessagesBox>

    <MessageInputBox>
      <InputBox placeholder={postInfo.isClose ? "완료된 요청입니다" : "메세지 보내기"}
        value={inputMessage}
        id="inputbox"
        onChange={(e) => {
          // setInputMessage(e.target.value);
        }}
        autocomplete="off"
        onKeyPress={(e) => { activeEnter(e) }}
        // onKeyDown={handleKeyDown}
        disabled={postInfo.isClose}
        ref={inputMessageRef}
      ></InputBox>
      <SendBtn isNoText={inputMessage < 1}>
        SEND
      </SendBtn>
    </MessageInputBox>
  </ChatBox>
);
};

export default Chat;