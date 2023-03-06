import { motion, useTime, useTransform } from "framer-motion";

import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top:0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content:center;
    align-items: center;
    span{
        font-size: 18px;
        color:white;
    }
`

const Indicator = styled(motion.div)`
  width  :74px;
  height:74px;
  margin-bottom: 10px;
::after{
    content: " ";
    display: block;
    position: absolute;
    width:54px;
    height:54px;
    border-radius: 50%;
    border:10px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}
`;

interface ILoading {
    text:string;
}

function Loading(props:ILoading) {
    const time = useTime();
    const rotate = useTransform(time,
        [0, 4000],
        [0, 360],
        { clamp: false }
    )
    return (
        <Container>
            <Wrapper>
                <Indicator style={{rotate}}>
                </Indicator>

                <span>{props.text}</span>
            </Wrapper>
        </Container>
    )
}

export default Loading;