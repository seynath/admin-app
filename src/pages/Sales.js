import React, { useEffect, useState } from 'react'
import { base_url } from '../utils/baseUrl';
import { config } from '../utils/axiosconfig';
import axios from 'axios';

const Sales = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    await axios.get(`${base_url}product/sales-admin`, config)
      .then((response) => {
        setSalesData(response.data);
      },
      (error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-5"> {/* Added Bootstrap container and mt-5 classes */}
      <h2 className="text-center mb-4">Sales Data</h2> {/* Added Bootstrap text-center and mb-4 classes */}
      <table className="table table-bordered table-striped"> {/* Added Bootstrap table, table-bordered and table-striped classes */}
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Quantity</th>
            <th>Sales ID</th>
            <th>Sales Item ID</th>
            <th>Size/Color/Quantity ID</th>
            <th>Total Amount</th>
            <th>Cashier ID</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((data, index) => (
            <tr key={index}>
              <td>{data.date_time}</td>
              <td>{data.quantity}</td>
              <td>{data.sales_id}</td>
              <td>{data.sales_item_id}</td>
              <td>{data.size_color_quantity_id}</td>
              <td>{data.total_amount}</td>
              <td>{data.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
