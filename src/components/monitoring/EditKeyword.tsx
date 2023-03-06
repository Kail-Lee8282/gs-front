import {useState} from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import { MonitorKwdDisplayPos, ProductDisplayPosition } from "../../screens/monitoring/DailyMonitoring";
import { State } from "../../typeShare";
import Loading from "../Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
    margin:5px 0;
    flex-direction:column;
    
    position: relative;
    display: flex;
    border:1px solid ${props => props.theme.borderColor};
    padding:10px;
    border-radius: 10px;
    box-shadow: 2px 2px 5px ${props => props.theme.borderColor};
    box-sizing: border-box;
    max-width: 100%;
`;

const Title = styled.span`
    font-size:16px;
    font-weight: 600;
`;

const ErrorMsg = styled.span`
    color:red;
`;

const InputKeywordWrapper = styled.form`
    display: flex;
    margin-top:10px;
    gap:5px;
`;

const Input = styled.input`
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 5px;
    padding:5px 10px;
`;


const SubmitButton = styled.button`
    padding:5px 10px;
    background-color: ${props => props.theme.privateColor};
    border-radius: 5px;
`;


const KeywordWrapper = styled.div`
    margin:5px 0;
`;

const GroupTitle = styled.span`
    margin-right: 5px;
`;
const KeywordGroupoWrapper = styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction:row;
    flex-wrap:wrap;
    align-items: center;
    border:1px solid ${props => props.theme.borderColor}; 
    padding: 10px;
    border-radius: 5px;
`;
const Keyword = styled.div`
    display: flex;
    gap:5px;
    margin: 0 5px;
    background-color: rgba(241,241,241);
    border: 1px solid transparent;
    border-radius: 5px;
    padding:5px;

    &>svg{
        cursor:pointer;
    }
`;

const MUTATION_ADD_MONITORING_KEYWORD = gql`    
    mutation addProductMonitoringKeyword($keyword: String!, $productNo: String!) {
        addProductMonitoringKeyword(keyword: $keyword, productNo: $productNo) {
            state {
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

type MutationAddMonitoringKeywordResult = {
    addProductMonitoringKeyword: {
        state: State;
        result?: ProductDisplayPosition;
    }
};

type MutationAddMonitoringKeywordParam = {
    productNo: string,
    keyword: string
}


const MUTATION_REMOVE_MONITORING_KEYWORD = gql`
    mutation removeProductMonitoringKwd($id: String!) {
        removeProductMonitoringKwd(id: $id) {
            state {
                ok
                code
                message
            }
        }
    }
`;

type MutationRemoveMonitoringKwdResult = {
    removeProductMonitoringKwd: {
        state: State;
    }
};

type MutationRemoveMonitoringKwdParam = {
    id: string;
};

type TSearchForm = {
    keyword: string
}

interface IEditKeywordProps {
    productNo:string;
    keywords?:MonitorKwdDisplayPos[];
}

function EditKeyword({productNo, keywords}:IEditKeywordProps){

    const [errorMsg, setErrorMsg] = useState("");
    const {control, handleSubmit, setValue} = useForm<TSearchForm>();

    const [addMonitoringKeyword, { loading }] = useMutation<MutationAddMonitoringKeywordResult, MutationAddMonitoringKeywordParam>(MUTATION_ADD_MONITORING_KEYWORD);
    const [removeProductMonitoringKwd, { loading: removeLoading }] = useMutation<MutationRemoveMonitoringKwdResult, MutationRemoveMonitoringKwdParam>(MUTATION_REMOVE_MONITORING_KEYWORD);

    const onValid: SubmitHandler<TSearchForm> = (data) => {
        addMonitoringKeyword({
            variables: {
                keyword: data.keyword,
                productNo: productNo
            },
            update(cache, result) {
                const ok = result.data?.addProductMonitoringKeyword.state.ok;
                if (!ok) {
                    const errMsg = result.data?.addProductMonitoringKeyword.state.error ? result.data?.addProductMonitoringKeyword.state.error : "";
                    setErrorMsg(errMsg);
                    return;
                } else

                setErrorMsg("");


                if (result.data?.addProductMonitoringKeyword.result) {
                    const { id, date, rank, page, index, adRank, adPage, adIndex, updateAt } = result.data?.addProductMonitoringKeyword.result;
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
                        __typename: "MonitoringKeywordRank"
                    };
                    const displayPosFragment = cache.writeFragment(
                        {
                            fragment: gql`
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
                    );

                    const monitoringKwdObj = {
                        __typename: "MonitoringKeyword",
                        keyword: data.keyword,
                        id,
                        ranks: [displayPosFragment]
                    }

                    const monitoringKwdFragment = cache.writeFragment({
                        fragment: gql`
                            fragment NewMonitoringKwd on MonitoringKeyword {
                                keyword,
                                id,
                                ranks
                            }
                        `,
                        data: monitoringKwdObj
                    });

                    cache.modify({
                        id: `MonitoringProduct:${productNo}`,
                        fields: {
                            keywords(prev) {
                                const isExist = prev.find((item: any) => item.__ref === monitoringKwdFragment?.__ref);
                                if (isExist) {
                                    return prev;
                                }

                                return [...prev, monitoringKwdFragment];

                            }
                        }
                    });
                }
            }
        });

        setValue("keyword", "");
    };

    const onKeywordRemove = (id: string) => {
        if(window.confirm("삭제하시겠습니까?") === false){
            return;
        }

        removeProductMonitoringKwd({
            variables: {
                id
            },
            update(cache, result) {
                const ok = result.data?.removeProductMonitoringKwd.state.ok;
                if (!ok) {
                    return;
                }

                cache.modify({
                    id: `MonitoringProduct:${productNo}`,
                    fields: {
                        keywords(prev) {
                            return (prev as []).filter((item: any) => item.__ref !== `MonitoringKeyword:${id}`);
                        }
                    }
                });

                cache.modify({
                    id: `MonitoringKeyword:${id}`,
                    fields: {
                        ranks(prev) {
                            console.log(prev);
                            (prev as []).forEach((item: any) => {
                                cache.evict({ id: item.__ref });
                            });
                            return [];
                        }
                    }
                })

                cache.evict({ id: `MonitoringKeyword:${id}` });
                cache.gc();
            }
        })
    }

    return(
        <>
        {(loading || removeLoading) && <Loading text="로딩중..." />}
        <Container>
                        <Title >키워드 편집</Title>
                        <InputKeywordWrapper onSubmit={handleSubmit(onValid)}>
                            <Controller
                                control={control}
                                name={"keyword"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) =>
                                    <Input onChange={onChange} value={value} />
                                }
                            />
                            <SubmitButton onSubmit={handleSubmit(onValid)}>추가</SubmitButton>
                        </InputKeywordWrapper>
                        {
                            (errorMsg || errorMsg.length > 0) && <ErrorMsg>{errorMsg}</ErrorMsg>
                        }
                        <KeywordWrapper>
                            <GroupTitle>등록된 키워드</GroupTitle>
                            <KeywordGroupoWrapper>
                                {
                                    keywords?.map((item) =>
                                        <Keyword key={item.keyword}>
                                            <span>{item.keyword}</span>
                                            <FontAwesomeIcon icon={faClose} onClick={() => onKeywordRemove(item.id)} />
                                        </Keyword>
                                    )
                                }
                            </KeywordGroupoWrapper>
                        </KeywordWrapper>
        </Container>
        </>
    )
}

export default EditKeyword;