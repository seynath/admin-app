import React from "react";
import CustomInput from "../components/CustomInput";
import { base_url } from "../utils/baseUrl";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import heroImg from "../images/hero2.jpeg"


const Resetpassword = () => {
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");

  const { token } = useParams();
  console.log(token);

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log(password);
    console.log(confpassword);
    if (password == confpassword) {
      axios.put(`${base_url}user/reset-password/${token}`, { password }).then(
        (response) => {
          console.log(response);
          alert("Password Reset Successful");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <div className="py-5" style={{ background: "#ffd333",backgroundImage: `url(${heroImg})`, minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title"> Reset Password</h3>
        <p className="text-center">Please Enter your new password.</p>
        <form action="" onSubmit={handleResetPassword}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            name="confpassword"
            placeholder="Confirm Password"
            minLength={8}
            required
            value={confpassword}
            onChange={(e) => setConfPassword(e.target.value)}
          />
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100"
            style={{ background: "#ffd333" }}
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
