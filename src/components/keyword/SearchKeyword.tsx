import { useState, ChangeEvent } from "react";
import { faChevronLeft, faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../route-path";
import { BaseBox } from "../Share";
import { addHistoryKeyword, keywordHistory, removeHistoryKeyword } from "../../apollo";
import { useReactiveVar } from "@apollo/client";

const KeywordSearchBox = styled(BaseBox)`
display: flex;
flex-direction: column;
padding: 20px;
`;

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    align-items:center;
`
const HistoryContainer = styled.div`
    display: flex;
    margin-top: 10px;
    gap: 5px;
    flex-wrap: wrap;
`;

const HistoryKeyword = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    border:1px solid black;
    border-radius: 4px;
    padding:3px 5px;
    span:first-child{
        margin-right:5px;
        :hover{
            text-decoration: underline;
            cursor:pointer;
        }
    }

    svg{
        width: 18px;
        height:18px;
        cursor:pointer;
    }
`

const SearchInput = styled.div`
    display: flex;
    flex-grow:1;
    border-bottom: 2px solid black;
    padding-bottom: 3px;
    margin:0 20px;
    flex-wrap: nowrap;
    input:first-child{
        flex-grow: 1;
    }
`;

const Title = styled.span`
    margin-right: 10px;
`;

const BackButton = styled.div<{ isBack?: boolean }>`
    cursor:pointer;
    padding:5px;
    margin-right: 10px;
    visibility: ${props => props.isBack ? "visible" : "hidden"};
`;

type SearchKeywordProp = {
    isBack: boolean
}


function SearchKeyword({ isBack }: SearchKeywordProp) {

    const navaigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const arrHisKeyword: Array<string> = useReactiveVar(keywordHistory);

    const onSearch = () => {
        const searchKeyword = keyword.trim();
        if (searchKeyword && searchKeyword.length > 0) {
            console.log("searchKeyword", searchKeyword);
            navaigate(`${routes.keywordAnalysis}?keyword=${searchKeyword}`);

            addHistoryKeyword(searchKeyword);
        }

        setKeyword("");
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setKeyword(e.target.value);
    }

    const onBack = () => {
        navaigate(routes.keywordAnalysis);
    }

    const onKeywordClick = (keyword: string) => {
        addHistoryKeyword(keyword);
        navaigate(routes.keywordAnalysis + "?keyword=" + keyword);
    }

    const onRemoveKeyword = (keyword: string) => {
        removeHistoryKeyword(keyword);
    }

    return (
        <KeywordSearchBox isBorder={true}>
            <SearchContainer>
                <BackButton onClick={onBack} isBack={isBack}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </BackButton>
                <Title>키워드 검색</Title>
                <SearchInput>
                    <input
                        type={"search"}
                        placeholder="키워드를 입력하세요."
                        onChange={onChange}
                        value={keyword}
                        onKeyDown={(e) => e.key === "Enter" && onSearch()} />
                    <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
                </SearchInput>
            </SearchContainer>
            <HistoryContainer>
                {
                    arrHisKeyword && arrHisKeyword.map((item) => <HistoryKeyword key={item}>
                        <span onClick={() => onKeywordClick(item)}>{item}</span>
                        <FontAwesomeIcon icon={faClose} onClick={()=>onRemoveKeyword(item)}/></HistoryKeyword>)
                }
            </HistoryContainer>
        </KeywordSearchBox>
    )
}

export default SearchKeyword;