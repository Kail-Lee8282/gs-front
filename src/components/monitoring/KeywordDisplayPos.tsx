import { gql, useMutation } from "@apollo/client";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { MonitorKwdDisplayPos, ProductDisplayPosition } from "../../screens/monitoring/DailyMonitoring";
import { State } from "../../typeShare";
import WaveLoading from "../Loading/WaveLoading";
import {useEffect} from "react";

const MUTATION_UPDATERANK = gql`
  mutation updateProductRank($id: String!) {
    updateProductRank(id: $id) {
    state{
        ok
        code
        message
    }
    result {
        date
        index
        page
        rank
        adIndex
        adPage
        adRank
        id
        updateAt
    }
  }
}
`;

type UpdateRankParam = {
    id: string;
}
type UpdateRankResult = {
    updateProductRank: {
        state:State
        result?:ProductDisplayPosition
    };
}


const Container = styled.div`
    display: flex;
    align-items: center;
    padding:10px 0;
    width: 100%;
    min-width: 200px;
`;

const Keyword = styled.div`
    width: 80px;
    text-align: center;    
    font-size: 16px;
    font-weight:600;
`;


const ReflushButton = styled.button`

    padding:5px 10px;
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 5px;
    cursor:pointer;
    &>svg{
        width: 16px;
        height:16px;
    }
    :disabled{
        cursor: default;
    }
`;

const DisplayPosContainer = styled.div`
    display: flex;
    flex-direction:column;
    flex:1;
`

const DisplayPosInfoWrapper = styled.div<{isAd?:boolean}>`
    display: flex;
    padding: 5px 0px;
    width: 100%;
    font-size:16px;
    &>span:first-child{
        width: 50px;
    }
    &>span{
        width: 80px;
        text-align:center;
    }
`;


interface IKeywordDisplayPos {
    data: MonitorKwdDisplayPos
    onUpdate?: (isLoading: boolean) => void;
}

function KeywordDisplayPos(props: IKeywordDisplayPos) {
    
    const { data: { keyword, id,ranks } } = props;
    const [updateProductRank, { loading }] = useMutation<UpdateRankResult, UpdateRankParam>(MUTATION_UPDATERANK);

    let lastestRank: ProductDisplayPosition | null = null;
    if (ranks && ranks.length > 0) {
        lastestRank = ranks[ranks.length-1];
    }

    const onRankReflush = async () => {
            await updateProductRank({
                variables: {
                    id
                },
                update(cache, result) {
                    const ok = result.data?.updateProductRank?.state.ok;
                    if(!ok){
                        return;
                    }

                    if(result.data?.updateProductRank.result){
                        const {id,date, rank, page, index, adRank, adPage, adIndex, updateAt} = result.data?.updateProductRank.result;
                       
                        const displayPosObj = {
                            id,
                            date,
                            rank,
                            page,
                            index,
                            adRank,
                            adPage,
                            adIndex,
                            updateAt,
                            __typename:"MonitoringKeywordRank"
                        };
                        const displayPosFragment = cache.writeFragment(
                            {
                                fragment:gql`
                                    fragment NewDisplayPos on MonitoringKeywordRank{
                                        id,
                                        date,
                                        rank,
                                        page,
                                        index,
                                        adRank,
                                        adPage,
                                        adIndex,
                                        updateAt
                                    }
                                `,
                                data: displayPosObj
                            }
                        )

                        cache.modify({
                            id:`MonitoringKeyword:${id}`,
                            fields:{
                                ranks(prev){
                                    const isExisting = prev.find((item:any)=> item.___ref === displayPosFragment?.__ref);
                                    if(isExisting){
                                        return prev;
                                    }
                                    return [...prev, displayPosFragment];
                                }
                            }
                        })
                    }
                },
                
            })
    }

    useEffect(()=>{
        if(props.onUpdate){
            props.onUpdate(loading);
        }

    },[loading]);

    return (
        <Container>
            <Keyword>{keyword}</Keyword>
            <DisplayPosContainer>
                {
                    lastestRank && <>
                        <DisplayPosInfoWrapper>
                            <span>일반</span>
                            <span>{lastestRank.rank > 0 ? lastestRank.rank+" 위":"800위 밖"}</span>
                            <span>{lastestRank.page > 0 ? lastestRank.page+" 페이지":"800위 밖"}</span>
                            <span>{lastestRank.index >0 ?lastestRank.index+" 번쨰":"800위 밖"}</span>
                            
                        </DisplayPosInfoWrapper>
                        {
                            lastestRank.adRank > 0 && (
                                <DisplayPosInfoWrapper isAd={true}>
                                    <span>광고</span>
                                    <span>{lastestRank.adRank} 위</span>
                                    <span>{lastestRank.adPage} 페이지</span>
                                    <span>{lastestRank.adIndex} 번쨰</span>
                                </DisplayPosInfoWrapper>
                            )

                        }
                    </>
                }
            </DisplayPosContainer>
            {
                lastestRank && <div>
                {
                    `${new Date(lastestRank.updateAt*1).getFullYear()}-${(new Date(lastestRank.updateAt*1).getMonth()+1).toString().padStart(2,"0")}-${(new Date(lastestRank.updateAt*1).getDate()).toString().padStart(2,"0")} ${new Date(lastestRank.updateAt*1).getHours().toString().padStart(2,"0")}:${new Date(lastestRank.updateAt*1).getMinutes().toString().padStart(2,"0")}` 
                }
                </div>
            }
            <ReflushButton onClick={onRankReflush} disabled={loading}>{
                loading ? <WaveLoading /> :
                    <FontAwesomeIcon icon={faRefresh} />
            }</ReflushButton>


        </Container>
    )
}

export default KeywordDisplayPos;