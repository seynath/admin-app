import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
// import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
// import { FormData } from "formdata-node";

// import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, resetState } from "../features/product/productSlice";
import { getSizes } from "../features/size/sizeSlice";
// let schema = yup.object().shape({
//   title: yup.string().required("Title is Required"),
//   description: yup.string().required("Description is Required"),
//   price: yup.number().required("Price is Required"),
//   brand: yup.string().required("Brand is Required"),
//   category: yup.number().required("Category is Required"),
//   // tags: yup.string().required("Tag is Required"),
//   color: yup
//     .array()
//     .min(1, "Pick at least one color")
//     .required("Color is Required"),
//   quantity: yup.number().required("Quantity is Required"),
// });

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  // price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.number().required("Category is Required"),
  // tags: yup.string().required("Tag is Required"),
  // color: yup
  //   .array()
  //   .min(1, "Pick at least one color")
  //   .required("Color is Required"),
  // size: yup.array(),
  // quantity: yup.number().required("Quantity is Required"),
  images: yup.mixed().required("Images are Required"), // Add this to validate images
  attributes: yup.array(),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);
  const [images, setImages] = useState([]);
  const [size, setSize] = useState([]);
  const [attributes, setAttributes] = useState([
    { size: "", color: "", quantity: 0 , price: 0},
  ]);

  // console.log(color);
  useEffect(() => {
    // dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    dispatch(getSizes());
  }, []);

  // const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const sizeState = useSelector((state) => state.size.sizes);
  // const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfullly!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const coloropt = [];

  colorState.forEach((i) => {
    coloropt.push({
      label: i.col_name,
      value: i.col_code,
    });
  });

  const sizeopt = [];

  sizeState.forEach((i) => {
    sizeopt.push({
      label: i.size_name,
      value: i.size_id,
    });
  });

  // const handleAttributes = (index, field, value) => {
  //   const newAttributes = [...formik.values.attributes];
  //   if (!newAttributes[index]) {
  //     newAttributes[index] = {}; // Initialize if it doesn't exist
  //   }
  //   newAttributes[index][field] = value;
  //   formik.setFieldValue("attributes", newAttributes);
  // };
  const handleAttributeChange = (idx, e) => {
    const { name, value } = e.target;
    const newAttributes = [...attributes];
    newAttributes[idx][name] = value;
    setAttributes(newAttributes);
  };

  // const img = [];
  // imgState.forEach((i) => {
  //   img.push({
  //     public_id: i.public_id,
  //     url: i.url,
  //   });
  // });

  // useEffect(() => {
  //   formik.values.color = color ? color : " ";
  //   formik.values.images = img;
  // }, [color, img]);

  // useEffect(() => {
  //   formik.values.color = color ? color : " ";
  // }, [color]);

  // useEffect(() => {
  //   formik.values.size = size ? size : " ";
  // }, [size]);

  useEffect(() => {
    formik.setFieldValue("images", images);
  }, [images]);

  useEffect(() => {
    formik.setFieldValue("attributes", attributes);
  }, [attributes]);
  

  // const formik = useFormik({
  //   initialValues: {
  //     title: "",
  //     description: "",
  //     brand: "",
  //     price: "",
  //     category: "",
  //     // tags: "",
  //     color: "",
  //     quantity: "",
  //     // images: "",
  //   },
  //   validationSchema: schema,
  //   onSubmit: (values) => {
  //     dispatch(createProducts(values));
  //     formik.resetForm();
  //     setColor(null);
  //     setTimeout(() => {
  //       dispatch(resetState());
  //     }, 3000);
  //   },
  // });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      brand: "",
      // price: "",
      category: "",
      // tags: "",
      // color: [], // Change this to an array
      // size: [],
      // quantity: "",
      images: [], // Add this to handle images
      attributes: [{ size: "", color: "", quantity: 0 , price: 0}],
    },
    validationSchema: schema,

    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("brand", values.brand);
      formData.append("category", values.category);
      // formData.append("price", values.price);
      // formData.append('tags', values.tags);
      // formData.append("color", JSON.stringify(values.color)); // Convert color to JSON string
      // formData.append("size", JSON.stringify(values.size));
      // formData.append("quantity", values.quantity);
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      formData.append("attributes", JSON.stringify(values.attributes));
      console.log(formData);
      // let x = JSON.stringify(values.attributes);
      // console.log(values.attributes);
      // console.log(attributes);
      dispatch(createProducts(formData));
      // formik.resetForm();
      // setColor(null);
      // setTimeout(() => {
      //   dispatch(resetState());
      // }, 3000);
    },
  });

  // const handleColors = (e) => {
  //   setColor(e);
  //   console.log(color);
  // };

  // const handleSizes = (e) => {
  //   setSize(e);
  //   console.log(size);
  // };

  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        <form
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>

          {/* <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange("price")}
            onBlr={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div> */}
          <CustomInput
            type="text"
            label="Enter Product Brand"
            name="brand"
            onChng={formik.handleChange("brand")}
            onBlr={formik.handleBlur("brand")}
            val={formik.values.brand}
          />

          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>

          {/* Category */}
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.cat_id}>
                  {i.cat_name}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>

          {/* <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div> */}

          {/* Colors */}
          {/* <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />

          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div> */}

          {/* Sizes */}
          {/* <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select Sizes"
            defaultValue={size}
            onChange={(i) => handleSizes(i)}
            options={sizeopt}
          />

          <div className="error">
            {formik.touched.size && formik.errors.size}
          </div> */}

          {/* Quantity */}
          {/* <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange("quantity")}
            onBlr={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div> */}


          <div className="bg-white border-1 p-5 text-center">
            {/* <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}> */}
            <Dropzone onDrop={(acceptedFiles) => setImages(acceptedFiles)}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag & drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          <div className="showimages d-flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div className="position-relative" key={index}>
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((img) => img !== image))
                  }
                  className="btn-close position-absolute"
                  style={{ top: "10px", right: "10px" }}
                ></button>
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>

          {attributes.map((attribute, idx) => (
            <div key={idx} className="d-flex">
              <select
                name="size"
                className="w-100"
                placeholder="Select Size"
                value={attribute.size}
                onChange={(e) => handleAttributeChange(idx, e)}
              >
                <option value="">Select Size</option>
                {sizeState.map((i, j) => (
                  <option key={j} value={i.size_id}>
                    {i.size_name}
                  </option>
                ))}
              </select>

              <select
                name="color"
                className="w-100"
                placeholder="Select Color"
                value={attribute.color}
                onChange={(e) => handleAttributeChange(idx, e)}
              >
                <option value="">Select Color</option>
                {colorState.map((i, j) => (
                  <option key={j} value={i.col_code}>
                    {i.col_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={attribute.quantity}
                onChange={(e) => handleAttributeChange(idx, e)}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={attribute.price}
                onChange={(e) => handleAttributeChange(idx, e)}
              />

              <button
                type="button"
                onClick={() =>
                  setAttributes(attributes.filter((_, i) => i !== idx))
                }
              >
                Remove
              </button>
            </div>
          ))}

          {/* {attributes.map((attribute, index) => (
            <div key={index} className="d-flex">
              <select
                // name={attribute.size}
                // mode= "multiple"
                // className="w-100"
                // placeholder="Select colors"
                // value={formik.values.attribute.size}
                // onChange={(e) => {
                //   const newAttributes = [...attributes];
                //   newAttributes[index].size = e.target.value;
                //   setAttributes(newAttributes);
                // }}
                name="size"
                className="w-100"
                placeholder="Select Size"
                value={attribute.size}
                onChange={(e) =>
                  handleAttributes(index, "size", e.target.value)
                }
              >
                {sizeState.map((i, j) => {
                  return (
                    <option key={j} value={i.size_id}>
                      {i.size_name}
                    </option>
                  );
                })}
              </select>

              <select
                // name = {attribute.color}
                //   className="w-100"
                //   placeholder="Select Color"
                //   value={formik.values.attribute.color}
                //   onChange={(e) => {
                //     const newAttributes = [...attributes];
                //     newAttributes[index].color = e.target.value;
                //     setAttributes(newAttributes);
                //   }}
                name="color"
                className="w-100"
                placeholder="Select Color"
                value={attribute.color}
                onChange={(e) =>
                  handleAttributes(index, "color", e.target.value)
                }
              >
                {colorState.map((i, j) => {
                  return (
                    <option key={j} value={i.col_code}>
                      {i.col_name}
                    </option>
                  );
                })}
              </select>
              <input
                // type="number"
                // placeholder="Quantity"
                // value={formik.values.attribute.quantity}
                // onChange={(e) => {
                //   const newAttributes = [...attributes];
                //   newAttributes[index].quantity = e.target.value;
                //   setAttributes(newAttributes);
                // }}
                type="number"
                placeholder="Quantity"
                value={attribute.quantity}
                onChange={(e) =>
                  handleAttributes(index, "quantity", e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setAttributes(attributes.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          ))} */}

          <button
            type="button"
            onClick={() =>
              // setAttributes([
              //   ...attributes,
              //   { size: "", color: "", quantity: 0 },
              // ])
              setAttributes([
                ...attributes,
                {
                  size: "",
                  color: "",
                  quantity: 0,
                  price: 0,
                }
              ])
              
            }
          >
            Add attribute
          </button>

          {/* <button
            type="button"
            onClick={() =>
              setAttributes([
                ...attributes,
                { size: "", color: "", quantity: 0 },
              ])
            }
          >
            Add attribute
          </button> */}

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
