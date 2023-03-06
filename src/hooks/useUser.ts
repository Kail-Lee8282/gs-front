import { useEffect } from "react";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoginVar, loginUserOut } from "../apollo";
import { State } from "../typeShare";

interface Grade {
  gradeName: string;
  gradeDesc: string;
  level: number;
}

interface User {
  email: string;
  phoneNum: string;
  userName: string;
  grade: Grade;
  createdAt: string;
}

interface ResultData {
  me: {
    state: State;
    result?: User;
  };
}

const ME_QUERY = gql`
  query me {
    me {
      state {
        ok
        code
        message
      }
      result {
        email
        userName
        phoneNum
        grade {
          gradeName
          gradeDesc
          level
        }
      }
    }
  }
`;

// Clinet Token 일치 여부 확인
function useUser() {
  const hasToken = useReactiveVar(isLoginVar);
  const { data, client } = useQuery<ResultData, User>(ME_QUERY, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (data?.me.result === null) {
      console.error(
        "There is token on IS but the token did not work on the backend"
      );
      loginUserOut();
    }
  }, [data]);

  return { data, client };
}

export default useUser;
