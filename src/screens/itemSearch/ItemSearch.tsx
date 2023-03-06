import {useRef} from"react";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../components/Loading";
import Selector, { ISelectorData } from "../../components/Selector";
import { CategoryResult, useLazyGetCategories } from "../../hooks/useCategories";
import { PopularKeyword, useLazyPopularKeywords } from "../../hooks/usePopularKeyword";
import { routes } from "../../route-path";

const Container = styled.div`
`;

const CategorySelectorContainer = styled.div`
    display:flex;
    justify-content: center;
    border-bottom: 1px solid black;
    padding:10px 0px;
`;

const SelectorWrapper = styled.div`
  display  : flex;
  justify-content: center;
  align-items:center;
  gap:20px;
  flex-wrap: wrap;
  &>svg{
        width: 20px;
        height:20px;
    }
`

const ItemListContainer = styled.div`
    margin-top: 10px;
`;

const Header = styled.div`
    display    : flex;
    border-top: 3px solid black;
    border-bottom: 1px solid black;
    padding:10px 0;
    justify-content: center;
    align-items: center;
`;

const KeywordColumn = styled.div`
    flex:1;
`;
const CategoryColumn = styled.div`
    flex:1;
    max-width: 200px;
    text-align: center;
`;
const SearchVolumColumn = styled.div`
    flex:1;
    max-width: 120px;
    text-align: center;
`;

const ProductCntColumn = styled.div`
    flex:1; 
    max-width: 120px;
    text-align: center;
`;

const Rows = styled.div`
    
`;

const Row = styled.div`
    display: flex;
    padding: 10px 0;
    font-size: 15px;
    border-bottom: 1px solid ${props=>props.theme.borderColor};
    cursor:pointer;
    :hover{
        background-color: ${props=>props.theme.privateColor};
        font-weight:600;
    }
`;

const MoreData = styled.div`
    text-align: center;
    font-weight: 600;
    flex:1;
`

const SearchButton = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    max-width: 100px;
    border: 1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    padding:10px 20px;
    cursor: pointer;
    :hover{
        background-color: beige;
    }

