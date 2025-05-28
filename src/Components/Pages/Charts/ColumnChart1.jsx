import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

function ColumnChart1() {

    const [totalOutward, setTotalOutward] = useState([]);
    const [monthOutward, setMonthOutward] = useState({
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0
    });


    useEffect(() => {
        axios.get('https://inventory-api-00rj.onrender.com/outwardDate')
            .then((res) => {
                setTotalOutward(() => {
                    var dates = [];
                    res.data.map(item => dates.push(item.date));
                    return dates;
                });

            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const promises = totalOutward.map(async (data) => {
                const month = new Date(data).getMonth() + 1;
                const response = await fetch('https://inventory-api-00rj.onrender.com/outwardDate1/' + month);
                const result = await response.json();
                return { month, sum: parseInt(result[0].sum) };
            });

            const results = await Promise.all(promises);

            results.forEach(({ month, sum }) => {
                const monthName = getMonthName(month);
                setMonthOutward((prevMonthOutward) => ({
                    ...prevMonthOutward,
                    [monthName]: sum,
                }));
            });
        };

        fetchData();
    }, [totalOutward]);

    const getMonthName = (month) => {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        return monthNames[month - 1];
    };



    const [state, setState] = useState(
        {

            series: [{
                name: 'Sales',
                data: [13, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
            }],
            options: {
                chart: {
                    height: 300,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 10,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val;
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },

                xaxis: {
                    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    position: 'top',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }

                },
                title: {
                    text: 'Monthly Inflation in Argentina, 2002',
                    floating: true,
                    offsetY: 330,
                    align: 'center',
                    style: {
                        color: '#444'
                    }
                }
            },


        }

    )

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            series: [
                {
                    ...prevState.series[0],
                    data: [monthOutward.Jan, monthOutward.Feb, monthOutward.Mar, monthOutward.Apr, monthOutward.May, monthOutward.Jun, monthOutward.Jul, monthOutward.Aug, monthOutward.Sep, monthOutward.Oct, monthOutward.Nov, monthOutward.Dec],
                },

            ],
        }));
    }, [monthOutward]);

    return (
        <Chart options={state.options} series={state.series} type="bar" height={300} />


    )
}

export default ColumnChart1