import { LockIcon } from "lucide-react";
import { useState } from "react";

function ProfilePic(props) {
    const [error,setError] = useState('')
    const handleChangeRequest = () =>{
        const token = sessionStorage.getItem('token');
        fetch("http://127.0.0.1:3001/change-pp", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
              },
            body: JSON.stringify({avatar:props.name}),
          })
            .then((response) => response.json())
            .then(
                (data)=> {
                    if(data.message=='ok'){
                        window.location.reload();
                    }else{
                        setError(data.message)
                    }
                })

    }
    return ( <> {
        props.unlocked=== true ? <div className="avatar-container" onClick={handleChangeRequest} style={{cursor:`pointer`}}>
          <img 
            src={`/images/avatars/${props.name}.png`} 
            alt={`${props.unlocked}`}
          /> 
          <p>{error}</p>
           </div>
          : 
          <div className="avatar-container">
            <img 
              src={`/images/avatars/${props.name}.png`} 
              alt={`${props.unlocked}`}
              className="avatar"
            />
            <div className="locked"></div>
            <LockIcon color="#5f5f5f" size={128} className="lock-icon" />
            <p>{error}</p>
          </div>
}</>);
}

export default ProfilePic;