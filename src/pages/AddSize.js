import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  createSize,
  getASize,
  resetState,
  updateASize,
} from "../features/size/sizeSlice";

let schema = yup.object().shape({
  title: yup.string().required("Size is Required"),
});
const AddSize = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getSizeId = location.pathname.split("/")[3];
  const newSize = useSelector((state) => state.size);
  const {
    isSuccess,
    isError,
    isLoading,
    createdSize,
    sizeName,
    updatedSize,
  } = newSize;
  useEffect(() => {
    if (getSizeId !== undefined) {
      dispatch(getASize(getSizeId));
    } else {
      dispatch(resetState());
    }
  }, [getSizeId]);

  useEffect(() => {
    if (isSuccess && createdSize) {
      toast.success("Size Added Successfullly!");
    }
    if (isSuccess && updatedSize) {
      toast.success("Size Updated Successfullly!");
      navigate("/admin/list-size");
    }

    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: sizeName || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getSizeId !== undefined) {
        const data = { id: getSizeId, sizeData: values };
        dispatch(updateASize(data));
        dispatch(resetState());
      } else {
        dispatch(createSize(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getSizeId !== undefined ? "Edit" : "Add"} Size
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Enter Size"
            id="size"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {getSizeId !== undefined ? "Edit" : "Add"} Size
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSize;
