import styled from "styled-components";

const Boarder = styled.div`
    display: flex;
    justify-content: center;
    width: 30px;
    padding:3px 5px;
    border:1px solid green;
    border-radius: 10px;
`;

const AdText = styled.span`
    font-weight: 600;
    color:green;
`


function AdIcon(){
    return <Boarder>
        <AdText>Ad</AdText>
    </Boarder>
}

export default AdIcon;