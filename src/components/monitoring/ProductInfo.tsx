import { gql, useApolloClient, useMutation } from "@apollo/client";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../../route-path";
import { MonitoringInfo } from "../../screens/monitoring/DailyMonitoring";
import { State } from "../../typeShare";
import { ConvertNumberToCommaString } from "../../util";
import Loading from "../Loading";
import KeywordDisplayPos from "./KeywordDisplayPos";

const MUTATION_REMOVE_MONITORING_ITEM = gql`
    mutation removeProductMonitoring($productNo: String!) {
        removeProductMonitoring(productNo: $productNo) {
            state {
            ok
            code
            message
        }
    }
}
`;

type MutationRemoveMonitoringItemParam ={
    productNo:string;
}

type MutationRemoveMonitoringItemResult = {
    removeProductMonitoring:{
        state:State
    }
}

const Container = styled.div`
    display: flex;
    flex-direction:column;
    padding:10px;
    border: 1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    box-shadow: 5px 5px 5px ${props => props.theme.borderColor};
`;

const ProductContainer = styled.div`
    display: flex;
    position: relative;
`;

const ProductDisplayPosContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap:5px;
    align-items:center;
    border-top:1px solid ${props => props.theme.borderColor};
    padding:10px 0px;
    margin-top: 10px;
`;

const ProductInfoContainer = styled.div`
    margin-left: 10px;
    display: flex;
    flex-direction:column;
    gap:5px;
`;

const ProductImg = styled.img`
    width: 100px;
    height:100px;
`;

const StoreName = styled.span`
    font-size: 16px;
    cursor:pointer;
    :hover{
        text-decoration:underline;
    }
`;

const ProductTitle = styled(StoreName)`
    font-weight:600;
`;

const InfoBoxWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const InfoBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:10px;
    gap:10px;
    &>span{
        font-size:16px;
    }
`;

const TitleWrapper = styled.div`
    display: flex;
    flex:1;
    flex-direction:column;
`;

const DetailButton = styled.button`
    padding:10px;
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 5px;
    margin-left:10px;
    cursor:pointer;
    :hover{
        background-color: rgba(211,211,211);
    }
`

interface IProductProp {
    data: MonitoringInfo,
    visibleRank?: boolean,
    visibleDetailButon?: boolean
}

function ProductInfo(props: IProductProp) {
    const { data: { productImageUrl, storeName, title, productUrl, salePrice
        , reviewCount
        , reviewScore
        , recentSaleCount
        , cumulationSaleCount,
        productNo,
        keywords } } = props;

    const navigate = useNavigate();
        const {cache} = useApolloClient();
    const [removeMonitoringItem, {loading}] = useMutation<MutationRemoveMonitoringItemResult,MutationRemoveMonitoringItemParam>(MUTATION_REMOVE_MONITORING_ITEM,
        {
            onCompleted(data){
                const {removeProductMonitoring:{state:ok}} = data;

                if(!ok){
                    return;
                }

                cache.modify({
                    id: `MonitoringProduct:${productNo}`,
                    fields: {
                        keywords(prev) {
                            (prev as []).forEach((keyword: any) => {
                                cache.modify({
                                    id:keyword.__ref,
                                    fields:{
                                        ranks(prev) {
                                            (prev as []).forEach((rank: any) => {
                                                cache.evict({ id: rank.__ref });
                                            });
                                            return [];
                                        }
                                    }
                                });
                            });
                            return[]; 
                        }
                    }
                });

                cache.modify({
                    id:"ROOT_QUERY",
                    fields:{
                        seeProductMonitoringItems(prev) {
                            return {...prev,
                            data: (prev.data as []).filter((item:any)=> item.__ref !== `MonitoringProduct:${productNo}`)};
                        }
                    }
                });

                cache.evict({ id: `MonitoringProduct:${productNo}` });
                cache.gc();

            }
        });
    

    const onRemoveItem = async()=>{
        if(window.confirm("삭제하시겠습니까?")){
            await removeMonitoringItem({variables:{
                productNo:productNo.toString()
            }});
        }
        
    }

    /**
     * 스토어 이동
     */
    const onMoveStorePage = () => {
        const storeUrl = new URL(productUrl);
        const urlPathNames = storeUrl.pathname.split("/");
        window.open(`${storeUrl.origin}/${urlPathNames[1]}`, "_blank");
    }

    /**
     * 제품 페이지 이동
     */
    const onMoveProductPage = () => {
        window.open(productUrl, "_blank");
    }

    const onMoveDetail = () => {
        navigate(`${routes.dailyMonitoring}/${productNo}`);
    }

    return (
        <Container>
            {loading && <Loading text="삭제중..."/>}
            <ProductContainer>
                <ProductImg src={`${productImageUrl}?type=f200`} />
                <ProductInfoContainer>
                    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <TitleWrapper>
                            <StoreName onClick={onMoveStorePage}>{storeName}</StoreName>
                            <ProductTitle onClick={onMoveProductPage}>{title}</ProductTitle>
                        </TitleWrapper>
                        {
                            props.visibleDetailButon && <DetailButton onClick={onMoveDetail}>
                                <FontAwesomeIcon icon={faSearch} />
                            </DetailButton>
                        }
                    </div>
                    <InfoBoxWrapper>
                        <InfoBox>
                            <h2>가격</h2>
                            <span>
                                {ConvertNumberToCommaString(salePrice)}원
                            </span>
                        </InfoBox>
                        <InfoBox>
                            <h2>리뷰</h2>
                            <span>
                                {ConvertNumberToCommaString(reviewCount)}개
                            </span>
                        </InfoBox>
                        <InfoBox>
                            <h2>평점</h2>
                            <span>
                                {ConvertNumberToCommaString(reviewScore)}점
                            </span>
                        </InfoBox>
                        <InfoBox>
                            <h2>최근판매개수</h2>
                            <span>
                                {ConvertNumberToCommaString(recentSaleCount)}개
                            </span>
                        </InfoBox>
                        <InfoBox>
                            <h2>6개월판매개수</h2>
                            <span>
                                {ConvertNumberToCommaString(cumulationSaleCount)}개
                            </span>
                        </InfoBox>
                    </InfoBoxWrapper>
                </ProductInfoContainer>
                <div style={{ position: "absolute", right: 0 }}>
                    <DetailButton onClick={onRemoveItem}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </DetailButton>
                </div>
            </ProductContainer>
            {
                props.visibleRank && <ProductDisplayPosContainer>

                    {
                        keywords && keywords.map((item, index) => { 
                            return (<KeywordDisplayPos key={index} data={item} />)})
                    }

                </ProductDisplayPosContainer>
            }
        </Container>
    )
}

export default ProductInfo;