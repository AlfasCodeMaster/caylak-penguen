import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Challenges from './Challenges/Challenges';
import Login from "./LoginPage/Login";
import Profile from "./Profile/Profile";
import Scoreboard from './Scoreboard/Scoreboard';
import Signup from "./SignupPage/Main";
import Terminal from './Terminal/Terminal';

function App() {
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

    return () => {
      ws.close();
    };
  }
  }, []);

  return (
    <div style={{'padding':'0px'}}>
      <Routes>
      <Route path="/" Component={Login}/>
      <Route path="/sign-up" Component={Signup}/>
      <Route path="/profile" Component={Profile}/>
      <Route path="/challenges" Component={Challenges}/>
      <Route path="/scoreboard" Component={Scoreboard}/>
      <Route path="/terminal" Component={Terminal}/></Routes>
    </div>
  );
}

export default App;
