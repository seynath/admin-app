import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";



const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [orderProducts, setOrderProducts] = useState([]);
  
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: 'View Ordered Products',
      dataIndex: 'view_ordered_products',
      key: 'view_ordered_products',
      render: (text, record) => (
        <Button type="primary" onClick={() => showOrderedProducts(record)}>
          View Ordered Products
        </Button>
      ),
    },
  ];
  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const response = await axios.get(`${base_url}user/get-orders`, config);
    console.log(response.data);
    setOrders(response.data.orders);
    console.log(orders);
  };

  const getOrderProducts = async (orderId) =>{
    const response = await axios.get(`${base_url}user/get-order-products/${orderId}`, config)
    console.log(response.data[0])
    const productsInOrder = response.data[0]
    setOrderProducts(productsInOrder)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    await axios.put(
      `${base_url}user/order/update-order/${orderId}`,
      { status: newStatus },
      config
    );
    getOrders();
  };

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const showOrderedProducts = (order) => {
    setSelectedOrder(order);
    setIsModalOpen2(true);
    getOrderProducts(order.order_id); // pass the order id to fetch ordered products
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data1 = orders.map((order) => ({
    key: order.order_id,
    order_id: order.order_id,
    user_id: order.user_id,
    payment_method: order.payment_method,
    email: order.email,
    mobile: order.mobile,
    order_status: order.order_status,
    action: (
      <>
        <Button type="primary" onClick={() => showModal({...selectedOrder, order_id: order.order_id})}>
          View Details
        </Button>
        <select
          onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
        >
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </>
    ),
  }));

  return (
    <div>
      <h3 className="mb-4 title">Orders</h3>
      <div>{<Table columns={columns} dataSource={data1} />}</div>
      <Modal
        title="Order Details"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p>Order ID: {selectedOrder.order_id}</p>
            <p>User ID: {selectedOrder.user_id}</p>
            <p>Payment Method: {selectedOrder.payment_method}</p>
            <p>Email: {selectedOrder.email}</p>
            <p>Mobile: {selectedOrder.mobile}</p>
            <p>Order Status: {selectedOrder.order_status}</p>
            <p>Total Amount: {selectedOrder.total_amount}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
      <Modal
        title="Ordered Products"
        open={isModalOpen2}
        onOk={() => setIsModalOpen2(false)}
        onCancel={() => setIsModalOpen2(false)}
      >
        {orderProducts && orderProducts.length > 0 && (
          <Table
            columns={[
              {
                title: 'Product Name',
                dataIndex: 'p_title',
                key: 'p_title',
              },
              {
                title: 'Price',
                dataIndex: 'unit_price',
                key: 'unit_price',
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
              },
              {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
              },
            ]}
            dataSource={orderProducts}
            pagination={false}
          />
        )}
        {orderProducts && orderProducts.length === 0 && <p>No products ordered.</p>}
      </Modal>
    </div>
  );
};

export default Orders;






// import React, { useState, useEffect } from "react";
// import { Table, Modal, Button } from "antd";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { base_url } from "../utils/baseUrl";
// import { config } from "../utils/axiosconfig";

// const columns = [
//   {
//     title: "Order ID",
//     dataIndex: "order_id",
//     key: "order_id",
//   },
//   {
//     title: "User ID",
//     dataIndex: "user_id",
//     key: "user_id",
//   },
//   {
//     title: "Payment Method",
//     dataIndex: "payment_method",
//     key: "payment_method",
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//     key: "email",
//   },
//   {
//     title: "Mobile",
//     dataIndex: "mobile",
//     key: "mobile",
//   },
//   {
//     title: "Order Status",
//     dataIndex: "order_status",
//     key: "order_status",
//   },
//   {
//     title: "Total Amount",
//     dataIndex: "total_amount",
//     key: "total_amount",
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//     key: "action",
//   },
// ];

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isModalOpen2, setIsModalOpen2] = useState(false);
//   const [orderProducts, setOrderProducts] = useState([])

//   useEffect(() => {
//     getOrders();
//   }, []);

//   const getOrders = async () => {
//     const response = await axios.get(`${base_url}user/get-orders`, config);
//     console.log(response.data);
//     setOrders(response.data.orders);
//     console.log(orders);
//   };

//   const getOrderProducts = async () =>{
//     const response = await axios.get(`${base_url}user/get-order-products`, config)
//     console.log(response.data)
//     setOrderProducts(response.data.products)
//   }

//   const updateOrderStatus = async (orderId, newStatus) => {
//     await axios.put(
//       `${base_url}user/order/update-order/${orderId}`,
//       { status: newStatus },
//       config
//     );
//     getOrders();
//   };

