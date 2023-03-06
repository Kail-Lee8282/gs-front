import { faDownLong, faUpLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components"
import { BaseBox } from "../Share";
import Chart from "./Chart";
import GroupTitle from "./GroupTitle";
import { KeywordInfo } from "./KeywordInfoView";

const Container = styled.div`
    
`

const GroupValue = styled.span<{ fontSize?: number }>`
    font-weight: 600;
    font-size: ${props => props.fontSize ? `${props.fontSize}px` : "inherit"};
`;

const GradeValue = styled(GroupValue) <{ grade?: "low" | "nomal" | "high" }>`
    color:${props => props.grade === "low" ? "red" : props.grade === "high" ? "blue" : "inherit"};
    
`;


const CenterLayout = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    gap:10px;
`;
const CenterTopLayout = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap:10px;
`;

const CenterGraphLayout = styled.div`
    display:flex;
    flex-direction: column;
    gap:10px;
`
const BorderBox = styled(BaseBox)`
    min-height: 50px;
    min-width: 50px;
    padding: 10px;
`;

const SearchGraphBorderBox = styled(BorderBox)`
    height:400px;
`;

const GraphGroups = styled(BorderBox)`
 
`

const CenterAlignBorderBox = styled(BorderBox)`
    display:flex;
    justify-content: center;
    align-items: center;
`
const VerticalLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap:10px;
    align-items: center;
`;

const GraphGroup = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding:10px 0;
`;

const ChartArea = styled.div`
    height:160px;
    width: 160px;
`;

const SearchChartArea = styled.div`
height:100%;
width: 100%;
`

const HorizonLayout = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
    justify-content: center;
    align-items: center;
    gap:30px;
`

interface IResearchProps{
    data?:KeywordInfo;
}

function Research({data}:IResearchProps) {
    return (
        <Container>
            <CenterLayout>
                <CenterTopLayout>
                    <CenterAlignBorderBox isBorder isShadow>
                        <VerticalLayout>
                            <GroupTitle level="level1" title="매력도" />
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="경쟁률" />
                                {
                                    data && data?.totalSearch ?
                                        <>
                                            <GroupValue>
                                                {(data?.totalSeller / data?.totalSearch).toFixed(2)}
                                            </GroupValue>
                                        </>
                                        : <GroupValue>-</GroupValue>
                                }
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="검색량" />
                                <GroupValue>{data?.totalSearch?.toLocaleString("en-US")}</GroupValue>
                                {
                                    data?.totalSearch ?
                                        (
                                            data?.totalSearch <= 2000 ? <GradeValue grade="low">나쁨</GradeValue> :
                                                data?.totalSearch <= 10000 ? <GradeValue grade="nomal">보통</GradeValue>
                                                    : <GradeValue grade="high">좋음</GradeValue>)
                                        : <GradeValue>-</GradeValue>
                                }
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="상품수" />
                                <GroupValue>{data?.totalSeller?.toLocaleString("en-US")}개</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="평균가" />
                                <GroupValue>{data?.avgPrice?.toLocaleString("en-US")}원</GroupValue>
                            </VerticalLayout>
                            <HorizonLayout>
                                <VerticalLayout>
                                    <GroupTitle level="level2" title="최저가" >
                                        <FontAwesomeIcon icon={faDownLong} color={"skyblue"} size={"sm"} />
                                    </GroupTitle>
                                    <GroupValue fontSize={12}>{data?.loPrice?.toLocaleString("en-US")}원</GroupValue>
                                </VerticalLayout>
                                <VerticalLayout>
                                    <GroupTitle level="level2" title="최고가" >
                                        <FontAwesomeIcon icon={faUpLong} color={"orange"} size={"sm"} />
                                    </GroupTitle>
                                    <GroupValue fontSize={12}>{data?.hiPrice?.toLocaleString("en-US")}원</GroupValue>
                                </VerticalLayout>
                            </HorizonLayout>
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="성장성" />
                                <GroupValue>-</GroupValue>
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="계절성" />
                                <GroupValue>-</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="6개월 판매 수량" />
                                <GroupValue>{data?.totalPurchaseCnt?.toLocaleString("en-Us")}</GroupValue>
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="광고 경쟁 강도" />
                                <GroupValue>{data?.competitionRate}</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <VerticalLayout>
                            <GroupTitle level="level2" title="브랜드 점유율" />
                            <GroupValue fontSize={16}>{data?.brandPercent}%</GroupValue>
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                </CenterTopLayout>
                <CenterGraphLayout>
                    <SearchGraphBorderBox isBorder isShadow>
                        <GroupTitle level="level2" title="검색량추이" />
                        <SearchChartArea>
                            <Chart type="line" width={"100%"} height={"100%"}
                                data={data?.searchVolumeByMonth?.map((item) => { return { name: `${item.series}`, value: item.value } })} />
                        </SearchChartArea>
                    </SearchGraphBorderBox>
                    <GraphGroups isBorder isShadow>
                        <HorizonLayout>
                            <GraphGroup>
                                <GroupTitle level="level2" title="연령별" />
                                <ChartArea>
                                    <Chart type="bar" width={160} height={160}
                                        data={data?.trandKwdByAge?.map((item) => { return { name: `${item.series}대`, value: item.value } })} />
                                </ChartArea>
                            </GraphGroup>
                            <GraphGroup>
                                <GroupTitle level="level2" title="성별" />
                                <ChartArea>
                                    <Chart type="donut" width={"100%"} height={"100%"}
                                        data={data?.trandKwdByGender?.map((item) => { return { name: `${item.series === "m" ? "남성" : "여성"}`, value: item.value } })} />
                                </ChartArea>
                            </GraphGroup>
                            <GraphGroup>
                                <GroupTitle level="level2" title="기기별" />
                                <ChartArea>
                                    <Chart type="donut" width={"100%"} height={"100%"}
                                        data={data?.trandKwdByDevice?.map((item) => { return { name: `${item.series === "pc" ? "PC" : "모바일"}`, value: item.value } })} />
                                </ChartArea>
                            </GraphGroup>
                        </HorizonLayout>
                    </GraphGroups>
                </CenterGraphLayout>
            </CenterLayout>
        </Container>
    )
}

export default Research;