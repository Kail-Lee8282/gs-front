import { gql, useQuery } from "@apollo/client";
import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";
import { State } from "../../typeShare";
import Loading from "../Loading";
import { Seperation } from "../Share";

const QUERY_PRODUCTS = gql`
    query searchNaverShops($keyword: String!) {
        searchNaverShops(keyword: $keyword) {
    state {
      ok
      code
      message
    }
    result {
      isAd
      productTitle
      imgUrl
      productUrl
      reviewCount
      purchaseCount
      price
    }
  }
}
`;

type ProductShop = {
    isAd:boolean;
    productTitle: string;
    imgUrl: string;
    productUrl: string;
    reviewCount: number;
    purchaseCount: number;
    price: number;
}

type QueryRequest = {
    keyword: string;
};
type QueryResponse = {
    searchNaverShops: {
        state: State;
        result: ProductShop[];
    }
}

const Container = styled.div`
    width: 100%;
`;

const ItemContainer= styled.li`
    cursor: pointer;
    :hover{
        background-color: rgba(234, 225, 216, 5);
    }
`

const Item = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 5px;
`;

const ProductImg = styled.div`
    overflow: hidden;
    img{
        width: 80px;
        height:80px;
    }
`;

const ShopInfo = styled.div`
  display   : flex;
  flex-direction: column;
  margin-left: 10px;
  gap:5px;
`;
const ProductTitle = styled.div`
    font-size: 16px;
`;

const ProductPrice = styled.div`
    font-size: 14px;
    font-weight:600;
`;

const PurchaseCount = styled.div`
`

const AdIcon = styled.div`
    margin: 0 10px;
    border: 1px solid ${props=> props.theme.borderColor};
    padding: 5px;
    border-radius: 5px;
`;

const Rank = styled.div`
    width: 30px;
    text-align: center;
`

interface IProductList {
    keyword: string;
}

function ProductList({ keyword }: IProductList) {
    const { data, loading } = useQuery<QueryResponse, QueryRequest>(QUERY_PRODUCTS, {
        variables: {
            keyword: keyword
        }
    });

    const onProductClick = (url: string) => {
        window.open(url, "_blank");
    }

    return (
        <Container>
            {
                loading ? <Loading text="로딩중..."/> : <ul>
                    {
                        data?.searchNaverShops.result.map((item, index) => <ItemContainer key={index}>
                            <Item onClick={() => onProductClick(item.productUrl)}>
                                <Rank>{index+1}</Rank>
                            {item.isAd && <AdIcon>광고</AdIcon>}
                                <ProductImg>
                                    <img src={item.imgUrl+"?type=f200"} alt="" />
                                </ProductImg>
                                <ShopInfo>
                                    <ProductTitle>{item.productTitle}</ProductTitle>
                                    <ProductPrice>{item.price.toLocaleString("en-US")}원</ProductPrice>
                                    <PurchaseCount>구매건수 {item.purchaseCount.toLocaleString("en-US")}</PurchaseCount>
                                </ShopInfo>

                            </Item>
                            <Seperation weight={1} />
                        </ItemContainer>)
                    }
                </ul>
            }
        </Container>
    );
}

export default ProductList;