import React, { useEffect, useRef, useState } from 'react'
import { CChart, CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'


function Chart({basedOn,chartData}) {
   const [labels , setLabels]=useState([])
  
  useEffect(()=>{
    if(basedOn == "daily"){
      setLabels(()=>{
        let lab = []
        for(let i= 1 ; i <=24 ; i++){
          lab.push(i+":00")
        }
        return lab
      })
    }else if(basedOn == "weekly"){
        setLabels(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"])
    }else if(basedOn == "monthly"){
      setLabels(()=>{
        let lab=[]
        for(let i=1 ; i <=30 ; i++){
          lab.push(i+"")
        }
        return lab
      })
    }else if (basedOn == "yearly"){
      setLabels(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"])
    }
  })
  return (
    <div>
        e Chart properties

<CChart
  type="line" 
  data={{
    labels:labels,
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(220, 220, 220, 0.2)",
        borderColor: "rgba(220, 220, 220, 1)",
        pointBackgroundColor: "rgba(220, 220, 220, 1)",
        pointBorderColor: "#fff",
        data:(function getLabelData(){
          let data= new Array(labels.length).fill(0)
          for(let i =0 ; i < chartData?.salesChart?.length ; i++){
            const index = chartData.salesChart[i]?._id - 1
            if (index !== -1) {
              data[index] = chartData?.salesChart[i]?.totalSales; 
            }
          }
          return data
        })()
      },
      {
        label: "Orders",
        backgroundColor: "rgba(151, 187, 205, 0.2)",
        borderColor: "rgba(151, 187, 205, 1)",
        pointBackgroundColor: "rgba(151, 187, 205, 1)",
        pointBorderColor: "#fff",
        data:(function getLabelData(){
          let data= new Array(labels.length).fill(0)
          for(let i =0 ; i < chartData?.ordersChart?.length ; i++){
            const index = chartData.ordersChart[i]?._id - 1
            if (index !== -1) {
              data[index] = chartData?.ordersChart[i]?.totalOrders; 
            }
          }
          return data
        })()
      },
    ],
  }}
  options={{
    plugins: {
      legend: {
        labels: {
          color: getStyle('--cui-body-color'),
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
          color: getStyle('--cui-body-color'),
        },
      },
      y: {
        grid: {
          color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
          color: getStyle('--cui-body-color'),
        },
      },
    },
  }}
/>
    </div>
  )
}

export default Chart