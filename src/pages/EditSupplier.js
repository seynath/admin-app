import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Input, Select, Typography, Row, Col, Card } from "antd";
import { base_url } from "../utils/baseUrl";
import { config } from "../utils/axiosconfig";
import { useLocation } from "react-router-dom";

const EditSupplier = () => {
  const [supplier, setSupplier] = useState({});
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const supplierId = location.pathname.split("/")[3];
  useEffect(() => {
    const fetchSupplier = async () => {
      const response = await axios.get(
        `${base_url}supplier/getsupplierbyid/${supplierId}`
      );
      console.log(response.data);
      setSupplier(response.data);
      // setProductIds(response.data.map((product) => product.product_id));
      // console.log(productIds);
    };

    const fetchProducts = async () => {
      const response = await axios.get(`${base_url}product`);
      console.log(response.data);
      const x = response.data;
      setProducts(x);
  
    };
    fetchSupplier();
    fetchProducts();
  }, [supplierId]);



  // const handleUpdateSupplier = async (updatedSupplier) => {
  //   try {
  //     const response = await axios.put(
  //       `${base_url}supplier/update-supplier/${supplierId}`,
  //       { ...updatedSupplier, productIds },
  //       config
  //     );
  //     if (response.data.success) {
  //       // Show success message and redirect to supplier list
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     // Show error message
  //   }
  // };
  const handleUpdateSupplier1 = async (updatedSupplier) => {
    try {
      let updatedProductIds = [...productIds]; // Create a copy of the current productIds array
  
      // If no new productIds have been selected, keep the old ones
      if (!updatedSupplier.productIds || !updatedSupplier.productIds.length) {
        updatedProductIds = supplier.productIds;
      } else {
        updatedProductIds = updatedSupplier.productIds;
      }
  
      const response = await axios.put(
        `${base_url}supplier/update-supplier/${supplierId}`,
        { ...updatedSupplier, productIds: updatedProductIds },
        config
      );
      if (response.data.success) {
        // Show success message and redirect to supplier list
      }
    } catch (error) {
      console.log(error);
      // Show error message
    }
  };

  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      // If no new productIds have been selected, keep the old ones
      let updatedProductIds = updatedSupplier.productIds && updatedSupplier.productIds.length
        ? updatedSupplier.productIds
        : supplier.productIds;
  
      // If no new values have been entered, keep the old ones
      let updatedData = { ...supplier, ...updatedSupplier, productIds: updatedProductIds };
  
      const response = await axios.put(
        `${base_url}supplier/update-supplier/${supplierId}`,
        updatedData,
        config
      );
      if (response.data.success) {
        // Show success message and redirect to supplier list
      }
    } catch (error) {
      console.log(error);
      // Show error message
    }
  };
  const handleProductSelect = (value) => {
    setProductIds(value);
  };

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Update the local state
      // setSupplier((prevSupplier) => ({
      //   ...prevSupplier,
      //   products: prevSupplier.products.filter((product) => product.id !== productId),
      // }));

      // Update the server
      console.log(productId);
      console.log(supplierId);
      const response = await axios.put(
        `${base_url}supplier/delete-supplier-products`,
        {productId: productId, supplierId: supplierId}

      );

      console.log(response);

      if (response.data.success) {
        // Show success message
          window.location.reload();

      }
    } catch (error) {
      console.log(error);
      // Show error message
    }
  };

  return (
    <div className="px-5 py-2">
      <h3 className="mb-4 title">Edit Supplier</h3>
      <Form
        {...formLayout}
        initialValues={{
          supplier_name: supplier.supplier_name,
          supplier_email: supplier.supplier_email,
          supplier_phone: supplier.supplier_phone,
          supplier_address: supplier.supplier_address,
        }}
        onFinish={handleUpdateSupplier}
      >
        <Form.Item
          label="Supplier Name"
          name="supplier_name"
          // rules={[{ required: true, message: "Please input supplier name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Email"
          name="supplier_email"
          // rules={[{ required: true, message: "Please input supplier email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Phone"
          name="supplier_phone"
          // rules={[{ required: true, message: "Please input supplier phone!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Address"
          name="supplier_address"
          rules={[
            // { required: true, message: "Please input supplier address!" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <div>
          <Typography.Title level={3}>Supplier Products</Typography.Title>

          {supplier && supplier.length > 0 ? (
            <Row gutter={[16, 16]}>
              {supplier.map((product) => (
                <Col key={product.id} span={6}>
                  <Card
                    cover={
                      <img
                        alt="product"
                        src={product.image_link}
                        height={200}
                      />
                    }
                    actions={[
                      <Button
                        key={product.p_id}
                        type="danger"
                        onClick={() => handleDeleteProduct(product.p_id)}
                      >
                        Delete Product
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Typography.Title level={5}>
                          {product.p_id}
                        </Typography.Title>
                      }
                      description={
                        <Typography.Paragraph>
                          {product.p_title}
                        </Typography.Paragraph>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Typography.Paragraph>
              No products supplied by this supplier.
            </Typography.Paragraph>
          )}
        </div>

        <Form.Item label="Products" name="product_ids">
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select products"
            value={productIds}
            onChange={handleProductSelect}
          >
            {products.map((product) => (
              <Select.Option key={product.p_id} value={product.p_id}>
                {product.p_id} | {product.p_title}

              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ ...formLayout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Update Supplier
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditSupplier;
