import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { addHistoryKeyword } from "../../apollo";
import { routes } from "../../route-path";
import router from "../../router";

const Container = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    padding-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 1px;
`;

const Rows = styled.div`
`

const Column = styled.div`
    flex:1;
    display: flex;
    justify-content: center;
`;

const Row = styled.div`
    height:30px;
    padding:5px;
    display: flex;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    align-items: center;
    position:relative;
    
    cursor: pointer;
    :hover{
    ::after{
        content: "검색";
        position: absolute;
        border:1px solid inherit;
        border-radius: 3px;
        background-color: black;
        color:white;
        padding:5px 10px;
    }
    }
`;

const ColIndex = styled(Column)`
    max-width: 50px;
`;

const ColKeyword = styled(Column)`
    
`;

const ColCategory = styled(Column)`
    max-width: 120px;
`;

const ColMonthlySearch = styled(Column)`
    max-width: 120px;
`;

const ColSellingCnt = styled(Column)`
    max-width: 120px;
`;

const ColCompetition = styled(Column)`
    max-width: 70px;
`;


type LinkKeywordProps = {
    data?: {
        keyword: string;
        monthlyCnt: number;
        category: string;
        productCnt: number;
    }[]

}


function LinkKeyword({ data }: LinkKeywordProps) {

    const navi = useNavigate();
    const onKeywordClick = (keyword: string) => {
        addHistoryKeyword(keyword);
        navi(routes.keywordAnalysis + "?keyword=" + keyword);
    }

    return (
        <Container>
            <Header>
                <ColIndex></ColIndex>
                <ColKeyword>keyword</ColKeyword>
                <ColCategory>카테고리</ColCategory>
                <ColMonthlySearch>월간 검색수</ColMonthlySearch>
                <ColSellingCnt>상품량</ColSellingCnt>
                {/* <ColCompetition>경쟁률</ColCompetition> */}
            </Header>
            <Rows>
                {
                    data?.map((item, index) =>
                        <Row key={index} onClick={() => onKeywordClick(item.keyword)}>
                            <ColIndex>{index + 1}</ColIndex>
                            <ColKeyword>{item.keyword}</ColKeyword>
                            <ColCategory>{item.category}</ColCategory>
                            <ColMonthlySearch>{item.monthlyCnt.toLocaleString("en-US")}</ColMonthlySearch>
                            <ColSellingCnt>{item.productCnt.toLocaleString("en-US")}</ColSellingCnt>
                            {/* <ColCompetition>경쟁률</ColCompetition> */}
                        </Row>
                    )
                }
            </Rows>
        </Container>);
}

export default LinkKeyword;