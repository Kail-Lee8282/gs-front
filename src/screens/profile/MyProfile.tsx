import { useReactiveVar } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isLoginVar } from "../../apollo";
import { Button, Seperation } from "../../components/Share";
import PageTitle from "../../components/PageTitle";
import useUser from "../../hooks/useUser";
import { routes } from "../../route-path";


const Container = styled.div`
    
`
const Title = styled.h2`
    font-size:20px;
    font-weight: 500;
    letter-spacing: 3px;

`

const Wrapper = styled.div`
    display:flex;
    flex-direction: column;
    margin-top:20px;
    font-size:16px;
    flex-wrap: wrap;
    gap:10px;
`;

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
    min-height:30px;
`

const InfoChangeBtn = styled(Button)`
    width: auto;
`;

const Label = styled.div`
    width: 150px;
`;

const LabelValue = styled.div`
    
`


function MyProfile() {

    // 로그인 안된 상태에서 프로필 url 들어왔을 경우
    const isLogin = useReactiveVar(isLoginVar);
    
    if(!isLogin){
        throw new Error("is not login");
    }


    const user = useUser();
    
    const createDt = new Date(parseInt(user.data?.me.result?.createdAt!));
    const year = createDt.getFullYear();
    const month = createDt.getMonth().toString().padStart(2, '0');
    const day = createDt.getDay().toString().padStart(2, '0');

    return (
        <Container>
            <PageTitle title="프로필" />
            <Title>내정보</Title>
            <Seperation weight={1} />
            <Wrapper>
                <InfoWrapper>
                    <Label>이름</Label>
                    <LabelValue>{user.data?.me.result?.userName}</LabelValue>
                </InfoWrapper>
                <InfoWrapper>
                    <Label>등급</Label>
                    <LabelValue>{user.data?.me.result?.grade.gradeDesc}</LabelValue>
                </InfoWrapper>
                <InfoWrapper>
                    <Label>휴대폰번호</Label>
                    <LabelValue>{user.data?.me.result?.phoneNum}</LabelValue>
                </InfoWrapper>
                <InfoWrapper>
                    <Label>아이디(E-mail)</Label>
                    <LabelValue>{user.data?.me.result?.email}</LabelValue>
                </InfoWrapper>
                <InfoWrapper>
                    <Label>Password</Label>
                    <LabelValue>********</LabelValue>
                    <InfoChangeBtn>변경</InfoChangeBtn>
                </InfoWrapper>
                <InfoWrapper>
                    <Label>가입일</Label>
                    <LabelValue>{`${year}-${month}-${day}`}</LabelValue>
                </InfoWrapper>
            </Wrapper>
        </Container>
    )
}

export default MyProfile;