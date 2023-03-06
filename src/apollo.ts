import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  makeVar,
  ReactiveVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const TOKEN = "token";
const DARKMODE = "darkmode";
const HISKEYWORD = "hiskeyword";

// Keyword History
export const keywordHistory: ReactiveVar<Array<string>> = makeVar(
  JSON.parse(localStorage.getItem(HISKEYWORD)!)
);

export function addHistoryKeyword(keyword: string) {
  const arrHistory: Array<string> = JSON.parse(
    localStorage.getItem(HISKEYWORD) as string
  );

  const newData = [keyword];
  if (arrHistory) newData.push(...arrHistory);
  const newHistory = newData.reduce<string[]>((acc, curr) => {
    if (acc.length > 5) return acc;
    const idx = acc.findIndex((item) => item === curr);
    if (idx < 0) {
      acc.push(curr);
    }
    return acc;
  }, []);

  localStorage.setItem(HISKEYWORD, JSON.stringify(newHistory));
  keywordHistory(newHistory);
}

export function removeHistoryKeyword(keyword: string) {
  const arrHistory: Array<string> = JSON.parse(
    localStorage.getItem(HISKEYWORD) as string
  );
  const newHistory = arrHistory.filter((item) => keyword !== item);

  localStorage.setItem(HISKEYWORD, JSON.stringify(newHistory));
  keywordHistory(newHistory);
}

// 다크 모드
export const isDarkModeVar = makeVar(Boolean(localStorage.getItem(DARKMODE)));

export function enableDarkMode() {
  localStorage.setItem(DARKMODE, "ENABLED");
  isDarkModeVar(true);
}

export function disableDarkMode() {
  localStorage.removeItem(DARKMODE);
  isDarkModeVar(false);
}

// 로그인 여부 (로컬에 토큰 여부 확인)
export const isLoginVar = makeVar(Boolean(localStorage.getItem(TOKEN)));

export const loginUser = (token: string) => {
  localStorage.setItem(TOKEN, token);
  isLoginVar(true);
};

export const loginUserOut = () => {
  localStorage.removeItem(TOKEN);
  isLoginVar(false);
};

//export const loginUser = makeVar<User | undefined>(undefined);

const setAuthLink = setContext((req, { headers }) => {
  const token = localStorage.getItem(TOKEN);
  return {
    headers: {
      ...headers,
      token,
    },
  };
});

const httpLink = new HttpLink({
  uri:
    // process.env.NODE_ENV !== "production"
    // ?
    "https://gs-back.fly.dev/",
  // :
  // "http://192.168.1.12:8080/graphql",
});

export const client = new ApolloClient({
  link: setAuthLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Mutation: {
        fields: {},
      },
      Query: {
        fields: {
          // seePopularKwd: {
          //   keyArgs: false,
          //   merge(existing, incoming, { readField }) {
          //     console.log("merge", existing, incoming);
          //     const data = existing ? { ...existing.data } : {};
          //     incoming.data.forEach((item: PopularKeywordResult) => {
          //       const value = readField("keyword", item) as string;
          //       data[value] = item;
          //     });
          //     console.log(data);
          //     return {
          //       state: incoming.state,
          //       data,
          //     };
          //   },
          // read(existing) {
          //   console.log("read", existing);
          //   if (existing) {
          //     return {
          //       state: existing.state,
          //       data: Object.values(existing.data),
          //     };
          //   }
          // },
          // },
          // ruler(existingRuler, { canRead, toReference }) {
          //   console.log("ruler", existingRuler);
          //   return canRead(existingRuler)
          //     ? existingRuler
          //     : toReference({
          //         __typename: "MonitoringKeywordRank",
          //         name: "Apollo",
          //       });
          // },
        },
      },
      Category: {
        keyFields: (obj) => `Category:${obj.cid}`,
      },
      MonitoringKeywordRank: {
        keyFields: (obj) => `DisplayPos:${obj.id}_${obj.date}`,
        // fields: {
        //   offspring(existingOffspring: Reference[], { canRead }) {
        //     console.log("offspring", existingOffspring);
        //     return existingOffspring ? existingOffspring.filter(canRead) : [];
        //   },
        // },
      },
      MonitoringProduct: {
        keyFields: (obj) => `MonitoringProduct:${obj.productNo}`,
      },
      SeeKwdMonitoringResult: {
        keyFields: (obj) => `StoreKeywordMonitoring`,
      },
      Product: {
        keyFields: (obj) => `Product:${obj.name}`,
      },
      KeywordInfo: {
        keyFields: (obj) => `KeywordInfo:${obj.keyword}`,
      },
      SeePopularKeywordsResult: {
        keyFields: (obj) => {
          if (obj.result && (obj.result as []).length > 0) {
            const arr = obj.result as any[];
            return `PopularKeywords:${arr[0].cid}`;
          }
        },
      },
    },
  }),
});
