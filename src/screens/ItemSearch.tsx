import { faChevronRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "../components/Share";
import PageTitle from "../components/PageTitle";
import { CategoryResult, useGetCategories, useLazyGetCategories } from "../hooks/useCategories";
import { gql, useLazyQuery, useQuery } from "@apollo/client";

interface IResponseQuery {
  categoryPopularityKeyword:
  {
    state: {
      ok: boolean;
      error?: string;
    },
    ranks?: {
      rank: number;
      keyword: string;
      productCount:number;
    }[]
  }
}

interface IRequestParam {
  cid: number;
}

const POPULARITY_KEYWORD_QUERY = gql`
  query categoryPopularityKeyword($cid: Int) {
    categoryPopularityKeyword(cid: $cid) {
      state {
        ok
        error
      }
      ranks {
        rank
        keyword
        productCount
      }
    }
  }
`;


const Container = styled.div`
    
`

const CategorySelectorWrapper = styled.div`
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    padding: 20px 30px;
    display: flex;
    flex-wrap: wrap;
    flex-direction:row;
    justify-content: center;
    align-items: center;
    gap:0px 10px;
`;

const CategorySelect = styled.select`
    padding:10px 10px;
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    font-size: 14px;
    font-weight: 400;
    outline:none;
    &:hover{
        border-color: black;
    }

`

const SearchBtn = styled(Button)`
    width: auto;
    padding:8px;
`;


const KeywordsWrapper = styled(CategorySelectorWrapper)`
  margin-top: 20px;
  flex-direction: column;
  padding:0px;
  overflow: hidden;
`;

const ListColumn = styled.div`
  padding:20px 0px;
  flex: 1;
  text-align: center;
  &:hover{
    background-color: ${props=>props.theme.privateColor};
  }
`;

const ListRow = styled.div`
  width: 100%;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  align-items: center;
`

function ItemSearch() {

  const [selectCate, setSelectCate] = useState<CategoryResult>();
  const [cate1, setCate1] = useState<CategoryResult[]>();
  const [cate2, setCate2] = useState<CategoryResult[]>();
  const [cate3, setCate3] = useState<CategoryResult[]>();
  const [cate4, setCate4] = useState<CategoryResult[]>();

  const [getCategories, { loading, refetch }] = useLazyGetCategories();

  /**
   * Init
   */
  useEffect(() => {
    getCategories(
      {
        variables: { cid: 0 },
        onCompleted(data) {
          const level = data.getCategories.result?.level;
          if (level === 0) {
            setCate1(data.getCategories.result?.children);
            setCate2([]);
            setCate3([]);
            setCate4([]);
          } else if (level === 1) {
            setCate2(data.getCategories.result?.children);
            setCate3([]);
            setCate4([]);
          } else if (level === 2) {
            setCate3(data.getCategories.result?.children);
            setCate4([]);
          } else if (level === 3) {
            setCate4(data.getCategories.result?.children);
          }
        }
      }).then(item => {

        const child = item.data?.getCategories.result;
        if (child && child.children && child.children.length > 0) {
          setSelectCate(child.children[0]);
          refetch({
            cid: child.children[0].cid
          });
        }
      });
  }, []);


  /**
   * 카테고리 변경 이벤트
   * @param e 
   * @param cates 
   */
  const onChangeCate = async (e: ChangeEvent<HTMLSelectElement>, cates?: CategoryResult[]) => {
    e.preventDefault();

    const select = cates?.find((cate) => cate.name === e.target.value);
    if (select) {
      setSelectCate(select);
      refetch({
        cid: select.cid
      });
    }
  }

  const [categoryPopularityKeyword, { loading: popularityLoading, data: popularityData }] = useLazyQuery<IResponseQuery, IRequestParam>(POPULARITY_KEYWORD_QUERY);
  /**
   * 검색 이벤트
   */
  const onSearch = () => {
    
    if (selectCate) {
      categoryPopularityKeyword({
        variables: {
          cid: selectCate.cid
        }
      }).then(res => {
        console.log(res);
        if (res.data?.categoryPopularityKeyword.state.ok) {
          console.log(res.data?.categoryPopularityKeyword.ranks);
        }
      })
    }

  }

  return (
    <Container>
      <PageTitle title="아이템 발굴" />
      <CategorySelectorWrapper>
        <div>
          <span style={{ fontWeight: 600, fontSize: 16 }}>카테고리</span>
        </div>
        <div>
          <CategorySelect onChange={(e) => onChangeCate(e, cate1)}>
            {(!loading && cate1) &&
              cate1.map((category) =>
                <option key={category.cid}>{category.name}</option>
              )
            }
          </CategorySelect>
        </div>
        {cate2 && cate2.length > 0 &&
          <>
            <div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div>
              <CategorySelect onChange={(e) => onChangeCate(e, cate2)}>
                <option>카테고리 2</option>
                {
                  (!loading && cate2) &&
                  cate2.map((category) =>
                    <option key={category.cid}>{category.name}</option>
                  )
                }
              </CategorySelect>
            </div>
          </>
        }

        {cate3 && cate3.length > 0 &&
          <>
            <div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div>
              <CategorySelect onChange={(e) => onChangeCate(e, cate3)}>
                <option>카테고리 3</option>
                {
                  (!loading && cate3) &&
                  cate3.map((category) =>
                    <option key={category.cid}>{category.name}</option>
                  )
                }
              </CategorySelect>
            </div>
          </>
        }
        {cate4 && cate4.length > 0 &&
          <>
            <div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div>
              <CategorySelect>
                <option>카테고리 4</option>
                {
                  (!loading && cate4) &&
                  cate4.map((category) =>
                    <option key={category.cid}>{category.name}</option>
                  )
                }
              </CategorySelect>
            </div>
          </>
        }
        <div>
          <SearchBtn onClick={onSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </SearchBtn>
        </div>
      </CategorySelectorWrapper>
      <KeywordsWrapper>
        <ListRow>
          <ListColumn>
            <span>랭킹</span>
          </ListColumn>
          <ListColumn>
            <span>키워드</span>
          </ListColumn>
          <ListColumn>
            <span>카테고리</span>
          </ListColumn>
          <ListColumn>
            <span>매력도</span>
          </ListColumn>
          <ListColumn>
            <span>경쟁률</span>
          </ListColumn>
          <ListColumn>
            <span>검색량</span>
          </ListColumn>
          <ListColumn>
            <span>상품수</span>
          </ListColumn>
          <ListColumn>
            <span>묶음상품비율</span>
          </ListColumn>
          <ListColumn>
            <span>광고경쟁강도</span>
          </ListColumn>
          <ListColumn>
            <span>평균가</span>
          </ListColumn>
          <ListColumn>
            <span>성장성</span>
          </ListColumn>
          <ListColumn>
            <span>계절성</span>
          </ListColumn>
          <ListColumn>
            <span>브랜드점유율</span>
          </ListColumn>

        </ListRow>
        {
          popularityLoading ? "loading..." :
            <div style={{width:"100%"}}>
              {
                popularityData &&
                <ul>
                  {
                    popularityData.categoryPopularityKeyword.ranks?.map(rank =>
                       <li>
                        <ListRow>
                          <ListColumn>{rank.rank}</ListColumn>
                          <ListColumn>{rank.keyword}</ListColumn>
                          <ListColumn>3</ListColumn>
                          <ListColumn>4</ListColumn>
                          <ListColumn>5</ListColumn>
                          <ListColumn>6</ListColumn>
                          <ListColumn>{rank.productCount}</ListColumn>
                          <ListColumn>8</ListColumn>
                          <ListColumn>9</ListColumn>
                          <ListColumn>10</ListColumn>
                          <ListColumn>11</ListColumn>
                          <ListColumn>12</ListColumn>
                          <ListColumn>13</ListColumn>
                        </ListRow>
                        </li>)
                  }
                </ul>

              }
            </div>
        }
      </KeywordsWrapper>
    </Container>
  )
}

export default ItemSearch;
