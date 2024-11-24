import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import axios from "axios";

const ChatBox = styled.div`
  position: relative;
  width: 80%;
  height: 90vh;
  overflow: scroll;
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
height: 80px;
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
  margin-top: 10px;
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
const UserImg = styled.img`
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

const Chat = ({ roomId }) => {
  const location = useLocation(); // 상태 전달 받기 위해
  const [cookies] = useCookies(); // 쿠키 사용을 위해
  const { metype, id, interlocutorId, post } = useParams(); // 주소의 파라미터 값 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위해
  const inputMessageRef = useRef(); // 입력 박스 포커스용
  const messagesEndRef = useRef(null); // 메세지 최하단 이동용
  const ws = useRef(null); // 웹소켓

  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 메시지가 변경될 때마다 최하단으로 스크롤
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);  // messageList가 변경될 때마다 실행됨.

  useEffect(() => {
    if (!cookies.token) {
      navigate("/signin");
      return;
    }

    const fetchMessages = async () => {
      try {
        // 메세지 가져오기 api요청
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/message/${roomId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        });
        setMessageList(response.data.data);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };

    if (roomId.length !== 0) {
      fetchMessages();
    }
  }, [roomId, cookies.token, navigate]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 웹 소켓 연결
    ws.current = new WebSocket(`${process.env.REACT_APP_BACK_SOKET_URL}/ws/chat`);

    // 세션 등록
    ws.current.onopen = () => {
      const message = {
        type: 'ENTER',
        roomId: roomId,
        userId: cookies.userId,
        message: "",
      };
      ws.current.send(JSON.stringify(message));
    };

    // 메시지를 받으면 실행될 코드
    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      const currentDate = new Date();
      const newMessage = {
        chatId: new Date(),
        userId: receivedMessage.userId,
        sentAt: new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString(),
        message: receivedMessage.message,
      };
      setMessageList(prevMessageList => [...prevMessageList, newMessage]);
    };

    return () => {
      ws.current.close();
    };
  }, [cookies.userId, roomId]);

  // 메세지 보내기
  const sendMessage = () => {
    // 아무 입력도 안했다면
    if (inputMessage < 1) {
      inputMessageRef.current.focus();
      return;
    }

    // 메세지 형식으로 변환후 전송
    const message = {
      type: 'TALK',
      roomId: roomId,
      userId: cookies.userId,
      message: inputMessage,
    };
    ws.current.send(JSON.stringify(message));
    setInputMessage('');
    inputMessageRef.current.focus();

    // 메세지 보내고 나서도 최하단으로 스크롤
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const activeEnter = (event) => {
    if (event.code === 'Enter') {
      sendMessage();
    }
  };

  return (
    <ChatBox>
      <MessagesBox>
        {messageList.length === 0 ? null : messageList.map((message, index) => {
          const isMe = (message.userId === cookies.userId);
          return (
            <div key={index}>
              {index !== 0 && messageList[index - 1].sentAt.slice(5,10) !== message.sentAt.slice(5,10) ? 
                <DateChange>{ message.sentAt.slice(0,10).split("-").join("/") }</DateChange> 
                : null}
              <MessageBlock isMe={isMe}>
                {isMe ? null :
                <UserInfoBox>
                    <UserImg src={ process.env.REACT_APP_BACK_URL + "/image/" + message.userImgPath}/>
                </UserInfoBox>
                }

                <MessageBox>
                {isMe ? null :
                <UserName>{message.nickname}</UserName>}
                <MessageContent>
                <MessageTime isMe={isMe}>{message.sentAt.slice(11,16)}</MessageTime>
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
        <InputBox
          placeholder={roomId === "" ? "도서를 선택하세요" : "메세지 보내기"}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          autocomplete="off"
          onKeyPress={activeEnter}
          disabled={roomId === ""}
          ref={inputMessageRef}
        />
        <SendBtn onClick={sendMessage} disabled={roomId === ""}>
          SEND
        </SendBtn>
      </MessageInputBox>
    </ChatBox>
  );
};

export default Chat;
