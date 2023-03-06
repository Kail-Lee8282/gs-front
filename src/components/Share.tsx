import styled from "styled-components";

export const Input = styled.input`
border: 1px solid ${props => props.theme.borderColor};
border-radius: 5px;
padding: 10px 10px;
width: 100%;
&:hover{
    border-color:rgba(0,0,0,0.5);
}
&:focus{
    border-color:black;
}
`;

export const Button = styled.button`
border: 1px solid transparent;
border-radius: 5px;
padding:5px;
background-color: ${props => props.disabled ? "rgba(41, 128, 185,0.5)" : "rgb(41, 128, 185)"} ;
color:white;
font-size: 16px;
cursor:pointer;  
width: 100%;

:hover{
    opacity:0.8;
}

&:disabled{
    cursor: default;
    opacity:1;
}
`;


export const BaseBox = styled.div<{isBorder?:boolean, isShadow?:boolean}>`
    background-color: ${props=>props.theme.backgroundColor};
    border-radius: 10px;
    border: 1px solid ${props=> props.isBorder ? props.theme.borderColor : "transparent"};
    box-shadow:${props => props.isShadow ? `3px 3px 5px ${props.theme.borderColor}` : "0 0 0 0"};
`

export const Box = styled(BaseBox)`
    display: flex;
    flex-direction: column;
    padding:20px;
    margin: 10px 0px;
`;


export const Seperation = styled.div<{ weight?: number }>`
    height:${props => props.weight ? `${props.weight}` : "2"}px;
    background-color: ${props => props.theme.borderColor};
    border-radius:50%;
    width: 100%;
    margin:0px 0px;
`;

export const ContentContainer = styled.div`
    background-color: ${props=>props.theme.backgroundColor};
  border-top-left-radius:50px;
  padding: 30px 50px;
`;
