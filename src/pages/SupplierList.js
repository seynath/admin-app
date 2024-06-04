import React, { useState, useEffect } from "react";
import { Table, Modal, Button, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState([]);

  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "supplier_id",
      key: "supplier_id",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier_name",
      key: "supplier_name",
    },
    {
      title: "Supplier Email",
      dataIndex: "supplier_email",
      key: "supplier_email",
    },
    {
      title: "Supplier Phone",
      dataIndex: "supplier_phone",
      key: "supplier_phone",
    },
    {
      title: "Supplier Address",
      dataIndex: "supplier_address",
      key: "supplier_address",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setSelectedSupplier(record);
              setIsModalOpen(true);
            }}
          >
            View Details
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSelectedSupplier(record);
              setIsModalOpen2(true);
              getSupplierProducts(record.supplier_id); // pass the supplier id to fetch supplier products
            }}
          >
            View Supplier Products
          </Button>
          <Link to={`/admin/edit-supplier/${record.supplier_id}`}>
            <Button type="primary">Edit</Button>
          </Link>
          <Button
            type="primary"
            danger
            onClick={() => deleteSupplier(record.supplier_id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    const response = await axios.get(`${base_url}supplier`, config);
    console.log(response.data);
    setSuppliers(response.data);
    console.log(suppliers);
  };

  const getSupplierProducts = async (supplierId) => {
    console.log(supplierId);
    const response = await axios.get(
      `${base_url}supplier/get-supplier-products/${supplierId}`,
      config
    );
    console.log(response.data);
    setSupplierProducts(response.data);
  };

  const deleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`${base_url}supplier/${supplierId}`, config);
      message.success("Supplier deleted successfully");
      getSuppliers();
    } catch (error) {
      console.log(error);
      message.error("Error deleting supplier");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data1 = suppliers.map((supplier) => ({
    key: supplier.supplier_id,
    ...supplier,
  }));

  return (
    <div className="px-5 py-2">
      <h3 className="mb-4 title">Supplier List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <Modal
        title="Supplier Details"
        className="w-50"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedSupplier && (
          <div>
            <p>Supplier ID: {selectedSupplier.supplier_id}</p>
            <p>Supplier Name: {selectedSupplier.supplier_name}</p>
            <p>Supplier Email: {selectedSupplier.supplier_email}</p>
            <p>Supplier Phone: {selectedSupplier.supplier_phone}</p>
            <p>Supplier Address: {selectedSupplier.supplier_address}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
      <Modal
        title="Supplier Products"
        className="w-75"
        open={isModalOpen2}
        onOk={() => setIsModalOpen2(false)}
        onCancel={() => setIsModalOpen2(false)}
      >
        {supplierProducts && supplierProducts.length > 0 && (
          <Table
            columns={[
              {
                title: "Product ID",
                dataIndex: "p_id",
                key: "p_id",
              },
              {
                title: "Product Name",
                dataIndex: "p_title",
                key: "p_title",
              },
              {
                title: "Product Slug",
                dataIndex: "p_slug",
                key: "p_slug",
              },
              {
                title: "Product Description",
                dataIndex: "p_description",
                key: "p_description",
              },
              {
                title: "Brand",
                dataIndex: "brand",
                key: "brand",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                key: "quantity",
              },
              {
                title: "Price",
                dataIndex: "price",
                key: "price",
              },
            ]}
            dataSource={supplierProducts}
            pagination={false}
          />
        )}
        {supplierProducts && supplierProducts.length === 0 && (
          <p>No products for this supplier.</p>
        )}
      </Modal>
    </div>
  );
};

export default SupplierList;
