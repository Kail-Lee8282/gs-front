import { gql, useMutation, useQuery } from "@apollo/client";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import AdIcon from "../../components/AdIcon";
import Loading from "../../components/Loading";
import PageTitle from "../../components/PageTitle";
import { State } from "../../typeShare";

const Contanier = styled.div`
    position:relative;
    display: grid;
    gap:20px;
`;

const Title = styled.h1`
    font-size:18px;
    font-weight:600;
`

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap:10px;
`;

const InputWrapper = styled.form`
    display: flex;
    flex-wrap: wrap;
    gap:5px;
`;

const Input = styled.input`
    border: 1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    font-weight:600;
    padding: 10px;
    height:50px;
    width: 200px;
    min-width: 100px;
    max-width: 300px;
`;

const Search = styled.button`
    border:1px solid transparent;
    border-radius: 10px;
    padding:10px 20px;
    font-weight:600;
    background-color: ${props => props.theme.privateColor};
    cursor:pointer;
`;


const SearchResultContainer = styled.div`
    margin-top:20px;
    display    : flex;
    flex-direction:column;
    position: relative;
    gap:10px;
    overflow: hidden;
`;

const TableWrapper = styled.div`
    overflow: auto;
    position: relative;
    min-height: 300px;
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 5px;
`;

const Table = styled.table`
    border-collapse: collapse;
    min-width:100%;
    thead>tr {
        border-bottom: 1px solid ${props => props.theme.borderColor};
        th{
            font-weight: 600;
            letter-spacing: 1.2px;
        }
    }
    tbody>tr{
        border-bottom: 1px solid ${props => props.theme.borderColor};
    }
`;

const TableCell = styled.th`
    min-width: 100px;
    padding:10px 15px;
    white-space: nowrap;
    vertical-align: middle;
`;

const StoreCell = styled(TableCell)`
`;
const KeywordCell = styled(TableCell)`
`;

const ProductCell = styled(TableCell)`
`;
const RankCell = styled(TableCell)`
`;
const PageIndexCell = styled(TableCell)`
`;
const UpdateCell = styled(TableCell)`
`;
const ReSearchCell = styled(TableCell)`
    width: 100px;
`;
const ReSearchButton = styled.button`
    border:1px solid black;
    padding: 20px;
    cursor:pointer;
    border-radius: 10px;
`

const CellContainer = styled.div`
`

const ProductInfoContainer = styled.div`
    display: flex;
`;

const ProductImg = styled.img`
    border: 1px solid transparent;
    border-radius: 5px;
    width: 60px;
`;

const ProductInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    margin-left:10px;
    gap:5px;
`;
const ProductTitle = styled.span`
    font-weight: 600;
    cursor: pointer;
`;
const ProductSellingInfoWrapper = styled.div`
    display: flex;
    gap:10px;
    font-size:13px;
`;

const TextWrapper = styled.div`
    display: flex;
    gap:5px;
`

const TextHighlight = styled.span`
    font-weight: 600;
`;

const QUERY_SEEKWDMONITORING = gql`
    query seeKeywordsMonitoring {
        seeKeywordsMonitoring {
    state {
      ok
      code
      message
    }
    result {
      id
      storeName
      keyword
      title
      isAd
      productImg
      productUrl
      reviewCount
      purchaseCount
      rank
      page
      index
      seleStart
      updatedAt
    }
  }
}
`;

type StoreKeywordRank = {
    id: string;
    storeName: string;
    keyword: string;
    title: string;
    isAd: boolean;
    productImg: string;
    productUrl: string;
    reviewCount: number;
    purchaseCount: number;
    rank: number;
    page: number;
    index: number;
    seleStart: string;
    updatedAt: string;
}

type SeeKeywordsMonitoringResult = {
    seeKeywordsMonitoring: {
        state: State;
        result: StoreKeywordRank[]
    }
}

const MUTATION_UPDATE_KWDMONITORING = gql`
mutation updateKeywordMonitoring($storeName: String!, $keyword: String!) {
  updateKeywordMonitoring(storeName: $storeName, keyword: $keyword) {
    state {
      ok
      code
      message
    }
    result {
      id
      storeName
      keyword
      title
      isAd
      productImg
      productUrl
      reviewCount
      purchaseCount
      rank
      page
      index
      seleStart
      updatedAt
    }
  }
}
`;

type StoreKeywordResult = {
    updateKeywordMonitoring: {
        state: State;
        result: StoreKeywordRank[]
    }
}

interface IForm {
    storeName: string;
    keyword: string;
}


