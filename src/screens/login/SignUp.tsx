import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { isLoginVar } from "../../apollo";
import { Box, Button, Input } from "../../components/Share";
import PageTitle from "../../components/PageTitle";
import { routes } from "../../route-path";
import { State } from "../../typeShare";

const MUTATION_SIGNUP = gql`
mutation signup($email: String!, $userName: String!, $password: String!, $phoneNumber: String!) {
  signup(email: $email, userName: $userName, password: $password, phoneNumber: $phoneNumber) {
    state {
      ok
      code
      message
    }
  }
}
`;

/** signup 결과 타입 */
type SignupResult = {
    signup: {
        state:State,
    }
}
/** signup 파라미터  */
type SignupParam = {
    email: string,
    userName?: string,
    password?: string,
    phoneNumber?: string
}


const Conatiner = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
    height:100vh;
`;

const Wrapper = styled.div`
    border-radius:10px;
    display: flex;
    flex-direction:column;
    max-width: 300px;
`;


const Logo = styled.img`
    margin-bottom: 30px;
`;

const SingUpButton = styled(Button)`
    background-color: ${props=>props.theme.privateColor};
`;

const ErrorMsg = styled.p`
    color:red;
    font-size:12px;
    margin-bottom: 5px;
    margin-left:5px;
    margin-top:3px;
    
`;

const InputWrapper = styled.div`
    margin-bottom: 10px;
`;

interface IForm {
    email: string,
    password: string;
    password_check: string;
    userName: string;
    phoneNumber: string;
}

function SignUp() {

    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState("");
    const isLogin = useReactiveVar(isLoginVar);

    const { control, handleSubmit, getValues, setFocus, formState: { isValid } } = useForm<IForm>({ mode: "onChange" });

    const [createAccount, { loading }] = useMutation<SignupResult, SignupParam>(MUTATION_SIGNUP);

    const onValid: SubmitHandler<IForm> = async (data) => {
        const { email, password, userName, phoneNumber } = data;

        // 본인 인증

        // 사용자 추가 - firebase
        // createUserWithEmailAndPassword(authService, email, password)
        //     .then((result) => {
        //         const user = result.user;
        //         console.log(user);
        //         navigate(routes.login);
        //     })
        //     .catch((err) => {
        //         console.error("createUserWithEmailAndPassword", err);
        //     })

        createAccount({
            variables: {
                email,
                userName,
                password,
                phoneNumber
            }
        }).then(res => {
            const ok = res.data?.signup.state.ok;
            console.log(res);
            if (ok) {
                setErrMsg("");
                navigate(routes.login,{state:{email}});
            } else {
                setErrMsg("계정 생성에 실패 하였습니다.");
            }
        }).catch(err=>{
            setErrMsg(err.message);
        });
    }



    useEffect(() => {
        setFocus("email");

        // 로그인 되어있는 상태에서 로그인 링크 들어왔을때 홈으로 이동
        if(isLogin){
            navigate(routes.home);
        }
    }, [setFocus]);


    return (
        <Conatiner>
            <PageTitle title="회원가입" />
            <Wrapper>
                <Box>
                    <Logo src="https://shop-phinf.pstatic.net/20220621_89/1655772007330z0Nbn_PNG/todo_by_wishhive_logo_verPC_%BA%B9%BB%E7.png?type=w300" />
                    <form onSubmit={handleSubmit(onValid)}>
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: { value: true, message: "email을 입력해주세요." },
                                pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g, message: "올바르지 않은 email 형식입니다." }
                            }}
                            render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) =>
                                <InputWrapper>
                                    <span>Email</span>
                                    <Input
                                        ref={ref}
                                        placeholder="email"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setFocus("password");
                                            }
                                        }}
                                    />
                                    <ErrorMsg>{error?.message}</ErrorMsg>
                                </InputWrapper>
                            }
                        />
                        <Controller
                            control={control}
                            name="password"
                            rules={
                                {
                                    minLength: { value: 8, message: "패스워드 8자리 이상 입력해주세요." },
                                    required: { value: true, message: "패스워드를 입력해주세요." },
                                }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                return (
                                    <InputWrapper>
                                        <span>Password</span>
                                        <Input
                                            ref={ref}
                                            type="password"
                                            placeholder="password"
                                            value={value}
                                            onChange={onChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setFocus("password_check");
                                                }
                                            }} />
                                        <ErrorMsg>{error?.message}</ErrorMsg>
                                    </InputWrapper>)
                            }

                            }
                        />
                        <Controller
                            control={control}
                            name="password_check"
                            rules={{
                                required: { value: true, message: "패스워드를 입력해주세요." },
                                validate: (value) => {
                                    if (value === getValues("password")) {
                                        return true;
                                    } else {
                                        return "패스워드가 동일하지 않습니다.";
                                    }

                                }
                            }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) =>
                                <InputWrapper>
                                    <span>Password check</span>
                                    <Input
                                        ref={ref}
                                        type="password"
                                        placeholder="password check"
                                        value={value}
                                        onChange={onChange}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setFocus("userName");
                                            }
                                        }} />
                                    <ErrorMsg>{error?.message}</ErrorMsg>
                                </InputWrapper>
                            }

                        />

                        <Controller
                            control={control}
                            name="userName"
                            rules={
                                {
                                    minLength: { value: 2, message: "이름을 입력해주세요." },
                                    required: { value: true, message: "이름을 입력해주세요." },
                                }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                return (
                                    <InputWrapper>
                                        <span>이름</span>
                                        <Input
                                            ref={ref}
                                            type="text"
                                            placeholder="name"
                                            value={value}
                                            onChange={onChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    setFocus("phoneNumber");
                                                }
                                            }} />
                                        <ErrorMsg>{error?.message}</ErrorMsg>
                                    </InputWrapper>)
                            }

                            }
                        />

                        <Controller
                            control={control}
                            name="phoneNumber"
                            rules={
                                {
                                    minLength: { value: 2, message: "이름을 입력해주세요." },
                                    required: { value: true, message: "이름을 입력해주세요." },
                                }}
                            render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                                return (
                                    <InputWrapper>
                                        <span>휴대전화</span>
                                        <Input
                                            ref={ref}
                                            type="text"
                                            placeholder="cell phone"
                                            value={value}
                                            onChange={onChange}
                                        />
                                        <ErrorMsg>{error?.message}</ErrorMsg>
                                    </InputWrapper>)
                            }

                            }
                        />

                        <InputWrapper><ErrorMsg>{errMsg}</ErrorMsg></InputWrapper>
                        <Button onClick={handleSubmit(onValid)} disabled={!isValid}>{loading ? "가입중..." : "가입하기"}</Button>
                    </form>
                </Box>
                <Box>
                    <Link to={routes.login}>
                        <SingUpButton>로그인하기</SingUpButton>
                    </Link>
                </Box>
            </Wrapper>
        </Conatiner>
    );
}

export default SignUp;