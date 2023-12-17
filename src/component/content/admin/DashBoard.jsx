import styled from "styled-components";
import Header from "../../layout/Header";


const AdminBox = styled.div`
    padding: 0 20px;
`;

const Subtitle = styled.div`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #777777;
`;

const DashBoardBox = styled.div`
  border: 2px solid #dddddd;
  border-radius: 10px;
  padding: 10px 20px;
`;
const DashBoardDataLine = styled.li`
  list-style: none;
  display: flex;
  justify-content: space-between;
  margin: 15px 0px;
`;
const DashBoardDataName = styled.span`
    font-weight: bold;
    color:#555555;
`;
const DashBoardData = styled.span`
    color: #aaaaaa;
`;
const ManageBox = styled.div`
`;
const ManageBtn = styled.div`
  margin-bottom: 10px;
  height: 50px;
  width: 100%;
  border: 2px solid #dddddd;
  border-radius: 10px;

  text-align: center;
  line-height: 50px;
  font-size: 20px;
  font-weight: 600;
  color: #777777;

  &:hover{
    color: #5A8CEF;
  }

`;

const Dashboard = () => {
    return (
        <AdminBox>
            <Header headerType={"chat"} headerText={"관리자"}></Header>
            <Subtitle>DASHBOARD</Subtitle>
            <DashBoardBox>
                <ul>
                    <DashBoardDataLine>
                        <DashBoardDataName>회원 수</DashBoardDataName>
                        <DashBoardData>명</DashBoardData>
                    </DashBoardDataLine>
                    <DashBoardDataLine>
                        <DashBoardDataName>인중된 회원 수</DashBoardDataName>
                        <DashBoardData>명</DashBoardData>
                    </DashBoardDataLine>
                    <DashBoardDataLine>
                        <DashBoardDataName>게시물 수</DashBoardDataName>
                        <DashBoardData>개</DashBoardData>
                    </DashBoardDataLine>
                    <DashBoardDataLine>
                        <DashBoardDataName>완료된 게시물 수</DashBoardDataName>
                        <DashBoardData>개</DashBoardData>
                    </DashBoardDataLine>
                    <DashBoardDataLine>
                        <DashBoardDataName>후기 수</DashBoardDataName>
                        <DashBoardData>개</DashBoardData>
                    </DashBoardDataLine>
                </ul>
                
            </DashBoardBox>
            <Subtitle>MANAGE</Subtitle>
            <ManageBox>
                <ManageBtn>학생회 대여품 관리</ManageBtn>
                <ManageBtn>인증 관리</ManageBtn>
                <ManageBtn>악성 유저 관리</ManageBtn>
                <ManageBtn>문의함</ManageBtn>
                <ManageBtn>공지사항 관리</ManageBtn>
            </ManageBox>
            
        </AdminBox>
    );
  };

export default Dashboard;