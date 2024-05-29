import React from "react";
import CustomInput from "../components/CustomInput";
import { base_url } from "../utils/baseUrl";
import axios from "axios";
import heroImg from "../images/hero2.jpeg"


const Forgotpassword = () => {

  const handleSubmit = async(event) =>{
    event.preventDefault();
    // alert(event.target.email.value);
  
    const email = event.target.email.value
  
    await axios.post(`${base_url}user/forgot-password-token`, {email})
    .then(
      (response) => {
        console.log(response)
        alert("Check your email for reset link");
  
      },
      (error) => {
        console.log(error);
      }
    )
  
  }
  return (
    <div className="py-5" style={{ background: "#ffd333",backgroundImage: `url(${heroImg})`, minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Forgot Password</h3>
        <p className="text-center">
          Please Enter your register email to get reset password mail.
        </p>
        <form action="" onSubmit={handleSubmit}>
          <CustomInput type="password" label="Email Address" id="email" />

          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgotpassword;
