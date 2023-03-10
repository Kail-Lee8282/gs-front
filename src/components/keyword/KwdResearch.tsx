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
                            <GroupTitle level="level1" title="?????????" />
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="?????????" />
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
                                <GroupTitle level="level1" title="?????????" />
                                <GroupValue>{data?.totalSearch?.toLocaleString("en-US")}</GroupValue>
                                {
                                    data?.totalSearch ?
                                        (
                                            data?.totalSearch <= 2000 ? <GradeValue grade="low">??????</GradeValue> :
                                                data?.totalSearch <= 10000 ? <GradeValue grade="nomal">??????</GradeValue>
                                                    : <GradeValue grade="high">??????</GradeValue>)
                                        : <GradeValue>-</GradeValue>
                                }
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="?????????" />
                                <GroupValue>{data?.totalSeller?.toLocaleString("en-US")}???</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level1" title="?????????" />
                                <GroupValue>{data?.avgPrice?.toLocaleString("en-US")}???</GroupValue>
                            </VerticalLayout>
                            <HorizonLayout>
                                <VerticalLayout>
                                    <GroupTitle level="level2" title="?????????" >
                                        <FontAwesomeIcon icon={faDownLong} color={"skyblue"} size={"sm"} />
                                    </GroupTitle>
                                    <GroupValue fontSize={12}>{data?.loPrice?.toLocaleString("en-US")}???</GroupValue>
                                </VerticalLayout>
                                <VerticalLayout>
                                    <GroupTitle level="level2" title="?????????" >
                                        <FontAwesomeIcon icon={faUpLong} color={"orange"} size={"sm"} />
                                    </GroupTitle>
                                    <GroupValue fontSize={12}>{data?.hiPrice?.toLocaleString("en-US")}???</GroupValue>
                                </VerticalLayout>
                            </HorizonLayout>
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="?????????" />
                                <GroupValue>-</GroupValue>
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="?????????" />
                                <GroupValue>-</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <HorizonLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="6?????? ?????? ??????" />
                                <GroupValue>{data?.totalPurchaseCnt?.toLocaleString("en-Us")}</GroupValue>
                            </VerticalLayout>
                            <VerticalLayout>
                                <GroupTitle level="level2" title="?????? ?????? ??????" />
                                <GroupValue>{data?.competitionRate}</GroupValue>
                            </VerticalLayout>
                        </HorizonLayout>
                    </CenterAlignBorderBox>
                    <CenterAlignBorderBox isBorder isShadow>
                        <VerticalLayout>
                            <GroupTitle level="level2" title="????????? ?????????" />
                            <GroupValue fontSize={16}>{data?.brandPercent}%</GroupValue>
                        </VerticalLayout>
                    </CenterAlignBorderBox>
                </CenterTopLayout>
                <CenterGraphLayout>
                    <SearchGraphBorderBox isBorder isShadow>
                        <GroupTitle level="level2" title="???????????????" />
                        <SearchChartArea>
                            <Chart type="line" width={"100%"} height={"100%"}
                                data={data?.searchVolumeByMonth?.map((item) => { return { name: `${item.series}`, value: item.value } })} />
                        </SearchChartArea>
                    </SearchGraphBorderBox>
                    <GraphGroups isBorder isShadow>
                        <HorizonLayout>
                            <GraphGroup>
                                <GroupTitle level="level2" title="?????????" />
                                <ChartArea>
                                    <Chart type="bar" width={160} height={160}
                                        data={data?.trandKwdByAge?.map((item) => { return { name: `${item.series}???`, value: item.value } })} />
                                </ChartArea>
                            </GraphGroup>
                            <GraphGroup>
                                <GroupTitle level="level2" title="??????" />
                                <ChartArea>
                                    <Chart type="donut" width={"100%"} height={"100%"}
                                        data={data?.trandKwdByGender?.map((item) => { return { name: `${item.series === "m" ? "??????" : "??????"}`, value: item.value } })} />
                                </ChartArea>
                            </GraphGroup>
                            <GraphGroup>
                                <GroupTitle level="level2" title="?????????" />
                                <ChartArea>
                                    <Chart type="donut" width={"100%"} height={"100%"}
                                        data={data?.trandKwdByDevice?.map((item) => { return { name: `${item.series === "pc" ? "PC" : "?????????"}`, value: item.value } })} />
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