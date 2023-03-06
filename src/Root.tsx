import styled from "styled-components";
import { Outlet } from "react-router-dom";
import DarkMode from "./components/DarkMode";

const Container = styled.div`
    width: 100%;
    margin:0 auto;
`

function Root() {

    return (
        <Container>
            {/* <DarkMode/> */}
            <Outlet />
        </Container>
    );
}

export default Root;