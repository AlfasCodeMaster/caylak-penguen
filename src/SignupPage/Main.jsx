import "./main.css";
import { useState,useRef,useEffect } from "react";
import Navbar from "../Navbar/Navbar";

function Signup() {
  const [loginData, setLoginData] = useState({ username: "", password: "",passwordRepeat:"",grade:"" });
  const [fail, setFail] = useState(false);
  const [failReason, setFailReason] = useState(false);
  const selectPlaceholder = useRef()
  const changeHandler = (e) => {
    document.getElementById("keyboard-audio").play();
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    console.log(loginData)
  };
  const submitHandler = (e) => {
    e.preventDefault();
    
    // Logging the loginData for debugging
    console.log(loginData);
  
    // Check if any required fields are empty
    if (loginData.username === "" || loginData.grade === "" || loginData.password === "" || loginData.passwordRepeat === "") {
      setFail(true);
      setFailReason("Boş/Geçersiz girdi"); // "Empty/Invalid input" in Turkish
      return; // Prevent further execution if any field is empty
    }
  
    // Check if passwords match
    if (loginData.password !== loginData.passwordRepeat) {
      setFail(true);
      setFailReason("Şifreler Eşleşmiyor"); // "Passwords do not match" in Turkish
      return; // Prevent further execution if passwords don't match
    }

    if(loginData.password.length <=8){
      setFail(true)
      setFailReason("Şifre en az 8 karakter olmalıdır.")
      return;
    }
    const hasNumber = /\d/.test(loginData.password);
    if (!hasNumber) {
      setFail(true)
      setFailReason("Şifre en az bir sayıya sahip olmalıdır.")
      return;
    }

    // Check if password contains at least one special character
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(loginData.password);
    if (!hasSpecialChar) {
      setFail(true)
      setFailReason("Şifre en az bir özel karaktere sahip olmalıdır.")
      return;
    }

  
    // Proceed to send data to the server if all validations pass
    fetch("http://127.0.0.1:3001/signup", {
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
          window.location.href = "/#challenges"; // Redirect on successful signup
        } else {
          setFailReason(data.message); // Set fail reason if signup fails
          setFail(true);
        }
      })
      .catch((error) => {
        // Catch any fetch errors
        setFailReason("An error occurred during signup");
        setFail(true);
        console.error("Error:", error);
      });
  };
  
  useEffect(() => {
    selectPlaceholder.current.disabled = true
  
  }, [])
  
  return (
    <><Navbar></Navbar>
    <div id="main" style={{ padding: "0px" }}>
      <div id="loginLeft">
        <h1 id="main-header">Bayrak Sende 101</h1>
      </div>
      <div id="loginRight">
        <div id="loginContainer">
          <h2>CTF Kayıt</h2>
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
              name="password"
            ></input><input
            className="logInput"
              type="password"
              onChange={changeHandler}
              placeholder="Şifre tekrar"
              name="passwordRepeat"
            ></input>
            <select name="grade" className="logInput" onChange={changeHandler}>
            <option value={""} ref={selectPlaceholder}>Sınıf</option>

                <option value="prep">Hazırlık</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
            </select>
            <button id="submit" type="submit">Kayıt Yap</button>
            {fail ? <p className="loginError">{failReason}</p> : <></>}
          </form>
        </div>
      </div>
    </div></>
  );
}

export default Signup;