//   const showModal = (order) => {
//     setSelectedOrder(order);
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   // const data1 = [];
//   // for (let i = 0; i < orders.length; i++) {
//   //   data1.push({
//   //     key: i + 1,
//   //     name: orders[i].orderby.firstname,
//   //     product: (
//   //       <Link to={`/admin/order/${orders[i].orderby._id}`}>
//   //         View Orders
//   //       </Link>
//   //     ),
//   //     amount: orders[i].paymentIntent.amount,
//   //     date: new Date(orders[i].createdAt).toLocaleString(),
//   //     action: (
//   //       <>
//   //         <Button type="primary" onClick={() => showModal(orders[i])}>
//   //           View Details
//   //         </Button>
//   //         <select onChange={(e) => updateOrderStatus(orders[i]._id, e.target.value)}>
//   //           <option value="processing">Processing</option>
//   //           <option value="shipped">Shipped</option>
//   //           <option value="delivered">Delivered</option>
//   //           <option value="cancelled">Cancelled</option>
//   //         </select>
//   //       </>
//   //     ),
//   //   });
//   // }
//   const data1 = orders.map((order) => ({
//     key: order.order_id,
//     order_id: order.order_id,
//     user_id: order.user_id,
//     payment_method: order.payment_method,
//     email: order.email,
//     mobile: order.mobile,
//     order_status: order.order_status,
//     action: (
//       <>
//         <Button type="primary" onClick={() => showModal(order)}>
//           View Details
//         </Button>
//         <Button>
//           View Ordered Products
//         </Button>
//         <select
//           onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
//         >
//           <option value="processing">Processing</option>
//           <option value="shipped">Shipped</option>
//           <option value="delivered">Delivered</option>
//           <option value="cancelled">Cancelled</option>
//         </select>
//       </>
//     ),
//   }));

//   return (
//     <div>
//       <h3 className="mb-4 title">Orders</h3>
//       <div>{<Table columns={columns} dataSource={data1} />}</div>
//       <Modal
//         title="Order Details"
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         {selectedOrder && (
//           <div>
//             <p>Order ID: {selectedOrder.order_id}</p>
//             <p>User ID: {selectedOrder.user_id}</p>
//             <p>Payment Method: {selectedOrder.payment_method}</p>
//             <p>Email: {selectedOrder.email}</p>
//             <p>Mobile: {selectedOrder.mobile}</p>
//             <p>Order Status: {selectedOrder.order_status}</p>
//             <p>Total Amount: {selectedOrder.total_amount}</p>
//             {/* Add more details as needed */}
//           </div>
//         )}
//       </Modal>

//     </div>
//   );
// };

// export default Orders;

// // import React, { useEffect } from "react";
// // import { Table } from "antd";
// // import { useDispatch, useSelector } from "react-redux";
// // import { BiEdit } from "react-icons/bi";
// // import { AiFillDelete } from "react-icons/ai";
// // import { Link } from "react-router-dom";
// // import { getOrders } from "../features/auth/authSlice";
// // const columns = [
// //   {
// //     title: "SNo",
// //     dataIndex: "key",
// //   },
// //   {
// //     title: "Name",
// //     dataIndex: "name",
// //   },
// //   {
// //     title: "Product",
// //     dataIndex: "product",
// //   },
// //   {
// //     title: "Amount",
// //     dataIndex: "amount",
// //   },
// //   {

// //     title: "Date",
// //     dataIndex: "date",
// //   },

// //   {
// //     title: "Action",
// //     dataIndex: "action",
// //   },
// // ];

// // const Orders = () => {
// //   const dispatch = useDispatch();
// //   useEffect(() => {
// //     dispatch(getOrders());
// //   }, []);
// //   const orderState = useSelector((state) => state.auth.orders);

// //   const data1 = [];
// //   for (let i = 0; i < orderState.length; i++) {
// //     data1.push({
// //       key: i + 1,
// //       name: orderState[i].orderby.firstname,
// //       product: (
// //         <Link to={`/admin/order/${orderState[i].orderby._id}`}>
// //           View Orders
// //         </Link>
// //       ),
// //       amount: orderState[i].paymentIntent.amount,
// //       date: new Date(orderState[i].createdAt).toLocaleString(),
// //       action: (
// //         <>
// //           <Link to="/" className=" fs-3 text-danger">
// //             <BiEdit />
// //           </Link>
// //           <Link className="ms-3 fs-3 text-danger" to="/">
// //             <AiFillDelete />
// //           </Link>
// //         </>
// //       ),
// //     });
// //   }
// //   return (
// //     <div>
// //       <h3 className="mb-4 title">Orders</h3>
// //       <div>{<Table columns={columns} dataSource={data1} />}</div>
// //     </div>
// //   );
// // };

// // export default Orders;
