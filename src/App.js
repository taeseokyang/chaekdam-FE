import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/UserPages/Home";
import SignIn from "./pages/UserPages/SignIn";

const MainLayout = styled.div`
`;

function App() {
  return (
    <MainLayout>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/signin" Component={SignIn} />
        </Routes>
      </BrowserRouter>
    </MainLayout>
  );
}
export default App;

