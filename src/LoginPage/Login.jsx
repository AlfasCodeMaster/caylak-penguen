import "./login.css";
import { useState } from "react";
import Navbar from "../Navbar/Navbar";

function Login() {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [fail, setFail] = useState(false);
  const changeHandler = (e) => {
    document.getElementById("keyboard-audio").play();
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    console.log(loginData);
    e.preventDefault();
    fetch("http://127.0.0.1:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login Successful") {
          sessionStorage.setItem("token", data.token);
          window.location.href = "/#challenges";
        } else {
          setFail(true);
        }
      });
  };
  return (
    <><Navbar></Navbar>
    <div id="main" style={{ padding: "0px" }}>
      <div id="loginLeft">
        <h1 id="main-header">Bayrak Sende 101</h1>
      </div>
      <div id="loginRight">
        <div id="loginContainer">
          <h2>CTF Giriş</h2>
          <form onSubmit={submitHandler}>
            <input
            className="logInput"
              onChange={changeHandler}
              type="text"
              placeholder="Kullanıcı Adı"
              name="username"
            ></input>
            <input
            className="logInput"
              type="password"
              onChange={changeHandler}
              placeholder="Şifre"
              onSubmit={"sa"}
              name="password"
            ></input>
            <button id="submit" type="submit">Giriş Yap</button>
            {fail ? <p className="loginError">Hatalı Giriş!</p> : <></>}
          </form>
          <p className="noacc">Hesabın mı yok? <a href="/#sign-up" className="noacclink">Kayıt Ol</a></p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
