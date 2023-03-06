import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Nav from "../components/home/Nav";


const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: row;
`;

const Content = styled.div`
    position: relative;
  flex-grow: 1;
  background-color: ${props => props.theme.backgroundColor};
  padding: 30px;
`;

function Home() {

    return (
        <Container>
            <Nav />
            <Content>
                <Outlet />
            </Content>
        </Container>
    );
}


export default Home;