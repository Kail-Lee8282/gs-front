import {
  ApolloQueryResult,
  gql,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";
import { State } from "../typeShare";

export const QUERY_GETCATEGOIES = gql`
  query getCategories($cid: Int!) {
    getCategories(cid: $cid) {
      state {
        ok
        code
        message
      }
      result {
        pid
        name
        cid
        level
        parent {
          name
          cid
        }
        children {
          cid
          name
          level
          pid
          parent {
            cid
            level
            name
          }
        }
      }
    }
  }
`;

const MUTATION_ADDCATEGORY = gql`
  mutation addCategory($cid: Int!, $name: String!, $pid: Int) {
    addCategory(cid: $cid, name: $name, pid: $pid) {
      ok
      error
      data {
        pid
        cid
        name
        level
      }
    }
  }
`;

export interface CategoryResult {
  cid: number;
  pid: number;
  name: string;
  level: number;
  children?: CategoryResult[];
  parent: [
    {
      cid: number;
      name: string;
    }
  ];
}

interface ReturnCategoriesData {
  data?: CategoryResult;
  loading: boolean;
  refetch: (
    variables?: Partial<CategoriesVariables> | undefined
  ) => Promise<ApolloQueryResult<ResCategoriesData>>;
}

export interface ResCategoriesData {
  getCategories: {
    state: State;
    result?: CategoryResult;
  };
}
interface CategoriesVariables {
  cid: number;
}

export function useGetCategories(cid: number): ReturnCategoriesData {
  const { data, loading, refetch } = useQuery<
    ResCategoriesData,
    CategoriesVariables
  >(QUERY_GETCATEGOIES, {
    variables: {
      cid,
    },
    skip: cid < 0,
  });
  return { data: data?.getCategories?.result, loading, refetch };
}

export function useLazyGetCategories() {
  return useLazyQuery<ResCategoriesData, CategoriesVariables>(
    QUERY_GETCATEGOIES
  );
}

interface IResponseMutation {
  addCategory: {
    ok: boolean;
    error: string;
    test: number;
    data: {
      cid: number;
      pid?: number;
      name: string;
      level: number;
    };
  };
}

interface IAddCategoryParam {
  cid: number;
  name: string;
  pid?: number;
}

export function useAddCategory() {
  return useMutation<IResponseMutation, IAddCategoryParam>(
    MUTATION_ADDCATEGORY,
    {
      update(cache, result) {
        console.log(cache, result);

        if (result.data?.addCategory.ok) {
          const data = result.data.addCategory.data;
          console.log("update", data);

          const newCategoryFragment = cache.writeFragment({
            id: `Category:${data.cid}`,
            data: data,
            fragment: gql`
              fragment createCategory on Category {
                cid
                pid
                name
                level
              }
            `,
          });

          cache.modify({
            id: `Category:${data.pid}`,
            fields: {
              children(prev) {
                const isExist = prev.find(
                  (child: any) => child.__ref === newCategoryFragment?.__ref
                );

                if (isExist) {
                  return prev;
                }

                return [...prev, newCategoryFragment];
              },
            },
          });
        }
      },
    }
  );
}
