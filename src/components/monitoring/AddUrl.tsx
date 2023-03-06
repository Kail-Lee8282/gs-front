import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import styled from "styled-components"

const Container = styled.div`
`;

const Overlay = styled.div`
    width:100%;
    height:100%;
    background-color: black;
    opacity:0.3;
    position: fixed;
    left: 0;
    top:0;
`;

const PopupContainer = styled.div`
    position: fixed;
    max-width: 40vmax;
    height:50px;
    min-height: 50px;
    left:0;
    right:0;
    top:50px;
    margin: 0 auto;

`;

const PopupBox = styled.form`
    display: flex;
    flex-direction:column;
    gap:10px;
    padding:20px;
    background-color: white;
    border:1px solid transparent;
    border-radius:10px;
    box-shadow:5px 5px 5px;
`;


const Button = styled.button`
     padding:10px 20px;
     color:white;
     border-radius: 5px;
     font-weight:600;
     font-size:14px;
     cursor:pointer;
     &>svg{
        width: 16px;
        height:16px;
     }
     &>span{
        margin-right:5px;
     }
     :disabled{
        background-color: gray;
        cursor:default;
     }
`

const AddButton = styled(Button)`
     background-color: green;
`;

const CloseButton = styled(Button)`

     background-color: orange;
`;

const ActionWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap:10px;
`;


const InputBorder = styled.input`
    display: flex;
    align-items: center;
    border-bottom:2px solid black;
    padding:5px 3px;
    :focus{
        border-bottom:2px solid green;
    }
`


interface IForm {
    url: string;
}

interface IAddUrlProps {
    /**
     * 배경 클릭 이벤트
     * @returns 
     */
    onOverlayClick?: () => void;
    /**
     * 제품추가 클릭 시, 이벤트
     * @param uri 제품 uri
     * @returns 
     */
    onValid?: (uri: string) => void;
}

const NAVER_SMART_STORE_URL_PATTERN =/(smartstore.naver.com\/)([-a-zA-Z0-9])*(\/products\/)([0-9]+)/ig;

/**
 * 네이버 스토어 제품 등록 하기위하여 제품 ID 추출
 * @param props 
 * @returns 
 */
function AddUrl(props: IAddUrlProps) {

    const { control, handleSubmit, formState: { isValid } } = useForm<IForm>({
        mode:"onChange"
    });
    
    const onValid: SubmitHandler<IForm> = (data) => {
        if (props.onValid) {
            const match = data.url.match(NAVER_SMART_STORE_URL_PATTERN);
            if(match && match.length >0){
                const url = new URL("https://"+match[0]);
                
                props.onValid(url.href);
            }
        }
    }

    return (<Container>
        <Overlay onClick={props?.onOverlayClick} />
        <PopupContainer>
            <PopupBox onSubmit={handleSubmit(onValid)}>
                <h2>상품URL를 입력해주세요.</h2>
                <Controller
                    control={control}
                    name="url"
                    rules={{
                        required: true,
                        pattern: {
                            value: /^(http(s)?:\/\/)?(smartstore.naver.com\/)([-a-zA-Z0-9])*(\/products\/)+\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig,
                            message: "네이버 스마트스토어 상품만 등록 가능합니다."
                        },
                    }}
                    render={({ field: { onChange, ref, value }, fieldState: { error } }) =>
                        <>
                            <InputBorder
                                ref={ref}
                                placeholder="URL를 입력해주세요."
                                onChange={onChange}
                                value={value} />
                            {
                                error &&
                                <div>{error.message}</div>
                            }

                        </>}

                />
                <ActionWrapper>
                    <AddButton disabled={!isValid} onClick={handleSubmit(onValid)}>
                        <span>추가</span>
                        <FontAwesomeIcon icon={faPlus} />
                    </AddButton>
                    <CloseButton onClick={props?.onOverlayClick}>
                        <span>닫기</span>
                        <FontAwesomeIcon icon={faClose} />
                    </CloseButton>
                </ActionWrapper>
            </PopupBox>
        </PopupContainer>
    </Container>)
}

export default AddUrl;
