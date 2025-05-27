import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

function PieChart2() {
  const [totalStock,setTotalStock]=useState(0);
    const [totalOutward,setTotalOutward]=useState(0);

  useEffect(()=>{
    axios.get('http://localhost:3008/totalProductSum')
    .then((res)=>{
        setTotalStock(res.data[0].total);
       
    })
    .catch((err)=>console.log(err));

    axios.get('http://localhost:3008/outwardSum')
    .then((res)=>{
        setTotalOutward(res.data[0].total);
       
    })
    .catch((err)=>console.log(err));

},[])
    const [state, setState] = useState(
      {
          
        series: [70],
        options: {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              }
            },
          },
          labels: ['Total Products Sales'],
        },
      
      
      }

    )

    useEffect(() => {
      let totalCheck=(totalOutward/totalStock)*100;
      setState((prevState) => ({
        ...prevState,
        series: [parseInt(totalCheck)]
      }));
    }, [totalStock]);
    return (
        <Chart options={state.options} series={state.series} type="radialBar" height={300} />
    
    )
}

export default PieChart2