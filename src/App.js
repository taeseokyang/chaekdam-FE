import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/UserPages/Home";


const MainLayout = styled.div`
`;

function App() {
  return (
    <MainLayout>
      <BrowserRouter>
        <Routes>
          {/* 유저 */}
          <Route path="/" Component={Home} />

        </Routes>
      </BrowserRouter>
    </MainLayout>
  );
}
export default App;

