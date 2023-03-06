import ApexCharts from 'react-apexcharts';
import { isDarkModeVar } from '../../apollo';

type ChartProps = {
    type:"bar"|"donut"|"line"
    data?: { name: string, value: number }[]
    width?:number|string;
    height?:number|string;
}

type ChartState = {
    options:ApexCharts.ApexOptions,
    series?:ApexAxisChartSeries | ApexNonAxisChartSeries
}
function Chart(props: ChartProps) {

    const isDark = isDarkModeVar();
    let state:ChartState={options:{}}

    const values = props.data? props.data : [];

    if(props.type === "bar"){
        state = {
            options:{
                chart:{
                    toolbar:{
                        show:false,
                    },
                    zoom:{
                        enabled:false
                    },
                    parentHeightOffset:0,
                    // sparkline:{
                    //     enabled:true
                    // },
                },
                tooltip:{
                    fixed:{
                        enabled:false
                    },
                    x:{
                        show:false
                    },
                    y:{
                        title:{
                            formatter(seriesName) {
                                return '';
                            },
                        },
                    },
                    marker:{
                        show:false
                    }
                }
                ,
                plotOptions:{
                    bar:{
                        borderRadius:5,
                        borderRadiusApplication:"end",
                        columnWidth:"80%"

                    }
                },
                grid:{
                    show:false,
                    padding:{
                        bottom:-20,
                    }
                },
                dataLabels:{
                    enabled:false
                }
                ,
                xaxis:{
                    categories:values.map(item=>item.name)
                },
                yaxis:{
                    show:false
                },
                noData:{
                    text:"데이터 없음",
                },
                theme:{
                    mode: isDark?"dark":"light"
                },
                
            },
            series:[
                {
                    name:"%",
                    data:values.map(item=>item.value)
                }
            ]
        }
    }else if(props.type === "donut"){
        state = {
            options:{
                chart:{
                    toolbar:{
                        show:false
                    },
                    offsetY:10
                },
                grid:{
                    padding:{
                        bottom:-20
                    }
                },
                plotOptions:{
                    pie:{
                        donut: {
                            size: "40%",
                        }
                    }
                },
                legend:{
                    show:true,
                    position:"bottom",
                    horizontalAlign:"center",
                    
                    markers:{
                        width:10,
                        height:10,
                    },
                    itemMargin:{
                        vertical:0
                    }

                },
                dataLabels:{
                    
                }
                ,
                theme:{
                    mode: isDark?"dark":"light"
                },
                labels:values.map(item=>item.name),
                noData:{
                    text:"데이터 없음",
                    style:{
                        fontSize:"15px",
                    }
                }
            },
            series:values.map(item=>item.value)
        }
    }else if(props.type === "line"){
        state = {
            options:{
                chart:{
                    
                    zoom:{
                        enabled:false
                    },
                    toolbar:{
                        show:false
                    }
                },
                xaxis:{
                    categories:values.map(item=>item.name)
                },
                stroke:{
                    curve:'smooth',
                    width:2
                },
                markers:{
                    size:3,
                },
                tooltip:{
                    y:{
                        title:{
                            formatter(seriesName) {
                                return "";
                            },
                        }
                    }
                }
                ,
                noData:{
                    text:"데이터 없음",
                    style:{
                        fontSize:"15px",
                    }
                }
            },
            series:[
                {
                    data:values.map(item=>item.value)
                }
            ]
        }
    }

    return (
    <ApexCharts type={props.type} 
        options={state.options}
        series={state.series}
        height={props.height}
        width={props.width}

    />)
}

export default Chart;