function StoreKeywordMonitoring() {

    
    
    const { control, handleSubmit, setFocus, setValue } = useForm<IForm>();

    const { data, loading } = useQuery<SeeKeywordsMonitoringResult>(QUERY_SEEKWDMONITORING, {
        onCompleted(data) {
            if (!data.seeKeywordsMonitoring.state.ok) {
                return;
            }
        },
    });

    const [updateStoreKeyword, { loading: addLoading }] = useMutation<StoreKeywordResult, IForm>(MUTATION_UPDATE_KWDMONITORING, {
        update(cache, result) {
            const ok = result.data?.updateKeywordMonitoring.state.ok;

            if (!ok) {
                return;
            }

            if (result.data?.updateKeywordMonitoring.result) {
                result.data.updateKeywordMonitoring.result.forEach((item) => {
                    const findFragment: any = cache.readFragment({
                        id: `StoreKeywordRank:${item.id}`,
                        fragment: gql`
                            fragment rank on StoreKeywordRank {
                                id
                            }
                        `
                    });


                    if (findFragment) {
                        cache.modify({
                            id: "StoreKeywordMonitoring",
                            fields: {
                                result(prev) {
                                    const findIdx = (prev as []).findIndex((item: any) => item.__ref === findFragment.id)
                                    // 데이터 있을경우 추가
                                    if (findIdx <= 0) {
                                        prev = [...prev, findFragment];
                                    } else {
                                        // 없을 경우 데이터 삭제
                                        prev[findIdx] = findFragment;
                                    }
                                    return prev;
                                }
                            }
                        })
                    }

                })

            }


        }
    });

    // 상품 페이지 이동
    const onTitleClick = (url: string) => {
        if (url || url.length > 0) {
            window.open(url, "_black");
        }
    };

    const onRefresh = async (storeName: string, keyword: string) => {
        if (!storeName || storeName.length <= 0 || !keyword || keyword.length <= 0) {
            return;
        }

        updateStoreKeyword({
            variables: {
                storeName,
                keyword
            }
        });
    }

    const onValid = (data: IForm) => {
        updateStoreKeyword({
            variables: {
                keyword: data.keyword,
                storeName: data.storeName
            }
        })

        setValue("keyword", "");
        setValue("storeName", "");
    }


    return (
        <Contanier>
            <PageTitle title="키워드 모니터링" />
            {
                (loading || addLoading) && <Loading text="불러오는 중..." />
            }
            <EditContainer>
                <Title>키워드 랭킹 조회</Title>
                <InputWrapper onSubmit={handleSubmit(onValid)}>
                    <Controller
                        control={control}
                        name="storeName"
                        rules={{ required: true }}
                        render={({ field: { onChange, value, ref } }) =>
                            <Input placeholder="스토어명을 입력해주세요"
                                ref={ref}
                                onChange={onChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        setFocus("keyword")
                                    }
                                }}
                                value={value} />
                        }
                    />
                    <Controller
                        control={control}
                        name="keyword"
                        rules={{ required: true }}
                        render={({ field: { onChange, value, ref } }) =>
                            <Input placeholder="키워드를 입력해주세요"
                                ref={ref}
                                onChange={onChange}
                                value={value} />
                        }
                    />
                    <Search onSubmit={handleSubmit(onValid)}>검색하기</Search>
                </InputWrapper>
            </EditContainer>
            <SearchResultContainer>
                <Title>검색 결과</Title>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <StoreCell>스토어</StoreCell>
                                <KeywordCell>키워드</KeywordCell>
                                <ProductCell>상품</ProductCell>
                                <RankCell>전체순위</RankCell>
                                <PageIndexCell>페이지순위</PageIndexCell>
                                <UpdateCell>조회일</UpdateCell>
                                <ReSearchCell>갱신</ReSearchCell>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.seeKeywordsMonitoring.state.ok && data.seeKeywordsMonitoring.result.map((item) =>
                                    <tr key={item.id}>
                                        <StoreCell>{item.storeName}</StoreCell>
                                        <KeywordCell>{item.keyword}</KeywordCell>
                                        <ProductCell>
                                            <ProductInfoContainer>
                                                <div>
                                                    <ProductImg src={`${item.productImg}?type=f200`} />
                                                </div>
                                                <ProductInfoWrapper>
                                                    {
                                                        item.isAd && <AdIcon />
                                                    }
                                                    <ProductTitle onClick={() => { !item.isAd && onTitleClick(item.productUrl) }}>{item.title}</ProductTitle>
                                                    {
                                                        item.rank > 0 &&
                                                        <ProductSellingInfoWrapper>
                                                            <TextWrapper>
                                                                <span>리뷰</span>
                                                                <TextHighlight>{item.reviewCount}</TextHighlight>
                                                            </TextWrapper>
                                                            <TextWrapper>
                                                                <span>구매건수</span>
                                                                <TextHighlight>{item.purchaseCount}</TextHighlight>
                                                            </TextWrapper>
                                                            <TextWrapper>
                                                                <span>등록일</span>
                                                                <TextHighlight>{`${item.seleStart.substring(2, 4)}. ${item.seleStart.substring(4, 6)}. ${item.seleStart.substring(6, 8)}`}</TextHighlight>
                                                            </TextWrapper>
                                                        </ProductSellingInfoWrapper>
                                                    }
                                                </ProductInfoWrapper>
                                            </ProductInfoContainer>
                                        </ProductCell>
                                        <RankCell>
                                            {
                                                item.rank <= 0 ?
                                                    <TextHighlight>800위 밖</TextHighlight>
                                                    :
                                                    <>
                                                        <TextHighlight>{item.rank}</TextHighlight>위
                                                    </>
                                            }
                                        </RankCell>
                                        <PageIndexCell>
                                            {
                                                item.rank > 0 &&
                                                <>
                                                    <TextHighlight>{item.page}</TextHighlight>페이지 <TextHighlight>{item.index}</TextHighlight>위
                                                </>
                                            }

                                        </PageIndexCell>
                                        <UpdateCell>{item.updatedAt}</UpdateCell>
                                        <ReSearchCell>
                                            <CellContainer>
                                                <ReSearchButton onClick={() => onRefresh(item.storeName, item.keyword)}>
                                                    <FontAwesomeIcon icon={faArrowRotateRight} />
                                                </ReSearchButton>
                                            </CellContainer>
                                        </ReSearchCell>
                                    </tr>)
                            }
                        </tbody>
                    </Table>
                </TableWrapper>
            </SearchResultContainer>
        </Contanier>
    )
}


export default StoreKeywordMonitoring;