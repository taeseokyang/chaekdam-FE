import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

// 헤더 박스
const HeaderBox = styled.div`
  z-index: 1;
  /* background: #eeeeee; */
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
  color : #F96B5B;
  font-weight: 800;
  font-size: 26px;
`;

const Logout = styled.div`
  font-size: 14px;
  color: #bcbcbc;
`;



const Header = () => {

  return (
    <HeaderBox nobg={"true"}>
        <HeaderContent>
          <HomeTitle>
            책담
          </HomeTitle>
          <Logout>
              Logout
          </Logout>
        </HeaderContent>
      </HeaderBox>
      );
};

export default Header;

