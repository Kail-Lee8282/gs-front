import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { isLoginVar } from "../../apollo";
import { useState } from "react";
import styled from "styled-components";
import AddUrl from "../../components/monitoring/AddUrl";
import PageTitle from "../../components/PageTitle";
import { State } from "../../typeShare";
import Loading from "../../components/Loading";
import ProductInfo from "../../components/monitoring/ProductInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { MONITORING_PRODUCT_INIFO_FRAGMENT } from "../../fragments";


const MUTATION_ADD_MONIORINGITEM = gql`
    mutation addProductMonitoring($uri: String!) {
        addProductMonitoring(uri: $uri) {
    state{
        ok
        code
        message
    }
  }
}
`;

type AddProductMonitoringParam = {
    uri: string;
}

type AddProductMonitoringResult = {
    addProductMonitoring: {
        state: State,
        result?: {
            id: string
        }
    }
}


const QUERY_SEEPRODUCTS_MONITORING = gql`
    query seeProductsMonitoring {
        seeProductsMonitoring {
    state {
        ok
        code
        message
    }
    result {
      ...MonitoringProductInfoFragment
    }
  }
}
${MONITORING_PRODUCT_INIFO_FRAGMENT}
`;

export type ProductDisplayPosition = {
    date: string;
    index: number;
    page: number;
    rank: number;
    adIndex: number;
    adPage: number;
    adRank: number;
    id: string;
    updateAt: number;
}


export type MonitorKwdDisplayPos = {
    keyword: string;
    id: string;
    ranks?: ProductDisplayPosition[];
}

export type MonitoringInfo = {
    title: string;
    storeName: string;
    salePrice: number;
    mobileSalePrice: number;
    reviewScore: number;
    reviewCount: number;
    recentSaleCount: number;
    productNo: number;
    productImageUrl: string;
    cumulationSaleCount: number;
    productUrl: string;
    wholeCategoryName?: string;
    searchTags?: string[];
    keywords: MonitorKwdDisplayPos[];
}

type QueryMonitoringItmesResult = {
    seeProductsMonitoring: {
        state: State;
        result: MonitoringInfo[]
    }
}

const Container = styled.div`
`;

const MonitorContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Rows = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`



const Row = styled.div`
    padding:10px;
    border: 1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    box-shadow: 5px 5px 5px ${props => props.theme.borderColor};
`;

const AddItemRow = styled(Row)`
    border:2px dashed  ${props => props.theme.borderColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    &>span{
        font-size:16px;
    }
`;

const AddButton = styled.button`
    margin-top: 10px;
    border:1px solid transparent;
    border-radius:10px;
    background-color: ${props => props.theme.privateColor};
    padding:8px 20px;
    font-weight:600;
    letter-spacing: 1px;
    cursor:pointer;    
`;


function DailyMonitoring() {
    const [isShow, setIsShow] = useState(false);
    const isLogin = useReactiveVar(isLoginVar);

    const [addProductMonitoringItem, { loading: addItemLoading }] = useMutation<AddProductMonitoringResult, AddProductMonitoringParam>(MUTATION_ADD_MONIORINGITEM,
        {
            onCompleted: async (data) => {
                const ok = data.addProductMonitoring.state?.ok;
                if (ok ){
                    await refetch();
                }
            },
        });

    const { data, loading, refetch } = useQuery<QueryMonitoringItmesResult>(QUERY_SEEPRODUCTS_MONITORING, {
        
    });
    const onAddClick = () => {
        if (isLogin) {
            setIsShow(true);
        } else {
            alert("로그인이 필요한 서비스입니다.");
        }
    }
    const onPopupOutSideClick = () => {
        setIsShow(false);
    }
    const onAddUrl = async (uri: string) => {

        const res = await addProductMonitoringItem({
            variables: {
                uri
            }
        });

        if (res.data?.addProductMonitoring.state?.ok) {
            console.log("저장 완료");
        } else {
            alert(res.data?.addProductMonitoring.state?.error);
        }

        // 모니터링 할 제품 등록
        setIsShow(false);
    }


    return (
        <Container>
            <PageTitle title="일간모니터링" />
            {loading && <Loading text="로딩중..." />}
            <MonitorContainer>
                <Rows>
                    <AddItemRow>
                        <span>모니터링 할 아이템 추가해주세요.</span>
                        <AddButton onClick={onAddClick}>추가하기</AddButton>
                    </AddItemRow>
                    <span><FontAwesomeIcon icon={faCircleInfo} />네이버 쇼핑 모바일 기준</span>
                    {
                        data && data.seeProductsMonitoring.result?.map((item, index) =>
                            <ProductInfo key={index} data={item} visibleRank={true} visibleDetailButon={true} />
                        )
                    }
                </Rows>
            </MonitorContainer>
            {
                isShow && <AddUrl onOverlayClick={onPopupOutSideClick}
                    onValid={onAddUrl} />
            }
            {
                (addItemLoading) && <Loading text="저장중..." />
            }
        </Container>
    );
}

export default DailyMonitoring;