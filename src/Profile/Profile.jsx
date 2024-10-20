import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./profile.css";
import ProfilePic from "./ProfilePic";

function Profile() {
    const [active, setActive] = useState(1)
  const [sec1,setSec1] = useState({})
    const [sec2,setSec2] = useState({})
    const [sec3,setSec3] = useState({})
    const [data,setData] = useState()
    const [formData,setFormData] = useState({ currentPass: "", newPass: "",newPassRepeat:""})

    const [fail,setFail] = useState(false)
    const [failReason,setFailReason] = useState("")
    const [avatarWardrobe,setAvatarWardrobe] = useState()

    const changeHandler = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      console.log(formData)
    };
    const submitHandler = (e) => {
      e.preventDefault();
      
      // Logging the formData for debugging
      console.log(formData);
    
      // Check if any required fields are empty
      if (formData.currentPass === "" || formData.newPass === "" || formData.newPassRepeat === "") {
        setFail(true);
        setFailReason("Boş/Geçersiz girdi"); // "Empty/Invalid input" in Turkish
        return; // Prevent further execution if any field is empty
      }
    
      // Check if passwords match
      if (formData.newPass !== formData.newPassRepeat) {
        setFail(true);
        setFailReason("Şifreler Eşleşmiyor"); // "Passwords do not match" in Turkish
        return; // Prevent further execution if passwords don't match
      }
  
      if(formData.newPass.length <=8){
        setFail(true)
        setFailReason("Şifre en az 8 karakter olmalıdır.")
        return;
      }
      const hasNumber = /\d/.test(formData.newPass);
      if (!hasNumber) {
        setFail(true)
        setFailReason("Şifre en az bir sayıya sahip olmalıdır.")
        return;
      }
  
      // Check if password contains at least one special character
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(formData.newPass);
      if (!hasSpecialChar) {
        setFail(true)
        setFailReason("Şifre en az bir özel karaktere sahip olmalıdır.")
        return;
      }
  
    
      // Proceed to send data to the server if all validations pass
      fetch("http://127.0.0.1:3001/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Şifre başarıyla güncellendi!") {
            setFailReason(data.message);
            setFail(true);
          } else {
            setFailReason(data.message);
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
 
    useEffect(()=>{
        const token = sessionStorage.getItem('token');
    fetch("http://127.0.0.1:3001/get-profile-page", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message=='Invalid token'){
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          window.location = `/`
        }
        setData(data)
        console.log(data)
      });

      fetch("http://127.0.0.1:3001/profilePictures", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setAvatarWardrobe(data)
          console.log(data)
        });
     

    },[])

    useEffect(()=>{
        switch(active){
            case 1:
                setTimeout(()=>{setSec1({color:'white'})})
                break
            case 2:
                setTimeout(()=>{setSec2({color:'white'})})
                break
            case 3:
                setTimeout(()=>{setSec3({color:'white'})})
                break
            default:
                break
        }
    },[active]) 

    const handleClick = (e) => {
        switch(active){
            case 1:
                setTimeout(()=>{setSec1({})})
                break
            case 2:
                setTimeout(()=>{setSec2({})})
                break
            case 3:
                setTimeout(()=>{setSec3({})})
                break
            default:
                break
        }
        setActive(e.target.value)
    }
  return (
    <>
      <Navbar></Navbar>
      <div style={{ padding: "0px" }} id="profile-main">
        {data &&<div className="profile-container">
            <div className="profile">
                <img height={256} width={256} src={`/images/avatars/${data.profilePic}.gif`} className="avatar"></img>
                <p className="profile-text">{ data.username}</p>
                <p className="profile-text">{ data.points}</p>
                <ul className="type-button-group">
                    <li onClick={handleClick} value={1} className="profile-button-group-button" style={sec1}>Şifre Değiştir</li>
                    <li onClick={handleClick} value={2} className="profile-button-group-button" style={sec2}>İlk 10 Tamamlama</li>
                    <li onClick={handleClick} value={3} className="profile-button-group-button" style={sec3}>Avatar Değiştir</li>
                </ul>
            </div>
            <div className="profile-action">
                {active==1 ? <form className="password-change" onSubmit={submitHandler}>
                    <input onChange={changeHandler} name="currentPass" placeholder="Mevcut Şifre" className="password-entry"></input>
                    <input onChange={changeHandler} name="newPass" placeholder="Yeni Şifre" className="password-entry"></input>
                    <input onChange={changeHandler} name="newPassRepeat" placeholder="Yeni Şifre Tekrar" className="password-entry"></input>
                    <button  className="password-confirm" type="submit" >Şifreyi Değiştir</button>
                    {fail ? <p className="loginError">{failReason}</p> : <></>}
                </form>: active==2 ? <div className="first-10">
                    {data.solvers.map((challenge)=><div className=" challange-container">
                        <p className="challenge-name">{challenge.challengeName}</p>
                        <hr className="seperator" />
                        <div className=" users-container">
                        { challenge.solvers.map((solver)=><div className="user">
                                <img height={64} width={64} className="avatar" src={ solver[1]? '/images/avatars/' +solver[2]+'.gif':'/images/avatars/' +solver[2]+'.png'} alt="" />
                                <div className="user-details">
                                <p className="user-text">{solver[0]}</p>
                                {/* <p className="user-text">100 Paun</p>*/}</div>
                            </div>)}
                            
                        </div>
                    </div>)}
                    
                </div>: active===3 ? <li id="profilePicList">
                 {avatarWardrobe ? <>
                  {avatarWardrobe.map(avatar => 
                  <ProfilePic name={avatar[0]} unlocked={avatar[1]}/>
 
)}

                 </>:<p style={{color:"white"}}>Avatarlar Alınamadı</p>}
                </li>:<></>}
                
                
            </div>

        </div>}
        
      </div>
    </>
  );
}

export default Profile;