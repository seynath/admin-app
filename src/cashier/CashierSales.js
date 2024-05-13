import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// Replace this with your actual base URL

const CashierSales = () => {
  const [productNumber, setProductNumber] = useState("");
  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [salesOrderId,setSalesOrderId] = useState(null)

  const debouncedFetchProducts = useCallback(
    _.debounce((number) => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(
            `${base_url}product/cashier/${number}`
          );
          const x = response.data[0];
          await setProduct(x);
          setError(null);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProducts();
    }, 500),
    []
  ); // 500ms delay

  useEffect(() => {
    if (productNumber) {
      debouncedFetchProducts(productNumber);
    }
  }, [productNumber, debouncedFetchProducts]);

  const handleProductNumberChange = (e) => {
    const id = e.target.value;
    setProductNumber(id);
  };

  // const handleProductQuantityChange = (e) => {
  //   const quantity = parseInt(e.target.value, 10)
  //   setProductQuantity(quantity)
  // }

  const handleProductQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (product && quantity > product.quantity) {
      setError(
        `The maximum available quantity for ${product.p_title} is ${product.quantity}`
      );
    } else {
      setError(null);
      setProductQuantity(quantity);
    }
  };

  // const addProductToList = (product) => {
  //   setProductList([...productList, { ...product, quantity: productQuantity }])
  //   setProductNumber('')
  //   setProduct(null)
  //   setProductQuantity(1)
  // }

  // const addProductToList = (product) => {
  //   const index = productList.findIndex(
  //     (p) =>
  //       p.p_id === product.p_id &&
  //       p.size_color_quantity_id === product.size_color_quantity_id
  //   );
  //   if (index === -1) {
  //     setProductList([
  //       ...productList,
  //       { ...product, quantity: productQuantity },
  //     ]);
  //   } else {
  //     const newProductList = [...productList];
  //     newProductList[index].quantity += productQuantity;
  //     setProductList(newProductList);
  //   }
  //   setProductNumber("");
  //   setProduct(null);
  //   setProductQuantity(1);
  // };

  const addProductToList = (product) => {
    setProductList([...productList, { ...product, quantity: productQuantity, size_color_quantity_id: product.size_color_quantity_id }]);
    setProductNumber('');
    setProduct(null);
    setProductQuantity(1);
  }
  

  // const removeProductFromList = (number) => {
  //   setProductList(productList.filter(product => product.number !== number))
  // }

  const removeProductFromList = (p_id, size_color_quantity_id) => {
    setProductList(
      productList.filter(
        (product) =>
          product.p_id !== p_id ||
          product.size_color_quantity_id !== size_color_quantity_id
      )
    );
  };

  const clearProductList = () => {
    setProductList([]);
  };

  const calculateTotal = () => {
    console.log(productList);
    return productList.reduce(
      (total, product) => total + product.unit_price * product.quantity,
      0
    );
  };

  const handleProceedToPayment = async () => {
    try {
      console.log(productList);
      const response = await axios.post(`${base_url}user/sales/create`, { products: productList }, config);
      console.log(response.data);
      console.log(response.data.salesOrder.sales_id);
      const x = response.data.salesOrder.sales_id
      setSalesOrderId(x);
      // Reset product list
      // clearProductList();
    } catch (err) {
      setError(err.message);
    }
  }

  // async function printBill(salesOrderId) {
  //   console.log(salesOrderId);
  //   try {
  //     // Fetch the bill PDF from the server
  //     const response = await axios.get(`${base_url}user/print/bill/${salesOrderId}`);
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  async function printBill(salesOrderId) {
    try {
      // Fetch the bill data from the backend API
      const response = await axios.get(`${base_url}user/print/bill/${salesOrderId}`);
      const items = response.data.items;
      const totalPrice = response.data.total_price;
  
      // Generate the pdf document
      const doc = new jsPDF();
      let yPos = 20;
  
      // Add title
      doc.setTextColor('#000000');
      doc.setFontSize(16);
      doc.text("SALES ORDER", 10, yPos, {'align': 'center'});
      yPos += 10;
  
      // Add items table
      doc.autoTable({
        head: [[
          'Item Name',
          'Size',
          'Color',
          'Unit Price',
          'Quantity',
          'Amount'
        ]],
        body: items.map(item => [
          item.p_title,
          item.size_name,
          item.color_name,
          parseFloat(item.unit_price).toFixed(2),
          item.quantity,
          parseFloat(item.full_total_price).toFixed(2)
        ]),
        startY: yPos,
        styles: { fontSize: 10, overflow: 'linebreak'},
        columnStyles: { amount: { cellWidth: 30 } }
      });
  
      // Calculate bottom position after adding items table
      yPos = doc.lastAutoTable.finalY;
  
      // Add subtotal
      doc.setFontSize(12);
      doc.text("Subtotal:", 10, yPos, {'align': 'left'});
      doc.text(`$${parseFloat(totalPrice).toFixed(2)}`, 140, yPos, {'align': 'right'});
      yPos += 10;
  
      // Save or preview the generated pdf
      doc.save('sales_order.pdf');
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-3 h-50%">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="text-center mb-4">Cashier Sales</h3>
              <input
                type="number"
                className="form-control mb-3"
                value={productNumber}
                onChange={handleProductNumberChange}
                placeholder="Enter product number"
              />
              {error && <p className="text-danger">Error: {error}</p>}
              {product && (
                <div className="d-flex align-items-center mb-3">
                  <div className="flex col-9">
                    <ul className="list-group">
                    <li className="list-group-item" key={product.p_id} onClick={() => addProductToList({...product, size_color_quantity_id: product.size_color_quantity_id})}>

                        {product.p_title} | {product.size_name} |{" "}
                        {product.unit_price} |{" "}
                        <img src={product.image_link} width={30} height={30} />
                      </li>
                    </ul>
                  </div>
                  <div className="col-3 ml-3 mx-1">
                    <input
                      type="number"
                      className="form-control"
                      value={productQuantity}
                      onChange={handleProductQuantityChange}
                      placeholder="Quantity"
                    />
                  </div>
                </div>
              )}
              <ul className="list-group mb-3">
                {productList.map((product) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={product.number}
                  >
                    <span>
                      {product.p_title} - Quantity: {product.quantity} - Price:{" "}
                      {product.unit_price}
                    </span>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        removeProductFromList(
                          product.p_id,
                          product.size_color_quantity_id
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearProductList}
                >
                  Clear
                </button>
                <div className="flex-column">
                  <p className="text-right m-0">Total: {calculateTotal()}</p>
                  
                  <div className="mt-1">
                  <button type="button" className="btn btn-primary"
                  onClick={handleProceedToPayment}
                  >
                    Proceed to Payment
                  </button>
                  </div>
                  <div className="mt-1">
                  
                  <button type="button" className="btn btn-success"
                  onClick={() => {printBill(salesOrderId)}}
                  >
                    Print Bill
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierSales;

// import React, { useEffect, useState, useCallback } from 'react'
// import { base_url } from '../utils/baseUrl'
// import axios from 'axios'
// import _ from 'lodash'

// const CashierSales = () => {
//   const [productNumber, setProductNumber] = useState('')
//   const [productList, setProductList] = useState([])
//   const [product, setProduct] = useState(null)
//   const [error, setError] = useState(null)

//   const debouncedFetchProducts = useCallback(_.debounce((number) => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${base_url}product/cashier/${number}`)
//         console.log(response.data)
//         const x = response.data[0]
//         await setProduct(x)
//         console.log(product);
//         setError(null)
//       } catch (err) {
//         setError(err.message)
//       }
//     }
//     fetchProducts()
//   }, 500), []) // 500ms delay

//   useEffect(() => {
//     if (productNumber) {
//       debouncedFetchProducts(productNumber)
//     }
//   }, [productNumber, debouncedFetchProducts])

//   const handleProductNumberChange = (e) => {
//     const id = e.target.value
//     setProductNumber(id)
//   }

//   const addProductToList = (product) => {
//     setProductList([...productList, { ...product, quantity: 1 }])
//     setProductNumber('')
//     setProduct(null)
//   }

//   const calculateTotal = () => {
//     return productList.reduce((total, product) => total + product.unit_price * product.quantity, 0)
//   }

//   return (
//     <div className="container">
//   <div className="row">
//     <div className="col">
//       <input className="form-control" value={productNumber} onChange={handleProductNumberChange} placeholder="Enter product number" />
//       {error && <p className="text-danger">Error: {error}</p>}
//       {product && (
//         <ul className="list-group">
//           <li className="list-group-item" key={product.number} onClick={() => addProductToList(product)}>
//             {product.p_title} - {product.unit_price}
//           </li>
//         </ul>
//       )}
//       <ul className="list-group">
//         {productList.map((product) => (
//           <li className="list-group-item" key={product.number}>
//             {product.p_title} - Quantity: {product.quantity} - Price: {product.unit_price}
//           </li>
//         ))}
//       </ul>
//     </div>
//     <div className="col text-right">
//       <p>Total: {calculateTotal()}</p>
//     </div>
//   </div>
// </div>
//   )
// }

// export default CashierSales
