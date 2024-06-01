import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/baseUrl';
import * as XLSX from 'xlsx';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      const response = await axios.get(`${base_url}report/sales-report`, {
        params: { fromDate, toDate },
      });
      setSales(response.data);
      setSalesData(response.data.flatMap((sale) =>
        Object.values(sale.items).map((item) => ({
          date_time: new Date(sale.date_time).toLocaleDateString(),
          total: sale.total,
          order_source: sale.order_source,
          sales_id: sale.order_source === 'offline' ? sale.sales_id : sale.order_id,
          product_id: item.product_id,
          product_title: item.product_title,
          size_name: item.size_name,
          color_name: item.color_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
      ));
    
    }

  
  if (fromDate && toDate) {
    fetchSales();
  }
}, [fromDate, toDate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFromDate(e.target.fromDate.value);
    setToDate(e.target.toDate.value);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
    XLSX.writeFile(workbook, 'sales.xlsx');
  };

  return (
    <div>
      <h1>Sales Report</h1>
      <form onSubmit={handleFormSubmit}>
        <label>
          From Date:
          <input type="date" name="fromDate" />
        </label>
        <label>
          To Date:
          <input type="date" name="toDate" />
        </label>
        <button type="submit">Generate Report</button>
      </form>
      <button onClick={handleDownloadExcel}>Download Excel</button>
      <table className="table table-bordered table-hover mt-2 table-sm">
        <thead>
          <tr>
            <th>Date Time</th>
            <th>Total</th>
            <th>Order Source</th>
            <th>Sales ID</th>
            <th>Product ID</th>
            <th>Product</th>
            <th>Size</th>
            <th>Color</th>
            <th>Quantity</th>
            <th>Unit Price</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale) => (
            <tr key={`${sale.date_time}-${sale.sales_id}-${sale.product_id}`}>
              <td>{sale.date_time}</td>
              <td>{sale.total}</td>
              <td>{sale.order_source}</td>
              <td>{sale.sales_id}</td>
              <td>{sale.product_id}</td>
              <td>{sale.product_title}</td>
              <td>{sale.size_name}</td>
              <td>{sale.color_name}</td>
              <td>{sale.quantity}</td>
              <td>{sale.unit_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {base_url} from '../utils/baseUrl'

// const SalesReport = () => {
//   const [sales, setSales] = useState([]);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   useEffect(() => {
//     const fetchSales = async () => {
//       const response = await axios.get(`${base_url}report/sales-report`, {
//         params: { fromDate, toDate },
//       });
//       console.log(response.data);
      
//       setSales(response.data);
//     };

//     if (fromDate && toDate) {
//       fetchSales();
//     }
//   }, [fromDate, toDate]);

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     setFromDate(e.target.fromDate.value);
//     setToDate(e.target.toDate.value);
//   };

//   return (
//     <div>
//       <h1>Sales Report</h1>
//       <form onSubmit={handleFormSubmit}>
//         <label>
//           From Date:
//           <input type="date" name="fromDate"
          
//           />
//         </label>
//         <label>
//           To Date:
//           <input type="date" name="toDate" />
//         </label>
//         <button type="submit">Generate Report</button>
//       </form>

//       {
//         sales.map((sale) => (

//           // <div key={sale.sales_id} className=''>
//           //   <h5>{(sale.date_time)}</h5>
//           //   <p>Total: {sale.total}</p>
//           //   <table>
//           //     <thead>
//           //       <tr>
//           //         <th>Product</th>
//           //         <th>Size</th>
//           //         <th>Color</th>
//           //         <th>Quantity</th>
//           //         <th>Unit Price</th>
//           //       </tr>
//           //     </thead>
//           //     <tbody>
//           //       {Object.values(sale.items).map((item) => (
//           //         <tr key={item.product_slug}>
//           //           <td>{item.product_title}</td>
//           //           <td>{item.size_name}</td>
//           //           <td>{item.color_name}</td>
//           //           <td>{item.quantity}</td>
//           //           <td>{item.unit_price}</td>
//           //         </tr>
//           //       ))}
//           //     </tbody>
//           //   </table>
//           // </div>

//           <div className="container px-4 py-3 border bg-white shadow-sm rounded" style={{marginTop: "1rem"}}>
//           <h5 className="fw-bold mb-1">{sale.date_time}</h5>
//           <p className="mb-0 small">Total: {sale.total}</p>
//           <p className="mb-0 small">Order Source: {sale.order_source}</p>
//           {/* <p className="mb-0 small">Order ID: {sale.sales_id}</p>
//           <p className="mb-0 small">Order ID: {sale.order_id}</p> */}
//           {sale.order_source === "offline"  ? (<p className="mb-0 small">Sales ID: {sale.sales_id}</p>) : (<p className="mb-0 small">Order ID: {sale.sales_id}</p>)
//           }

//           <table className="table table-bordered table-hover mt-2 table-sm">
//             <thead>
//               <tr>
//                 <th>Product Id</th>
//                 <th>Product</th>
//                 <th>Size</th>
//                 <th>Color</th>
//                 <th>Quantity</th>
//                 <th>Unit Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Object.values(sale.items).map((item) => (
//                 <tr key={item.product_slug}>
//                   <td>{item.product_id}</td>
//                   <td>{item.product_title}</td>
//                   <td>{item.size_name}</td>
//                   <td>{item.color_name}</td>
//                   <td>{item.quantity}</td>
//                   <td>{item.unit_price}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         ))
//       }

      


//     </div>
//   );
// };

// export default SalesReport;
