import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import PageTitle from "../../components/PageTitle";
import { routes } from "../../route-path";


const Container = styled.div`
    display: flex;
    flex-direction: column;
`;


const Nav = styled.div`
    background: ${props=> `linear-gradient(#c97252 85%, ${props.theme.privateColor} 100%)`};
    height: 50px;
    display: flex;
    align-items: center;
    justify-content:center;
`;

const Title = styled.span`
    padding:0px 20px;
    font-size: 20px;
    font-weight: 600;
`;
const Wrapper = styled.div`
    width: 900px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const NavItems = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;

const NavItem = styled.div`
    padding:0 10px;
    margin: 0 10px;
    svg{
        width: 26px;
        height: 26px;
    }
    &:hover{
        font-weight: 600;
        svg{
            color:white;
        }
    }
`;

const Conatent = styled.div`
    padding: 30px 20px;
    margin: 0 auto;
`

function Manage(){
    return(
        <Container>
            <PageTitle title="관리"/>
            <Nav>
                <Wrapper>
                    <Title>관리</Title>
                    <NavItems>
                        <Link to={routes.home}><NavItem><FontAwesomeIcon icon={faHome}/></NavItem></Link>
                        <Link to={routes.categories}><NavItem>Categories</NavItem></Link>
                    </NavItems>
                </Wrapper>
            </Nav>
            <Conatent>
                <Wrapper>
                    <Outlet/>
                </Wrapper>
            </Conatent>
        </Container>
    )
}


export default Manage;