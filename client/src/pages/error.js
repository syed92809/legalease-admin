import React from "react";
import image from "../assets/error.png";
// import image from "../assets/finger.png";

const Error = () => {
  return (
    <div className="container">
      <h1 className="text-center mt-3 mb-0 text-danger">Access Denied!</h1>
      <div className="row justify-content-center align-items-center">
        <img
          className="img-fuild"
          src={image}
          style={{ width: "70%", height: "70%" }}
          alt="error"
        />
      </div>
    </div>
  );
};

export default Error;
