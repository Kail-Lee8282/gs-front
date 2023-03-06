import { useReactiveVar } from "@apollo/client";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { disableDarkMode, enableDarkMode, isDarkModeVar } from "../apollo";

const Container = styled.div`
    position: absolute;
    right: 20px;
    bottom:20px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0,9);
    
`;

const ModeBtn = styled.div<{isDarkMode:Boolean}>`
    display: flex;
    justify-content: center;
    align-items: center; 
    color: ${props=>props.isDarkMode ? "white":"black"};
    width: 50px;
    height:50px;
    background-color: ${props=>props.isDarkMode ? "#1e272e":"#bdc3c7"};
    cursor:pointer;
    :hover{
        opacity: 0.8;
    }
`;

function DarkMode(){

    const darkMode = useReactiveVar(isDarkModeVar);
    return(
        <Container>
            <ModeBtn onClick={darkMode?disableDarkMode:enableDarkMode} isDarkMode={darkMode}>
                <FontAwesomeIcon icon={darkMode?faSun:faMoon} size="2x"/>
            </ModeBtn>
        </Container>
    );
}

export default DarkMode;