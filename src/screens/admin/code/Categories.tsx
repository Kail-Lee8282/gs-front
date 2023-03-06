import { useState, useEffect } from "react";
import {  faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { Button, Input, Seperation } from "../../../components/Share";
import { CategoryResult, QUERY_GETCATEGOIES, ResCategoriesData, useAddCategory } from "../../../hooks/useCategories";
import CategoryList from "../../../components/admin/categories/CategoryList";
import { useLazyQuery } from "@apollo/client";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Title = styled.h2`
    font-size:24px;
`;

const TitleWrapper = styled.div`
margin-bottom: 20px;
`;

const CategoriesContainer = styled.div`
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

`;

// const CategoryList = styled.div`

// `;

const ChevronDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
`


const GroupTitle = styled.div`
    margin-bottom:10px;
    margin-left:5px;
    letter-spacing: 2px;
    font-weight:600;
`

const ListItem = styled.div<{ focus?: boolean }>`
    display:flex;
    align-items:center;
    height:30px;
    padding:0px 10px;
    margin:2px 0;
    border-radius: 5px;
    background-color: ${props => props.focus ? props.theme.privateColor : "inherit"};
    font-weight: ${props => props.focus ? "600" : "inherit"};
    cursor:pointer;
    &:hover{
        background-color: ${props => props.theme.privateColor};
        font-weight: 600;
    }

`;

const CategoryInput = styled(Input)`
    background-color: ${props => props.theme.backgroundColor};
    margin:3px 0;
`;


const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 30px;
`;

const FormActions = styled.div`
    display:flex;
    flex-direction: row;
    gap: 10px;
    margin-top:10px;
`;



interface IForm {
    cid: number;
    pid?: number;
    name: string;
}

function Categories() {

    const [cate1, setCate1] = useState<CategoryResult>();
    const [cate2, setCate2] = useState<CategoryResult>();
    const [cate3, setCate3] = useState<CategoryResult>();
    const [cate4, setCate4] = useState<CategoryResult>();


    const { control, handleSubmit,setValue } = useForm<IForm>();

    const [getCategoriese, { loading, refetch }] = useLazyQuery<ResCategoriesData>(QUERY_GETCATEGOIES);

    const [modifyTitle, setModifyTitle] = useState("");
    const [isModifyCategory, setIsModifyCategory] = useState(false);

    useEffect(() => {
        
        getCategoriese({
            variables: { cid: 0 },
            onCompleted(data) {
                const { getCategories } = data;
                const children = getCategories.result?.children;
                const level = getCategories.result?.level;
                if (children) {
                    if (level === 0) {
                        setCate1(getCategories.result);
                        setCate2(undefined);
                        setCate3(undefined);
                        setCate4(undefined);
                    } else if (level === 1) {
                        setCate2(getCategories.result);
                        setCate3(undefined);
                        setCate4(undefined);
                    } else if (level === 2) {
                        setCate3(getCategories.result);
                        setCate4(undefined);
                    } else if (level === 3) {
                        setCate4(getCategories.result);
                    }
                }
            },
            onError(error) {
                console.log(error);
            },
        });
    }, []);

    const onListItemSelected = async (item: CategoryResult) => {
        try {
            refetch({ cid: item.cid });
        } catch (err) {
            console.error(err);
        }
    }

    const onAddCategory = (item: CategoryResult)=>{
        setIsModifyCategory(true);
        setValue("pid",item.cid);
        
        console.log(item);
        let addTitle = "";
        item.parent.map(p => addTitle += p.name + ">");
        setModifyTitle(addTitle + item.name);
    }

    const [addCategory, {loading:addLoading}] = useAddCategory();
    const onAddCategoryValid:SubmitHandler<IForm> = async(data)=>{
        await addCategory({
            variables:{
                cid:data.cid,
                pid:data.pid,
                name:data.name
            }
        });

    }


    return (
        <Container>
            <TitleWrapper>
                <Title>카테고리</Title>
                <Seperation weight={1} />
            </TitleWrapper>
            <CategoriesContainer>
                <CategoryList
                    isInitSelect
                    loading={loading}
                    title="Categories 1"
                    data={cate1}
                    onItemClick={onListItemSelected}
                    onAddItem={onAddCategory}
                />
                <ChevronDiv>
                    <FontAwesomeIcon icon={faChevronRight} />
                </ChevronDiv>
                <CategoryList
                    loading={loading}
                    title="Categories 2"
                    data={cate2}
                    onItemClick={onListItemSelected}
                    onAddItem={onAddCategory}
                />
                <ChevronDiv>
                    <FontAwesomeIcon icon={faChevronRight} />
                </ChevronDiv>
                <CategoryList
                    loading={loading}
                    title="Categories 3"
                    data={cate3}
                    onItemClick={onListItemSelected}
                    onAddItem={onAddCategory}
                />
                <ChevronDiv>
                    <FontAwesomeIcon icon={faChevronRight} />
                </ChevronDiv>
                <CategoryList
                    loading={loading}
                    title="Categories 4"
                    data={cate4}
                    onAddItem={onAddCategory}
                />
            </CategoriesContainer>
            {isModifyCategory &&
                <div>
                    <FormWrapper>
                        <GroupTitle>{modifyTitle}</GroupTitle>
                        <Controller
                            control={control}
                            name="cid"
                            rules={{required:{value:true, message:"코드 값을 입력해주세요."}}}
                            render={({ field: { value, ref } }) =>
                                <CategoryInput
                                    ref={ref}
                                    placeholder="code"
                                    type={"number"}
                                    value={value}
                                    onChange={(e)=> setValue("cid", parseInt(e.target.value))} />
                            }
                        />
                        <Controller
                            control={control}
                            name="name"
                            rules={{required:{value:true, message:"카테고리 이름을 입력해주세요."}}}
                            render={({ field: { value, onChange, ref } }) =>
                                <CategoryInput
                                    ref={ref}
                                    placeholder="name"
                                    type={"text"}
                                    value={value}
                                    onChange={onChange} />
                            }
                        />
                        <Controller
                            control={control}
                            name="pid"
                            render={({ field: { value, onChange, ref } }) =>
                                <CategoryInput
                                    ref={ref}
                                    placeholder="parent id"
                                    type={"text"}
                                    value={value}
                                    onChange={onChange}
                                    disabled />
                            }
                        />
                        <FormActions>
                            <Button onClick={handleSubmit(onAddCategoryValid)}>{addLoading ? "loading":"추가"}</Button>
                            <Button>수정</Button>
                            <Button onClick={() => setIsModifyCategory(false)}>취소</Button>
                        </FormActions>
                    </FormWrapper>
                </div>
            }
        </Container>
    );
}


export default Categories;