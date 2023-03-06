import { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { faArrowRightFromBracket, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "../../route-path";
import { getAuth } from "firebase/auth";
import { authService } from "../../fBase";
import { BaseBox, Box, Button } from "../Share";
import useUser from "../../hooks/useUser";
import { client, loginUserOut } from "../../apollo";

const Container = styled.div`
    min-width: 200px;
    padding:10px;
    display: flex;
    flex-direction:column;
    align-items:center;
`;


const Logo = styled.img`
    border-radius: 50%;
    width: 154px;
    height:154px;
    cursor:pointer;
`;

const UserInfoContianer = styled.div`
    width: 100%;
    margin: 30px 0px;
`

const UserInfo = styled(BaseBox)`
  padding:20px;
`;

const UserGradeAndName = styled.div`
    display: flex;
    justify-content: space-around;
    span{
        font-size: 16px;
    }
    span:last-child{
       font-weight:600; 
    }
`;
const UserActions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    span{
        margin-left:5px;
    }
`;

const NavButtonWrapper = styled.div`
    width: 100%;
    &>ul>li{
        margin:20px 0px;
    }
`;
const NavButton = styled.div<{ focus?: boolean }>`
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: ${props => props.focus ? 600 : 400};
    user-select: none;
    cursor: pointer;
    &:hover{
        font-weight:600;
    }
`;

const NavBox = styled(Box)`
  padding:10px 20px;
  margin-top: 10px;
  div{
    padding: 10px 0px;
  }
`;

const ActionButton = styled(BaseBox)`
    background-color: inherit;
    color:inherit;
    font-size:inherit;
    padding:0px;
    width: auto;
`

type Menus = {
    name: string;
    path?: string;
    selected?: boolean;
    children?: Menus[];
}

function Nav() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [menus, setMenus] = useState<Menus[]>([]);

    const extensionMenu = (index: number) => {
        const updateMenus = [...menus];
        updateMenus[index].selected = !updateMenus[index].selected;
        setMenus(updateMenus);
    }

    const moveContent = (path?: string) => {
        if (path !== undefined) {
            navigate(path);
        }
    }


    const onLogout = () => {
        loginUserOut();
        client.resetStore();
        navigate(routes.home);
    }


    const onMoveHome = ()=>{
        navigate(routes.home);
    }

    useEffect(() => {
        setMenus([
            { name: "아이템 발굴", path: routes.itemSearch },
            { name: "아이템 분석", children: [{ name: "키워드 분석", path: routes.keywordAnalysis }, { name: "키워드 리뷰", path: routes.keywordReview }] },
            // { name: "마케팅 도구", children: [{ name: "상품명 최적화" }, { name: "콘텐츠 분석" }] },
            { name: "모니터링", children: [{ name: "제품 모니터링", path: routes.dailyMonitoring }, { name: "키워드 모니터링", path: routes.keywordMonitoring }] },
        ]);
    }, []);

    const { data: user } = useUser();
    
    return (
        <Container>
            <Logo src={"https://sell.smartstore.naver.com/shop1.phinf.naver.net/20220412_14/1649748670430p4M8V_JPEG/50884504247134933_654150318.jpg?type=f154"} 
            onClick={onMoveHome}/>
            <UserInfoContianer>
                {
                    user?.me.result ? <UserInfo>
                        <UserGradeAndName>
                            <span>{user.me.result.grade.gradeDesc}</span>
                            <span>{user.me.result.userName}</span>
                        </UserGradeAndName>
                        <UserActions>
                            <Link to={routes.profile}><ActionButton><FontAwesomeIcon icon={faUser} /><span>내정보</span></ActionButton></Link>
                            <ActionButton onClick={onLogout}><FontAwesomeIcon icon={faArrowRightFromBracket} /><span>로그아웃</span></ActionButton>
                        </UserActions>
                        <div>
                        <Link to={routes.manage}>관리</Link>
                        </div>

                    </UserInfo> :
                        <UserInfo>
                            <Link to={routes.login}><Button>로그인</Button></Link>
                        </UserInfo>
                }


            </UserInfoContianer>
            <NavButtonWrapper>
                <ul>
                    {
                        menus.map(((item, index) =>
                            <li key={index}>
                                <NavButton onClick={() => { extensionMenu(index); moveContent(item.path); }} focus={pathname === item.path}>
                                    {item.name}
                                    {item.children && <FontAwesomeIcon icon={item.selected ? faChevronUp : faChevronDown} />}
                                </NavButton>
                                {(item.children && item.selected) &&
                                    <NavBox>
                                        {item.children.map((mitem, index) =>
                                            <NavButton key={index} onClick={() => moveContent(mitem.path)} focus={pathname === mitem.path}>
                                                {mitem.name}
                                            </NavButton>
                                        )}
                                    </NavBox>
                                }
                            </li>))
                    }
                </ul>
            </NavButtonWrapper>
        </Container>
    )
}

export default Nav;