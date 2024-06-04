import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { base_url } from '../utils/baseUrl';
import { config } from '../utils/axiosconfig';
import Chart from 'chart.js/auto';

const DashboardPowerBI = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Orders',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  });

  const [dailyOrderCountData, setDailyOrderCountData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Order Count',
        data: [],
        backgroundColor: 'rgba(192, 75, 192, 0.6)',
        borderColor: 'rgba(192, 75, 192, 1)',
        borderWidth: 1
      }
    ]
  });

  // default to date should back to 7 days from now on, to date is today
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromDate, setFromDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
  );

  const getDailyOrderCount = (data) => {
    const orderCounts = {};

    data.forEach(item => {
      const date = new Date(item.date_time).toLocaleDateString();
      if (!orderCounts[date]) {
        orderCounts[date] = 1;
      } else {
        orderCounts[date]++;
      }
    });

    return orderCounts;
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axios.get(`${base_url}chart/orderChart`, {
          params: { fromDate, toDate },
          config
        });
        console.log(data);

        const labels = data.map(item => new Date(item.date_time).toLocaleDateString());
        const orders = data.map(item => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Orders',
              data: orders,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });

        const orderCounts = getDailyOrderCount(data);

        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push(date.toLocaleDateString());
        }

        const dailyOrderCounts = days.map(day => orderCounts[day] || 0);

        setDailyOrderCountData({
          labels: days,
          datasets: [
            {
              label: 'Daily Order Count',
              data: dailyOrderCounts, // Update this line to use the new variable name
              backgroundColor: 'rgba(192, 75, 192, 0.6)',
              borderColor: 'rgba(192, 75, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchChartData();
  }, [fromDate, toDate]);

  return (
    <div>
      <h2>Orders Chart</h2>
      <Bar data={chartData} />
      <h2>Daily Order Count</h2>
      <Bar data={dailyOrderCountData} />
    </div>
  );
};

export default DashboardPowerBI;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Bar } from 'react-chartjs-2';
// import { base_url } from '../utils/baseUrl';
// import { config } from '../utils/axiosconfig';
// import Chart from 'chart.js/auto';



// const DashboardPowerBI = () => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [
//       {
//         label: 'Orders',
//         data: [],
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1
//       }
//     ]
//   });

//   // default to date should back to 7 days from now on, to date is today
//   const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
//   const [fromDate, setFromDate] = useState(
//     new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]
//   );

//   useEffect(() => {
//     const fetchChartData = async () => {
//       try {
//         const { data } = await axios.get(`${base_url}chart/orderChart`, {
//           params: { fromDate, toDate },
//           config
//         });
//         console.log(data);

//         const labels = data.map(item => new Date(item.date_time).toLocaleDateString());
//                 const orders = data.map(item => item.total);

//         setChartData({
//           labels,
//           datasets: [
//             {
//               label: 'Orders',

//               data: orders,
//               backgroundColor: 'rgba(75, 192, 192, 0.6)',
//               borderColor: 'rgba(75, 192, 192, 1)',
//               borderWidth: 1
//             }
//           ]
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchChartData();
//   }, [fromDate, toDate]);

//   return (
//     <div>
//       <h2>Orders Chart</h2>
//       <Bar data={chartData} />
//     </div>
//   );
// };

// export default DashboardPowerBI;


// import React from 'react'
// import { PowerBIEmbed } from 'powerbi-client-react';
// import { models } from 'powerbi-client';


// const DashboardPowerBI = () => {
//   return (
    
//     <div>
//       <iframe title="ecom" width="1140" height="900" src="https://app.powerbi.com/reportEmbed?reportId=a6fe5519-cb75-46be-a31a-a9cb478555e9&autoAuth=true&ctid=aa232db2-7a78-4414-a529-33db9124cba7" frameborder="0" allowFullScreen="true"></iframe>
//     </div>
  
//   )
// }

// export default DashboardPowerBI