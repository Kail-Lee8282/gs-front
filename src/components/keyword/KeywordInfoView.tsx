import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLazyPopularKeywords } from "../../hooks/usePopularKeyword";
import { State } from "../../typeShare";
import Loading from "../Loading";
import KwdAnalysisHeader from "./KwdAnalysisHeader";
import KwdResearch from "./KwdResearch"
import LinkKeyword from "./LinkKeyword";
import ProductList from "./ProductList";


const MUTATION_SEARCH_KEYWORDINFO =  gql`
    mutation searchKeywordInfo($keyword: String!) {
  searchKeywordInfo(keyword: $keyword) {
    state {
      ok
      code
      message
    }
    result {
      keyword
      cid
      isSeason
      isAdult
      isRestricted
      isSellProhibit
      isLowSearchVolume
      totalSeller
      loPrice
      hiPrice
      avgPrice
      brandPercent
      totalSearch
      totalPurchaseCnt
      competitionRate
      productImg
      category {
        category1
        category2
        category3
        category4
        fullCategory
        percent
      }
      searchVolumeByMonth {
        series
        value
      }
    }
  }
}
`;





const Container = styled.div`
    margin-top: 10px;
`;

const BodyLayout = styled.div`
    display: flex;
    flex-direction: row;
    margin: 10px 0;
    gap:10px;
`



/**
 * View Props
 */
type KeywordInfoProps = {
    keyword: string;
}

/**
 * 쿼리 파라미터
 */

type MutationSearchKeywordInfoParam = {
    keyword:string;
}

/**
 * 쿼리 결과
 */
type TrandKwdResult = {
    value: number,
    series: string
}


type MutationSearchKeywordInfoResult= {
    searchKeywordInfo:{
        state:State;
        result?:KeywordInfo
    }
}




export type KeywordInfo = {
    name: string,
    cid:number,
    productImg: string,
    totalSeller: number,
    loPrice: number,
    hiPrice: number,
    avgPrice: number,
    totalSearch: number,
    competitionRate: string,
    brandPercent: number,
    isAdult?:boolean,
    isSellProhibit?:boolean,
    isSeason?:boolean,
    isRestricted?:boolean,
    isLowSearchVolume?:boolean,
    totalPurchaseCnt?:number,
    category: {
        category1: string,
        category2: string,
        category3: string,
        category4: string,
        fullCategory: string,
        percent: number,
    }[],
    trandKwdByAge: TrandKwdResult[],
    trandKwdByGender: TrandKwdResult[],
    trandKwdByDevice: TrandKwdResult[],
    searchVolumeByMonth: TrandKwdResult[],
}

const TabContainer = styled.div`
    display: flex;
    margin-top: 10px;
    border-bottom: 1px solid ${props=>props.theme.borderColor};
    justify-content: space-around;
`;

const Tab = styled.div<{selected:boolean}>`
    cursor:pointer;
    height: 40px;
    display:flex;
    flex:1;
    border-bottom: 1px solid transparent;
    justify-content: center;
    align-items:center;
    font-size:18px;
    font-weight: 600;
    :hover{
        border-bottom: 1px solid ${props=>props.theme.privateColor};
    }
    background-color: ${props=> props.selected ?props.theme.privateColor:"inherite"};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`

function KeywordInfoView({ keyword }: KeywordInfoProps) {
    const [searchKeywordInfo,{ data, loading }] = useMutation<MutationSearchKeywordInfoResult, MutationSearchKeywordInfoParam>(MUTATION_SEARCH_KEYWORDINFO, {
        
        onCompleted(data) {

            if(!data.searchKeywordInfo.result) return;
            getPopular({variables:{
                cid:data.searchKeywordInfo.result.cid,
                page:1
            }});

            setTabIndex(0);
        },
    });

    const [getPopular,{data:popularData,loading:popularLoading}] = useLazyPopularKeywords();
    
    const [tabIndex, setTabIndex] = useState(0);
    
    const onTabSelected = (index:number)=>{
        setTabIndex(index);
    }

    useEffect(()=>{
        searchKeywordInfo({
            variables:{
                keyword
            }
        })
    },[keyword])
    
    return (
        <Container>
            {(loading||popularLoading) ? <Loading text="로딩중..."/> :
                <>
                    <KwdAnalysisHeader
                        title={keyword}
                        imgSrc={data?.searchKeywordInfo.result?.productImg}
                        isAdult={data?.searchKeywordInfo.result?.isAdult}
                        isSeason={data?.searchKeywordInfo.result?.isSeason}
                        isLowSearchVolume={data?.searchKeywordInfo.result?.isLowSearchVolume}
                        isRestricted={data?.searchKeywordInfo.result?.isRestricted}
                        isSellProhibit={data?.searchKeywordInfo.result?.isSellProhibit}
                        categories={data?.searchKeywordInfo.result?.category.map((item) => { return { ratios: item.percent, fullCategory: item.fullCategory } })} />
                    <TabContainer>
                        <Tab selected={tabIndex === 0} onClick={()=>onTabSelected(0)} >분석</Tab>
                        <Tab selected={tabIndex === 1} onClick={()=>onTabSelected(1)}>연관키워드</Tab>
                        <Tab selected={tabIndex === 2} onClick={()=>onTabSelected(2)}>상품리스트</Tab>
                    </TabContainer>
                    <BodyLayout>
                        {
                            tabIndex === 0 ? <KwdResearch data={data?.searchKeywordInfo.result} />:
                            tabIndex === 1 ? <LinkKeyword data={popularData?.seePopularKeywords.result.map((item)=>{return {
                                keyword:item.keyword,
                                monthlyCnt:item.monthlyClickCnt,
                                category:item.categoryName,
                                productCnt:item.productCnt,
                            }})}/> :
                            tabIndex === 2? <ProductList keyword={keyword}/> : <></>
                        }
                    </BodyLayout>
                </>
            }
        </Container>
    );
}

export default KeywordInfoView;