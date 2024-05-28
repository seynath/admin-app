import React, { useEffect, useState } from "react";
import { Table, Modal } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../features/product/productSlice";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "SNo",
    dataIndex: "key",
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Brand",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Category",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Color",
    dataIndex: "color",
  },
  {
    title: "Price",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, []);

  // const handleDelete = (productId) => {
  //   dispatch(deleteProduct(productId));
  // };

  const showDeleteConfirm = (productId) => {
    setIsModalVisible(true);
    setProductIdToDelete(productId);
  };

  const handleOk = () => {
    dispatch(deleteProduct(productIdToDelete));
    setIsModalVisible(false);
    // refresh page
    setTimeout(()=>{
      window.location.reload();

    }, 1000)
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const productState = useSelector((state) => state.product.products);
  const data1 = [];
  for (let i = 0; i < productState.length; i++) {
    data1.push({
      key: i + 1,
      title: productState[i].p_title,
      brand: productState[i].brand,
      category: productState[i].category,
      color: productState[i].color,
      price: `${productState[i].price}`,
      action: (
        <>
          {/* <Link to="/" className=" fs-3 text-danger">
            <BiEdit />
          </Link> */}
          <Link
            to={`/admin/edit-product/${productState[i].p_id}`}
            className="fs-3 text-danger"
          >
            <BiEdit />
          </Link>

          {/* <AiFillDelete
            onClick={() => handleDelete(productState[i].p_id)}
            className="ms-3 fs-3 text-danger"
          /> */}
          {/* <AiFillDelete
            onClick={() => {
              setIsModalVisible(true);
              setProductIdToDelete(productState[i].p_id);
            }}
            className="ms-3 fs-3 text-danger"
          /> */}
             <AiFillDelete
            onClick={() => showDeleteConfirm(productState[i].p_id)}
            className="ms-3 fs-3 text-danger"
          />
        </>
      ),
    });
  }
  console.log(data1);
  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <Modal
        title="Delete Product"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>

      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
    </div>
  );
};

export default Productlist;
