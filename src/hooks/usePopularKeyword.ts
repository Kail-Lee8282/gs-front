import { gql, useLazyQuery } from "@apollo/client";
import { State } from "../typeShare";

const QUERY_POPULAR_KEYWORD = gql`
  query seePopularKeywords($cid: Int!, $page: Int!) {
    seePopularKeywords(cid: $cid, page: $page) {
      state {
        ok
        code
        message
      }
      result {
        keyword
        cid
        rank
        categoryName
        monthlyClickCnt
        productCnt
      }
    }
  }
`;

export type QueryPopularKeywordParam = {
  cid: number;
  page: number;
};

export type PopularKeyword = {
  rank: number;
  keyword: string;
  monthlyClickCnt: number;
  productCnt: number;
  categoryName: string;
  cid: number;
};

export type QueryPopularKeywordResult = {
  seePopularKeywords: {
    state: State;
    result: PopularKeyword[];
  };
};

export function useLazyPopularKeywords() {
  return useLazyQuery<QueryPopularKeywordResult, QueryPopularKeywordParam>(
    QUERY_POPULAR_KEYWORD
  );
}
