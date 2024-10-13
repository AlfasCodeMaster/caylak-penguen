import "./Navbar.css";
import { LogOutIcon } from "lucide-react";
import { useState,useEffect } from "react";

function Navbar() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  useEffect(() => {
    // Update token when sessionStorage changes
    const handleStorageChange = () => {
      setToken(sessionStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 

  const [onlineStatus, setOnlineStatus] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => { 
    if(sessionStorage.getItem('token')){
      const token = sessionStorage.getItem("token");

    const wsUrl = 'ws://127.0.0.1:3002';

    // Create a new WebSocket object
    const ws = new WebSocket(wsUrl);

    

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'onlineStatus' && data.online ==true) {
        
        ws.send(JSON.stringify({ message: 'ok' }));

      }

      if( data.type === 'onlineStatusConfirmed'){
        setOnlineStatus(true)
      }
    };
    

    ws.onerror = () => {
      console.error('Error occurred while connecting to the server');
      setWsConnected(false);
    };

    ws.onopen = () => {
      console.log('Connected to the WebSocket server');
      setWsConnected(true);
      ws.send(JSON.stringify({token:token}))
    };

    // Clean up when component is unmounted
    return () => {
      ws.close();
    };
  }
  }, []);
  const handleMouseOut = () => {
    const glint = document.getElementById("background-glint");
    glint.style.animation = "glintOut .5s linear";
    setTimeout(() => [(glint.style.opacity = "0")], 500);
  };
  const handleMouseIn = () => {
    const glint = document.getElementById("background-glint");
    glint.style.animation = "glintIn .5s linear";
    setTimeout(() => {
      glint.style.opacity = "1";
      glint.style.animation = "glint 2s linear infinite alternate";
    }, 500);
  };
  const handleGlint = (e) => {
    const glint = document.getElementById("background-glint");
    glint.style.left = `${e.clientX}px`;
    glint.style.top = `${e.clientY}px`;
  };
  const logout = () => {
    sessionStorage.removeItem('token')
    document.location ='/'
  }
  return (
    <div
      id="navMain"
      style={{ padding: "0px" }}
      onMouseEnter={handleMouseIn}
      onMouseLeave={handleMouseOut}
      onMouseMove={handleGlint}
    >
      <div id="background-glint" style={{ zIndex: -1 }}></div>
      <div id="navLinkContainer">
       
        {sessionStorage.getItem('token')!=null ? <>
          <a className="navBrand" href="#/challenges">Bayrak Sende 101</a>
         <a className="navLink" href="#/scoreboard">
          Puan Tablosu
        </a>
        <a className="navLink" href="#/challenges">
          Meydan Okumalar
        </a>
        <a className="navLink" href="#/terminal">
          Terminal
        </a>
        <a className="navLink" href="#/profile">
          Profil
        </a></>: <a className="navBrand" href="/">Bayrak Sende 101</a>}
       
      </div>
<div>
{sessionStorage.getItem('token')!=null ? <button className="navLinkButton" onClick={logout}><img src="/images/logout.png" height={70}
width={60} alt="" /></button>:<></>}
        
      </div>
      
    </div>
  );
}

export default Navbar;
