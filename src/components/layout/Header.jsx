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

const Title = styled.div`
  color: #F96B5B;
  font-weight: 800;
  font-size: 26px;
`;

const Logout = styled.div`
  font-size: 14px;
  color: #bcbcbc;
  cursor: pointer; 
`;

const Header = () => {
  const [, , removeCookie] = useCookies();
  const navigate = useNavigate();

  // 로그아웃
  const handleLogout = () => {
    removeCookie("id", { path: "/" });
    removeCookie("token", { path: "/" });
    removeCookie("userId", { path: "/" });
    removeCookie("nickname", { path: "/" });
    removeCookie("imgPath", { path: "/" });
    navigate("/signin");
  };

  return (
    <HeaderBox nobg={"true"}>
      <HeaderContent>
        <Title>
          책담
        </Title>
        <Logout onClick={handleLogout}>
          Logout
        </Logout>
      </HeaderContent>
    </HeaderBox>
  );
};

export default Header;
