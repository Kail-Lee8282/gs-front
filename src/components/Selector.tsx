import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    position: relative;
    display: inline-block;
    min-width: 150px;
    
    justify-content: space-between;
    align-items:center;
    font-size: 16px;
    font-weight: 600;
    color:gray;
    border-bottom: 1px solid ${props => props.theme.borderColor};
    padding:5px 0;
    cursor: pointer;
    
`

const DropDownTextContainer = styled.div<{ isSelected?: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 5px;
      color:${props => props.isSelected ? "#e67e22" : "inherit"};
    &>svg{
        width: 24px;
        height:24px;
    }
`

const ViewText = styled.span`
  
`

const DropDownBox = styled.div<{ isDropDown?: boolean }>`
    margin-top: 5px;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap:2px;
    border:1px solid ${props => props.theme.borderColor};
    box-shadow: 5px 5px 5px;
    background-color: white;
    border-radius: 5px;
    z-index: 1;
    width: 100%;
    visibility: ${props => props.isDropDown ? "visible" : "hidden"} ;
    max-height:200px;
    overflow: hidden;
    overflow-y: scroll;
`;

const DropDownItem = styled.div<{ selected?: boolean }>`
    padding:5px;
    color:${props => props.selected ? "#e67e22" : "inherit"} ;
    :hover{
        background-color: ${props => props.theme.privateColor};
        color:${props => props.selected ? "#e67e22" : props.theme.fontColor};
    }
`

export interface ISelectorData {
    key: string,
    value: any,
}

interface ISelectorProps {
    placehorder: string;
    data?: ISelectorData[],
    index?: number;
    onChangeValue?: (selectedItem: any, index: number) => void;
}

function Selector(props: ISelectorProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [selectedText, setSelectedText] = useState(props.placehorder);
    const [selected, setSelected] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    // 드롭박스
    const onDropBoxClick = () => {
        setSelected((prev) => !prev);
    }

    // 리스트 아이템 클릭
    const onItemClick = (key: string, item: any, index: number) => {
        setSelectedIndex(index);
    }

    // 컨포넌트 이외 클릭시 드롭박스 숨김 효과
    const handleClickOutSide = (e: MouseEvent) => {
        if (selected && !divRef.current?.contains(e.target as Node)) {
            setSelected(false);
        }
    }


    useEffect(() => {
        if (selected) document.addEventListener('mousedown', handleClickOutSide);
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide);
        }
    });

    useEffect(() => {
        if (props.data) {
            if (props.index !== undefined) {
                setSelectedIndex(props.index);
            } else {
                setSelectedIndex(undefined);
            }

        }
    }, [props.data]);

    useEffect(() => {
        if (props.data && props.onChangeValue && selectedIndex !== undefined) {
            const selectedItem = props.data.find((item, index) => index === selectedIndex);
            if (selectedItem) {
                setSelectedText(selectedItem?.key);
            } else {
                setSelectedText(props.placehorder);
            }
            props.onChangeValue(selectedItem, selectedIndex);
        } else {
            setSelectedText(props.placehorder);
        }
    }, [selectedIndex]);


    return (
        <Container onBlur={() => setSelected(false)} onClick={onDropBoxClick} ref={divRef}>
            <DropDownTextContainer isSelected={selectedIndex! >= 0}>
                <ViewText>{selectedText}</ViewText><FontAwesomeIcon icon={selected ? faCaretUp : faCaretDown} />
            </DropDownTextContainer>
            <DropDownBox isDropDown={selected} >
                {
                    props.data?.map((item, index) =>
                        <DropDownItem key={index}
                            selected={index === selectedIndex}
                            onClick={(e) => onItemClick(item.key, item.value, index)}>{item.key}</DropDownItem>)
                }

            </DropDownBox>
        </Container>
    )
}

export default Selector;