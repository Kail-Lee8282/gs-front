import { gql } from "@apollo/client";

export const MONITORING_KEYWORD_RANK_FRAGEMENT = gql`
  fragment MonitoringKeywordRankFragment on MonitoringKeywordRank {
    updateAt
    rank
    page
    adIndex
    adPage
    adRank
    index
    id
    date
  }
`;

export const MONITORING_PRODUCT_INIFO_FRAGMENT = gql`
  fragment MonitoringProductInfoFragment on MonitoringProduct {
    title
    storeName
    salePrice
    reviewScore
    reviewCount
    recentSaleCount
    productNo
    productImageUrl
    mobileSalePrice
    cumulationSaleCount
    productUrl
    keywords {
      keyword
      id
      ranks {
        ...MonitoringKeywordRankFragment
      }
    }
  }
  ${MONITORING_KEYWORD_RANK_FRAGEMENT}
`;
