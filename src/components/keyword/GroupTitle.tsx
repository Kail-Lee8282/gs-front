import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:15px;
    gap:3px;
`;

const Title = styled.h3<{level?:"normal"|"level1"|"level2"}>`
    font-weight: 600;
    padding-bottom: 2px;
    font-size: ${props=>props.level === "level2" ? "13px":"inherit"};
    ${props => props.level === "level1" ? "background: linear-gradient(to bottom,  rgba(0,0,0,0) 60%, rgba(230, 126, 34, 0.5) 40%);" : ""};
    ${props => props.level === "level2" ? "border-bottom: 1px solid black" : ""};
    
    
`;

type GroupTitleProps= {
    title:string;
    level?:"normal"|"level1"|"level2";
    children?:React.ReactNode;
}

function GroupTitle({title, level,children}:GroupTitleProps){
    return (
        <Container>
            <Title level={level}>{title}</Title>
            {children}
        </Container>
    )
};

export default GroupTitle;