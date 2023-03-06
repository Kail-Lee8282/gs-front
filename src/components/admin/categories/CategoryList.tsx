import { useState, useEffect } from "react";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { CategoryResult } from "../../../hooks/useCategories";
import { BaseBox } from "../../Share";


const Container = styled.div`
    
`;

const GroupTitle = styled.div`
    margin-bottom:10px;
    margin-left:5px;
    letter-spacing: 2px;
    font-weight:600;
`;


const GroupBox = styled(BaseBox)`
    min-width:180px;
    min-height:200px;
    max-height:300px;
    padding:10px 5px;
    overflow-y: scroll;
    
`;

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

const AddListItem = styled(ListItem)`
    justify-content:center;
`;


interface ICategoryListProps {
    title?: string,
    loading?: boolean,
    data?: CategoryResult,
    isInitSelect?: boolean,
    onAddItem?: (item:CategoryResult) => void;
    onItemClick?: (item: CategoryResult) => void;
}

function CategoryList({ title, loading, data, isInitSelect, onAddItem, onItemClick }: ICategoryListProps) {
    const [isAddItem, setIsAddItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CategoryResult | null>(null);
    const onListItemClick = (item: CategoryResult) => {

        if (selectedItem?.cid === item.cid) return;

        setSelectedItem(item);
        if (onItemClick) {
            onItemClick(item);
        }
    }

    const onAddItemClick = () => {
        if (onAddItem && data) {
            onAddItem(data);
        }
    }
    

    useEffect(() => {
        // 추가 데이터 표시
        if(data){
            setIsAddItem(true);
        }else{
            setIsAddItem(false);
        }

        // 초기 선택 여부
        if (isInitSelect && data?.children && data.children.length > 0) {
            setSelectedItem(data.children[0]);
            if (onItemClick) onItemClick(data.children[0]);
        } else {
            setSelectedItem(null);
        }

    }, [data]);


    return (
        <Container>
            <GroupTitle>{title}</GroupTitle>
            <GroupBox>
                {
                    loading ? <span>Loading..</span> :
                        (
                            <ul>
                                {isAddItem &&
                                    <li>
                                        <AddListItem onClick={() => onAddItemClick()}>
                                            <FontAwesomeIcon icon={faAdd} />
                                        </AddListItem>
                                    </li>
                                }

                                {data?.children?.map(item => <li key={item.cid}>
                                    <ListItem onClick={() => onListItemClick(item)}
                                        focus={selectedItem?.cid === item.cid}>
                                        {item.name}
                                    </ListItem>
                                </li>)}
                            </ul>
                        )
                }
            </GroupBox>
        </Container>
    );
}

export default CategoryList;