`

function ItemSearch() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [getCategory, { loading }] = useLazyGetCategories();
    const [getPopularKwd, {data ,loading:popularLoading}] = useLazyPopularKeywords();
    
    
    const [cate1, setCate1] = useState<ISelectorData[]>();
    const [cate2, setCate2] = useState<ISelectorData[]>();
    const [cate3, setCate3] = useState<ISelectorData[]>();
    const [cate4, setCate4] = useState<ISelectorData[]>();
    const [selectedCid, setSelectedCid] = useState<number>(0);
    const [resultList, setResultList] = useState<PopularKeyword[]>();


    // const handleScroll = (ev: Event)=>{
    //     console.log(window.screen.height, window.scrollY, containerRef.current?.clientHeight);
    // }
    useEffect(() => {
        getCategory({
            variables: {
                cid: 0
            },
            onCompleted(data) {
                setCate1(data.getCategories.result?.children?.map((item) => {
                    return {
                        key: item.name,
                        value: item
                    }
                }))
            },
        }).catch(e => console.error("err",e));
        // const watch=()=>{
        //     window.addEventListener("scroll", handleScroll);
        // }
        // watch();
        // return ()=>{
        //     window.removeEventListener("scroll", handleScroll);
        // }
    }, []);

    const onChangeCate = async (selectItem: ISelectorData, index: number, saveCateNum: number) => {
        try {
            const { value } = selectItem;
            const { cid } = value as CategoryResult
            setSelectedCid(cid);
            await getCategory({
                variables: {
                    cid
                },
                onCompleted(data) {
                    if (saveCateNum === 1) {
                        setCate2(data.getCategories.result?.children?.map((item) => {
                            return {
                                key: item.name,
                                value: item
                            }
                        }));
                        setCate3([]);
                        setCate4([]);
                    } else if (saveCateNum === 2) {
                        setCate3(data.getCategories.result?.children?.map((item) => {
                            return {
                                key: item.name,
                                value: item
                            }
                        }));
                        setCate4([]);
                    } else if (saveCateNum === 3) {
                        setCate4(data.getCategories.result?.children?.map((item) => {
                            return {
                                key: item.name,
                                value: item
                            }
                        }))
                    } else if (saveCateNum === 4) {

                    }

                },
            }).catch(e => console.error(e));;

        } catch (e) {
            console.error(e);
        }
    }

    const [page, setPage] = useState(1);
    const onSearch = async () => {
        if (selectedCid > 0) {
            const res = await getPopularKwd({
                variables: {
                    cid: selectedCid,
                    page
                }
            });
           
            if(res.data?.seePopularKeywords.state.ok){
                setResultList(res.data.seePopularKeywords.result);
            }
        }
    }

    const navigate = useNavigate()
    const onKeywordClick = (keyword:string)=>{
        if(keyword.length > 0)
        { navigate(`${routes.keywordAnalysis}?keyword=${keyword}`); }
    }

    const onMoreData = async ()=>{
        if(resultList && resultList.length >0){
            const res = await getPopularKwd({
                variables:{
                    cid: selectedCid,
                    page:page+1
                }
            });

            setPage((prev)=>prev+1);

            if(res.data?.seePopularKeywords.state.ok){
                const list = [...resultList, ...res.data.seePopularKeywords.result]
                setResultList(list);
            }
            
            
        }
        
    }
    return (
        <Container ref={containerRef}>
            {(popularLoading) && <Loading text="로딩중..."/>}
            <CategorySelectorContainer>
                <SelectorWrapper>
                    <Selector placehorder="1차 카테고리 선택"
                        index={0}
                        onChangeValue={(selectItem, index) => onChangeCate(selectItem, index, 1)}
                        data={cate1}
                    />
                    {
                        (cate2 && cate2.length > 0) && <>
                            <FontAwesomeIcon icon={faChevronRight} />
                            <Selector placehorder="2차 카테고리 선택"
                                data={cate2}
                                onChangeValue={(selectItem, index) => onChangeCate(selectItem, index, 2)}
                            />
                        </>
                    }
                    {
                        (cate3 && cate3.length > 0) && <>
                            <FontAwesomeIcon icon={faChevronRight} />
                            <Selector placehorder="3차 카테고리 선택"
                                data={cate3}
                                onChangeValue={(selectItem, index) => onChangeCate(selectItem, index, 3)}
                            />
                        </>
                    }
                    {
                        (cate4 && cate4.length > 0) && <>
                            <FontAwesomeIcon icon={faChevronRight} />
                            <Selector placehorder="4차 카테고리 선택"
                                data={cate4}
                                onChangeValue={(selectItem, index) => onChangeCate(selectItem, index, 4)}
                            />
                        </>
                    }
                </SelectorWrapper>
                <SearchButton onClick={onSearch}>
                    검색
                </SearchButton>
            </CategorySelectorContainer>
            <ItemListContainer>
                <Header>
                    <KeywordColumn>keyword</KeywordColumn>
                    <CategoryColumn>카테고리</CategoryColumn>
                    <SearchVolumColumn>월간 검색수</SearchVolumColumn>
                    <ProductCntColumn>상품량</ProductCntColumn>
                </Header>
                    <Rows>
                    {
                        resultList?.map((item)=><Row key={item.keyword} onClick={()=>onKeywordClick(item.keyword)}>
                            <KeywordColumn>{item.keyword}</KeywordColumn>
                            <CategoryColumn>{item.categoryName}</CategoryColumn>
                            <SearchVolumColumn>{item.monthlyClickCnt?.toLocaleString("en-US")}</SearchVolumColumn>
                            <ProductCntColumn>{item.productCnt?.toLocaleString("en-Us")}</ProductCntColumn>
                        </Row>)
                    }
                    <Row onClick={onMoreData}>
                        <MoreData>
                        <span>더보기</span><FontAwesomeIcon icon={faChevronDown}/>
                        </MoreData>
                    </Row>
                    </Rows>
            </ItemListContainer>
        </Container>
    )
}

export default ItemSearch;