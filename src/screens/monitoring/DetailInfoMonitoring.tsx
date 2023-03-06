import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from "@apollo/client";
import { faChevronLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../components/Loading";
import { MONITORING_KEYWORD_RANK_FRAGEMENT } from "../../fragments";
import { State } from "../../typeShare";
import { ConvertNumberToCommaString } from "../../util";
import { MonitoringInfo, MonitorKwdDisplayPos, ProductDisplayPosition } from "./DailyMonitoring";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import EditKeyword from '../../components/monitoring/EditKeyword';


const QUERY_SEEPRODUCTINFO = gql`
query seeProductMonitoring($productNo: String!) {
    seeProductMonitoring(productNo: $productNo) {
    state {
      ok
      code
      message
    }
    result {
      title
      productNo
      reviewCount
      cumulationSaleCount
      reviewScore
      recentSaleCount
      storeName
      salePrice
      mobileSalePrice
      productImageUrl
      productUrl
      wholeCategoryName
      searchTags
      keywords {
        keyword
        id
        ranks {
            ...MonitoringKeywordRankFragment
        }
      }
    }
  }
}    
${MONITORING_KEYWORD_RANK_FRAGEMENT}
`;

type QuerySeeProductInfoResult = {
    seeProductMonitoring: {
        state: State;
        result?: MonitoringInfo;
    }
}

type QuerySeeProductInfoParam = {
    productNo: string;
}



type ChartSeriesInfo = {
    date: Date;
    fullDateString: string;
    data?: MonitorKwdDisplayPos[];
};



const Container = styled.div`
    display: grid;
`

const Header = styled.div`
  display: flex;
  width: 100%;
`;

const BackButton = styled.button`
    padding:10px 20px;
    cursor:pointer;
    svg{
        width:20px;
        height:20px;
    }

    :hover{
        color:${props => props.theme.focusColor};
    }
`;

const Box = styled.div`
    position: relative;
    display: flex;
    border:1px solid ${props => props.theme.borderColor};
    padding:10px;
    border-radius: 10px;
    box-shadow: 2px 2px 5px ${props => props.theme.borderColor};
    box-sizing: border-box;
    max-width: 100%;
`


const ProductInfoContainer = styled(Box)`
    flex-direction: row;
    
`;

const ProductInfoWrapper = styled.div`
    display: flex;
    flex-direction:column;
    gap:5px;
    margin-left:10px;
`;




const RankContainer = styled(Box)`
    position: relative;
    margin-top: 10px;
    flex-direction: column;
    overflow: hidden;
`;

const TableTh = styled.th`
    white-space: nowrap;
    min-width: 100px;
    vertical-align: middle;
`;

const StickyTh = styled(TableTh)`
    position:sticky;
    z-index: 2;
    left:0;
    padding:0;
    background-color: ${props => props.theme.backgroundColor};
`;

const TableDataWrappwer = styled.div`
    padding:20px 10px;
`

const StickyRowHeader = styled(TableDataWrappwer)`
    display: flex;
    border-right:1px solid ${props => props.theme.borderColor};
    
`;

const TableRow = styled.tr`
    border-top:1px solid ${props => props.theme.borderColor};
    
    
`;

const Title = styled.span`
    
    font-size:16px;
    font-weight: 600;
`
const StoreName = styled(Title)`
`;

const ProductTitle = styled(Title)`
    
`;

const CategoryName = styled.span`
`;

const GroupWrapper = styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items: center;
`;
const GroupTitle = styled.span`
    margin-right: 5px;
`;
const GroupValue = styled.span`
    margin-right: 15px;
    font-weight:600;
`;

const Tag = styled.div`
    padding:5px;
    border:1px solid gray;
    border-radius: 5px;
    margin:1px 3px;
    background-color:${props => props.theme.borderColor};
`;

const ProductImg = styled.img`
    width: 100px;
    height:100px;
`;



const KeywordRankTable = styled.table`
    min-width: 100%;
`;

const ThWrapper = styled.div`
    display:flex;
    flex-direction:column;    
    gap:5px;
`;

const NomalRank = styled.div`
    
`;

const AdRank = styled.div`
    
`;

const AdIcon = styled.span`
    font-size:11px;
    border-radius: 5px;
    border:1px solid green;
    padding:1px 2px;
    color:green;
`



function DetailInfoMonitoring() {
    const { productNo } = useParams();
    const navigate = useNavigate();
    const [addKwdErrMsg, setAddKwdErrMsg] = useState("");

    const [rankSeries, setRankSeries] = useState<ChartSeriesInfo[]>([]);

    const { data, loading } = useQuery<QuerySeeProductInfoResult, QuerySeeProductInfoParam>(QUERY_SEEPRODUCTINFO, {
        variables: {
            productNo: productNo!
        }
    });

    
    

    const onBack = () => {
        // 뒤로가기
        navigate(-1);
    };

    


    

    useEffect(() => {

        if (data?.seeProductMonitoring.state.ok && data?.seeProductMonitoring.result) {


            const { keywords } = data.seeProductMonitoring.result;

            let lastDate = new Date();
            keywords.forEach(item => {
                item.ranks?.forEach((rank) => {
                    const rankDate = new Date(rank.date);
                    if (rankDate.getTime() < lastDate.getTime()) {
                        lastDate = rankDate;
                    }
                });
            });

            const dDay = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

            const series: ChartSeriesInfo[] = [];
            for (let i = 0; i < dDay; i++) {
                const now = new Date();
                now.setDate(now.getDate() - i);
                series.push({
                    date: now,
                    fullDateString: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
                })
            }
            setRankSeries(series);
        }
    }, [data?.seeProductMonitoring]);

    return (
        <Container>
            {(loading) && <Loading text="로딩중..." />}
            <Header>
                <BackButton onClick={onBack}><FontAwesomeIcon icon={faChevronLeft} /></BackButton>
            </Header>
            {
                data && <>
                    <ProductInfoContainer>
                        <ProductImg src={`${data.seeProductMonitoring.result?.productImageUrl}?type=f200`} alt="" />
                        <ProductInfoWrapper>
                            <StoreName>{data.seeProductMonitoring.result?.storeName}</StoreName>
                            <ProductTitle>{data.seeProductMonitoring.result?.title}</ProductTitle>

                            <GroupWrapper>
                                <GroupTitle>가격</GroupTitle>
                                <GroupValue>{ConvertNumberToCommaString(data.seeProductMonitoring.result?.salePrice)}</GroupValue>
                                <GroupTitle>리뷰</GroupTitle>
                                <GroupValue>{ConvertNumberToCommaString(data.seeProductMonitoring.result?.reviewCount)}</GroupValue>
                                <GroupTitle>최근판매량</GroupTitle>
                                <GroupValue>{ConvertNumberToCommaString(data.seeProductMonitoring.result?.recentSaleCount)}</GroupValue>
                                <GroupTitle>6개월판매량</GroupTitle>
                                <GroupValue>{ConvertNumberToCommaString(data.seeProductMonitoring.result?.cumulationSaleCount)}</GroupValue>
                            </GroupWrapper>
                            <GroupWrapper>
                                <GroupTitle>카테고리</GroupTitle>
                                <CategoryName>{data.seeProductMonitoring.result?.wholeCategoryName ? data.seeProductMonitoring.result.wholeCategoryName : ""}</CategoryName>
                            </GroupWrapper>
                            <GroupWrapper>
                                <GroupTitle>검색태그</GroupTitle>
                                {
                                    data.seeProductMonitoring.result?.searchTags?.map((item) =>
                                        <Tag key={item}>
                                            <span>#{item}</span>
                                        </Tag>)
                                }
                            </GroupWrapper>
                        </ProductInfoWrapper>
                    </ProductInfoContainer>
                    <EditKeyword productNo={productNo ? productNo: "" } keywords={data.seeProductMonitoring.result?.keywords}/>
                    <RankContainer>
                        <span>키워드 순위</span>
                        <div style={{ position: "relative", overflow: "auto hidden", maxHeight: 300 }}>
                            <KeywordRankTable>
                                <colgroup>
                                    <col style={{ width: 100 }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <StickyTh>
                                            <StickyRowHeader>
                                                키워드
                                            </StickyRowHeader>
                                        </StickyTh>
                                        {
                                            rankSeries.map((series, index) => {
                                                return (
                                                    <TableTh key={index}>
                                                        <TableDataWrappwer>
                                                            {`${(series.date.getMonth() + 1).toString().padStart(2, "0")}. ${series.date.getDate().toString().padStart(2, "0")}`}
                                                        </TableDataWrappwer>
                                                    </TableTh>

                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.seeProductMonitoring.result?.keywords.map((kwd, index) => {
                                            return (
                                                <TableRow>
                                                    <StickyTh>
                                                        <StickyRowHeader>{kwd.keyword}</StickyRowHeader>
                                                    </StickyTh>
                                                    {
                                                        rankSeries.map((series, index) => {
                                                            const rank = kwd.ranks?.find((rank) => rank.date === series.fullDateString);
                                                            if (rank !== undefined) {
                                                                return (
                                                                    <TableTh key={index}>
                                                                        <ThWrapper>  
                                                                            <NomalRank>
                                                                                {
                                                                                    rank.rank ? (rank.rank < 0 ? "800위 이상" : `${rank?.rank} 위`) : "-"
                                                                                }
                                                                            </NomalRank> 
                                                                            <AdRank>
                                                                                {
                                                                                    rank.adRank && (rank.adRank > 0) && 
                                                                                    <div>
                                                                                        <AdIcon>광고</AdIcon>
                                                                                        <span>
                                                                                        {
                                                                                        `${rank.adRank} 위`
                                                                                        }
                                                                                        </span>
                                                                                    </div>
                                                                                }
                                                                            </AdRank>
                                                                        </ThWrapper>
                                                                    </TableTh>
                                                                )
                                                            } else {
                                                                return <TableTh key={index}>
                                                                    -
                                                                </TableTh>
                                                            }

                                                        })
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    }
                                </tbody>
                            </KeywordRankTable>
                        </div>
                    </RankContainer>
                </>
            }
        </Container>

    )
}

export default DetailInfoMonitoring;