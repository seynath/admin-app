import React from "react";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { config } from "../utils/axiosconfig";
import jsPDF from "jspdf";
import "jspdf-autotable";

const CashierSalesList = () => {
  const [sales, setSalesList] = useState([]);

  const id = JSON.parse(localStorage.getItem("user")).user_id;

  const fetchCashierSales = async () => {
    try {
      const response = await axios.get(`${base_url}user/cashier/sales`, config);
      console.log(response.data);
      setSalesList(response.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  async function printBill(salesOrderId) {
    try {
      // Fetch the bill data from the backend API
      const response = await axios.get(
        `${base_url}user/print/bill/${salesOrderId}`
      );
      const items = response.data.items;
      const totalPrice = response.data.total_price;

      // Generate the pdf document
      const doc = new jsPDF();
      let yPos = 20;

      // Add title
      doc.setTextColor("#000000");
      doc.setFontSize(16);
      doc.text("SALES ORDER", 10, yPos, { align: "center" });
      yPos += 10;

      // Add items table
      doc.autoTable({
        head: [
          ["Item Name", "Size", "Color", "Unit Price", "Quantity", "Amount"],
        ],
        body: items.map((item) => [
          item.p_title,
          item.size_name,
          item.color_name,
          parseFloat(item.unit_price).toFixed(2),
          item.quantity,
          parseFloat(item.full_total_price).toFixed(2),
        ]),
        startY: yPos,
        styles: { fontSize: 10, overflow: "linebreak" },
        columnStyles: { amount: { cellWidth: 30 } },
      });

      // Calculate bottom position after adding items table
      yPos = doc.lastAutoTable.finalY;

      // Add subtotal
      doc.setFontSize(12);
      doc.text("Subtotal:", 10, yPos, { align: "left" });
      doc.text(`$${parseFloat(totalPrice).toFixed(2)}`, 140, yPos, {
        align: "right",
      });
      yPos += 10;

      // Save or preview the generated pdf
      doc.save("sales_order.pdf");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCashierSales();
  }, []);

  return (
    <div>
      <h1>Cashier Sales List</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Sales ID</th>
            <th scope="col">Total Amount</th>
            <th scope="col">Order Date</th>
            <th scope="col">Products</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.order_id}>
              <td>{sale.sales_id}</td>
              <td>{sale.total_amount}</td>
              <td>{Date(sale.date_time)}</td>
              <td>
                <Link
                  to={`/cashier/sales-list/${sale.order_id}`}
                  className="btn btn-primary"
                >
                  View
                </Link>
              </td>
              <td>
                <button
                  onClick={() => {
                    printBill(sale.sales_id);
                  }}
                >
                  Print Bill
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CashierSalesList;
