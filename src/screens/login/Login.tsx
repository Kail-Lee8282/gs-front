import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Box, Button, Input, Seperation } from "../../components/Share";
import PageTitle from "../../components/PageTitle";
import { routes } from "../../route-path";
import { Controller } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authService } from "../../fBase";
import { useEffect, useState } from "react";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { isLoginVar, loginUser } from "../../apollo";
import { State } from "../../typeShare";

type LoginParam = {
    email:String,
    password:String
}

type LoginResult = {
    login:{
        state:State,
        token?:string,
    }
}

const LOGIN_MUTATION = gql`
    mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
    state {
      ok
      code
      message
    }
    token
  }
}
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const LoginWrapper = styled.div`
    max-width: 300px;
`;


const Logo = styled.img`
    margin-bottom: 30px;
`;


const SingUpButton = styled(Button)`
    background-color: ${props=>props.theme.privateColor};
`;

const FindActionWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`;


const InputWrapper = styled.div`
    margin-bottom: 10px;
`;


const ErrorMsg = styled.p`
    color:red;
    font-size:12px;
    margin-bottom: 5px;
    margin-left:5px;
    margin-top:3px;
    
`;


interface IForm {
    email: string;
    password: string;
}

function Login() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const isLogin = useReactiveVar(isLoginVar);

    const [errMsg, setErrMsg] = useState("");

    const { control, handleSubmit, setFocus } = useForm<IForm>({
        defaultValues:{
            email:state?.email
        }
    });


    const [login] = useMutation<LoginResult,LoginParam>(LOGIN_MUTATION, {
        onCompleted(data){
            if(data?.login.state.ok){

                const  token = data.login.token;
                if(token){
                    loginUser(token);
                    navigate(routes.home);
                    setErrMsg("");
                }else{
                    setErrMsg("Login failed.");
                }
                
            }else{
                const {code, message} = data?.login.state;
                if(message){
                    setErrMsg(`${code}:${message}`);
                }
                
            }
        }
    });

    const onValid:SubmitHandler<IForm> = (data) =>{
        const {email, password} = data;
        login({
            variables:{
                email,
                password
            }
        }).catch(err=>{
            setErrMsg(err.message);
        });
    }

    useEffect(()=>{
        setFocus("email");

        // 로그인 되어있는 상태에서 로그인 링크 들어왔을때 홈으로 이동
        if(isLogin){
            navigate(routes.home);
        }
    },[]);

    return (
        <Container>
            <PageTitle title="Log-in" />
            <LoginWrapper>
                <Box>
                    <Logo src="https://shop-phinf.pstatic.net/20220621_89/1655772007330z0Nbn_PNG/todo_by_wishhive_logo_verPC_%BA%B9%BB%E7.png?type=w300" />
                    <form onSubmit={handleSubmit(onValid)}>
                        <Controller
                            control={control}
                            name="email"
                            rules={{required:{value:true, message:"email을 입력해주세요."}}}
                            render={({ field: { ref, value, onChange } }) =>
                                <InputWrapper>
                                    <Input
                                        type="email"
                                        placeholder="email"
                                        value={value}
                                        ref={ref}
                                        onChange={onChange}
                                        onKeyDown={(e)=>{
                                            if(e.key ==="Enter"){
                                                setFocus("password");
                                            }
                                        }}
                                    />
                                </InputWrapper>
                            }
                        />
                        <Controller
                            control={control}
                            name="password"
                            rules={{required:{value:true, message:"Password를 입력해주세요."}}}
                            render={({field:{value, ref, onChange }})=>
                                <InputWrapper>
                                    <Input 
                                     type={"password"} placeholder="password"
                                     value={value}
                                     ref={ref}
                                     onChange={onChange} />
                                </InputWrapper>
                            }
                        />
                        <InputWrapper>
                            <ErrorMsg>
                                {errMsg}
                            </ErrorMsg>
                        </InputWrapper>
                        <Link to={routes.home}>
                            <Button onClick={handleSubmit(onValid)}>로그인</Button>
                        </Link>
                    </form>
                    <Seperation />
                    <FindActionWrapper>
                        <span>email 찾기</span>
                        <span>password 찾기</span>
                    </FindActionWrapper>
                </Box>
                <Box>
                    <Link to={routes.signUp}>
                        <SingUpButton>회원가입</SingUpButton>
                    </Link>
                </Box>
            </LoginWrapper>
        </Container>
    );
}

export default Login;