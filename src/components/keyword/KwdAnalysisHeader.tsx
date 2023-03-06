
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Container = styled.div`
    display: flex;
    min-height: 60px;
    width: 100%;
    gap: 10px;
`;

const LeftContainer = styled.div`
    width: 150px;
    height: 150px;
    border:1px solid ${props => props.theme.borderColor};
    border-radius: 10px;
    background-color: #f1f2f6;
    overflow: hidden;
`;

const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const ProductImage = styled.img`
    width: 150px;
    height: 150px;
`;

const UndefineImage = styled.div`
    display: flex;
    width: 100%;
    height:100%;
    justify-content: center;
    align-items: center;
    svg{
        width:50px;
        height:50px;
        color:${props => props.theme.borderColor}
    }
`;


const ProductName = styled.h2`
    font-weight: 600;
    font-size: 24px;
`;

const Categories = styled.div`
    display:flex;
    flex-direction: column;
    font-size: 13px;
    margin-top:5px;
        div:first-child
    {
        letter-spacing: 1px;
        font-weight: 600;
        border-bottom: 1px solid ${props => props.theme.borderColor};
        padding-bottom: 3px;
        margin-bottom: 3px;
    }
    
`;

const Category = styled.div<{ index: number }>`
 padding:2px 0px;
    span:first-child{
        font-weight: 600;
        color:${props => props.index === 0 ? "green" : "inherit"};
    }
`;

const Title = styled.div`
    flex-grow: 1;
`;
const Managed = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 5px;
    gap:5px;

    svg{
        width: 22px;
        height:22px;
    }
`;

const AdultIcon = styled.h2`
    display: flex;
    justify-content: center;
    align-items:center;
    background-color: red;
    color:white;
    border-radius: 50%;
    padding:5px;
    font-weight: 600;

    
`;

const ManagedIcon = styled.div`
    background-color: gray;
    padding:5px;
    border-radius: 5px;
    font-weight: 600;
    color:white;
`


type KwdAnaylsisHeaderProps = {
    title: string,
    imgSrc?: string,
    isAdult?: boolean,
    isSellProhibit?: boolean,
    isSeason?: boolean,
    isRestricted?: boolean,
    isLowSearchVolume?: boolean,
    categories?: {
        ratios: number;
        fullCategory: string;
    }[]
}
function KwdAnalysisHeader({ title, imgSrc, categories, isAdult, isSellProhibit,
    isSeason,
    isRestricted,
    isLowSearchVolume }: KwdAnaylsisHeaderProps) {

    return (
        <Container>
            <LeftContainer>
                {
                    (imgSrc && imgSrc.length > 0) ? <ProductImage src={imgSrc} /> :
                        <UndefineImage>
                            <FontAwesomeIcon icon={faImage} />
                        </UndefineImage>
                }
            </LeftContainer>
            <RightContainer>
                <Title>
                    <ProductName>{title}</ProductName>
                    <Managed>
                        {
                            isAdult && <>
                                <AdultIcon id="AdultIcon">19</AdultIcon>
                                <ReactTooltip anchorId="AdultIcon" content="성인인증 필요" place="bottom" />
                            </>
                        }
                        {
                            isSellProhibit && <>
                                <FontAwesomeIcon id="BanIcon" icon={faBan} color={"red"} />
                                <ReactTooltip anchorId="BanIcon" content="판매금지 키워드" place="bottom" />
                            </>
                        }
                        {
                            isSeason && <>
                                <ManagedIcon id="SeasonIcon">시즌</ManagedIcon>
                                <ReactTooltip anchorId="SeasonIcon" content="시즌 키워드" place="bottom" />
                            </>
                        }
                        {
                            isRestricted && <>
                                <ManagedIcon id="restrictedIcon">키워드제한</ManagedIcon>
                                <ReactTooltip anchorId="restrictedIcon" content="제한된 키워드" place="bottom" />
                            </>
                        }
                        {
                            isLowSearchVolume && <>
                                <ManagedIcon id="searchLowVolume">낮은검색량</ManagedIcon>
                                <ReactTooltip anchorId="searchLowVolume" content="낮은 검색량 키워드" place="bottom" />
                            </>
                        }
                    </Managed>
                </Title>
                <Categories>
                    <div>카테고리 비율</div>
                    {
                        categories?.map((category, index) =>
                            index < 4 &&
                            <Category key={index} index={index}>
                                <span>{category.ratios}%</span> <span>{category.fullCategory}</span>
                            </Category>
                        )
                    }
                </Categories>
            </RightContainer>
        </Container>
    )
}

export default KwdAnalysisHeader;