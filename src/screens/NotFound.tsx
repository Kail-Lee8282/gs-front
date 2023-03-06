import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Share";
import { routes } from "../route-path";

const ActionBtn = styled(Button)`
    width:auto;
`
function NotFound(){
    const navigate = useNavigate();

    const onMoveHome = ()=>{
        navigate(routes.home);
    }

    return (
        <div>
            <h2>Not Found</h2>
            <ActionBtn onClick={onMoveHome}>홈으로 이동</ActionBtn>
        </div>
    )
}

export default NotFound;