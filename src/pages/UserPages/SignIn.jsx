import { useState, useEffect } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Content = styled.div`
  display: flex;
  gap: 10px;
  overflow: hidden;
  align-items: center;
  max-width: 1200px;
  min-height: 500px;
  margin: 0px auto;
  flex-direction: column;
  padding: 10px 20px;
`;
const InputBox = styled.input`
  width: 400px;
  padding: 17px 10px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f5f5f5;
  font-weight: 700;
  color: #000000;
  border: none;
  outline: none;
`;
const FileInputWrapper = styled.div`
  position: relative;
  width: 400px;
  margin-bottom: 20px;
`;
const FileInput = styled.input`
  display: none;
`;
const FileButton = styled.button`
  width: 100%;
  padding: 15px 0px;
  border-radius: 12px;
  background: ${(props) => (props.isFileSelected ? "#F96B5B" : "#ffc7c0")}; 
  text-align: center;
  font-weight: 800;
  color: #ffffff;
  border: none;
  outline: none;
  cursor: pointer;
`;
const ErrorMessage = styled.div`
  color: #828282;
  margin: 10px 0;
  font-size: 16px;
  font-weight: 700;
`;
const Login = styled.div`
  width: 400px;
  padding: 15px 0px;
  border-radius: 12px;
  background: #F96B5B;
  text-align: center;
  font-weight: 800;
  color: #ffffff;
  outline: none;
  cursor: pointer;
`;
const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
  color: #F96B5B;
  margin: 100px 0px 50px 0px;
`;

const SignIn = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies();

  // 로그인, 회원가입 state
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [file, setFile] = useState(null); 

  // 로그인 단계
  const [loginStatus, setLoginStatus] = useState(0);

  // 오류 메세지
  const [errorMessage, setErrorMessage] = useState('');
  
  // 파일 선택
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); 
  };

  // 다음 버튼 클릭
  const handleContinueClick = () => {
    if (!id) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    }
    setErrorMessage("");
    if (loginStatus === 0) {
      checkIdExists();
    } else if (loginStatus === 1) {
      handleSignIn();
    } else if (loginStatus === 2) {
      handleSignUp();
    }
  };
  
  // 계정 존재 확인
  const checkIdExists = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/check/${id}`);
      setLoginStatus(response.data.data.status);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  // 로그인
  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/login`, {
        id,
        password
      });
      if (response.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        setCookie("id", response.data.data.id, { path: "/", expires });
        setCookie("token", response.data.data.token, { path: "/", expires });
        setCookie("userId", response.data.data.userId, { path: "/", expires });
        setCookie("nickname", response.data.data.nickname, { path: "/", expires });
        setCookie("imgPath", response.data.data.imgPath, { path: "/", expires });
        navigate("/");
      } else {
        setErrorMessage("아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  // 회원 가입
  const handleSignUp = async () => {
    if (!password || !nickname) {
      setErrorMessage("모든 항목을 작성해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify({
      id,
      nickname,
      password
    })],
      {
        type: "application/json"
      }));
    formData.append('pic', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        setCookie("id", response.data.data.id, { path: "/", expires });
        setCookie("token", response.data.data.token, { path: "/", expires });
        setCookie("userId", response.data.data.userId, { path: "/", expires });
        setCookie("nickname", response.data.data.nickname, { path: "/", expires });
        setCookie("imgPath", response.data.data.imgPath, { path: "/", expires });
        navigate("/");
      } else if (response.data.code === 409) {
        setErrorMessage("이미 해당 아이디를 사용하는 계정이 존재합니다.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  // id 변경시 처음으로 돌아감
  useEffect(() => {
    setLoginStatus(0);
  }, [id]);

  return (
    <Content>
      <Title>책담</Title>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <InputBox
        placeholder="아이디"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      {loginStatus === 2 && (
        <>
          <InputBox
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <InputBox
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputBox
            placeholder="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FileInputWrapper>
            <FileButton
              type="button"
              onClick={() => document.getElementById("file-input").click()} 
              isFileSelected={file !== null}
            >
              {file ? "파일이 선택되었습니다" : "프로필 사진 선택"}
            </FileButton>
            <FileInput
              id="file-input"
              type="file"
              onChange={handleFileChange}
            />
          </FileInputWrapper>
        </>
      )}
      {loginStatus === 1 && (
        <InputBox
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      <Login onClick={handleContinueClick}>
        {loginStatus === 2 ? "회원가입" : "다음"}
      </Login>
    </Content>
  );
};

export default SignIn;
