import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const HeaderBox = styled.div`
  z-index: 1;
  border-bottom: 1px solid #eeeeee;
  height: 10vh;
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HomeTitle = styled.div`
  color: #F96B5B;
  font-weight: 800;
  font-size: 26px;
`;

const Logout = styled.div`
  font-size: 14px;
  color: #bcbcbc;
  cursor: pointer; /* 클릭 가능하도록 커서 모양 추가 */
`;

const Header = () => {
  const [, setCookie, removeCookie] = useCookies(); // 쿠키 삭제를 위해 removeCookie 사용
  const navigate = useNavigate();

  const handleLogout = () => {
    // 쿠키 삭제
    removeCookie("id", { path: "/" });
    removeCookie("token", { path: "/" });
    removeCookie("userId", { path: "/" });
    removeCookie("nickname", { path: "/" });
    removeCookie("imgPath", { path: "/" });

    // 로그인 페이지로 리다이렉트
    navigate("/signin"); // 로그인 페이지로 리다이렉트
  };

  return (
    <HeaderBox nobg={"true"}>
      <HeaderContent>
        <HomeTitle>
          책담
        </HomeTitle>
        <Logout onClick={handleLogout}>
          Logout
        </Logout>
      </HeaderContent>
    </HeaderBox>
  );
};

export default Header;
