import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './terminal.css';

function Terminal() {
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [currentLevel,setCurrentLevel] = useState(sessionStorage.getItem(`level`))

  const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
const [username,setUsername] = useState(parseJwt(sessionStorage.getItem('token')).username)

  const resetTerm = () => {
    const token = sessionStorage.getItem('token')
    fetch("http://127.0.0.1:3001/reset-terminal", {
      method: "POST",
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        }
    })
    .then((response) => response.json())
      .then((data) => {
        if(data.message=='success'){
          console.log(`success`)
        }
      });
  }

  useEffect(()=>{
    setInputValue('')
    setOutput('')
    setCurrentDirectory('~')
    resetTerm()
  },[currentLevel])

  const switcher= (key) => {
    setCurrentLevel(key)
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      executeCommand(inputValue.trim());
      setInputValue('');
    }
  };

  const executeCommand = (command) => {
    let result = '';
    if(command=='' || null){
      return 0
    }
    const token = sessionStorage.getItem('token')
    fetch("http://127.0.0.1:3001/execute-command", {
      method: "POST",
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':'application/json'
        },
      body: JSON.stringify({command:command}),
    })
      .then((response) => response.json())
      .then(
          (data)=> {
            if(data.message=='Invalid token'){
              localStorage.removeItem('token')
              sessionStorage.removeItem('token')
              window.location = `/`
            }
            setCurrentDirectory(data.currentDirectory)
            result = data.result
            console.log(data.currentDirectory)
            console.log(data.result)
            console.log(data.result)
            setOutput(data.result);

          })
    
  //   switch(currentLevel){
  //     case 1:
  //     switch (args[0]) {
  //     case 'ls':
  //       if (currentDirectory === "flag_bu_klarasörde") {
  //         result = 'homework.txt grades.txt flag.txt';
  //       } else {
  //         result = 'flag_bu_klarasörde'
  //       }

  //       break;
  //     case 'cd':
  //       if (args[1] === '..') {

  //         setCurrentDirectory('~');
  //       } else {
  //         if (args[1] && currentDirectory === "flag_bu_klarasörde") {
  //           result = `bash: cd: ${args[1]}: No such file or directory`
  //         } else if (args[1] === "flag_bu_klarasörde" && currentDirectory==='~')
  //         {            setCurrentDirectory('flag_bu_klarasörde')
  //         } else if (args[1] && currentDirectory !== "flag_bu_klarasörde"){
  //           result= `bash: cd: ${args[1]}: No such file or directory`
  //         }
  //       }
  //       break;
  //     case 'cat':
  //       if (args[1] === 'homework.txt' && currentDirectory==="flag_bu_klarasörde") {
  //         result = 'İngilizce: Workbook ve Student Book 3.1 Vocabulary Booster';
  //       } else if (args[1] === 'grades.txt' && currentDirectory==="flag_bu_klarasörde") {
  //         result = 'Türkçe:90\nİngilizce:40';
  //       } else if (args[1] === 'flag.txt' && currentDirectory==="flag_bu_klarasörde") {
  //         result = 'TIMTAL={L1NUX_TERMINAL_G0!}';
  //       } else {
  //         result = `cat: ${args[1]}: No such file or directory`;
  //       }
  //       break;
  //     default:
  //       result = `Command not found: ${args[0]}`;
  //   }
  //   break;
  //   case 2:
  //     switch (args[0]) {
  //       case 'ls':
  //         if(!args[1]){
  //           result = '1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'
  //         }else if(args[1]!=='-a'&& args[1].startsWith('-')){
  //           result = `ls: invalid option -- '${args[1]}'`
  //         }else if(args!=='-a'&& !args[1].startsWith('-')){
  //           result = `ls: cannot access '${args[1]}': No such file or directory`
  //         }else{
  //           result = '.flag.txt 1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'
  //         }
  //         break;
  //       case 'cat':
  //         switch(args[1]){
  //           case ".flag.txt":
  //             result = "TIMTAL={H1DD3N_F!L€S}"
  //             break;
  //           case "1.txt":
  //             result = "Tamamen Yalnız Değilsin"
  //             break
  //           case "2.txt":
  //             result = "Tamamen Yalnızsın"
  //             break
  //           case "3.txt":
  //             result = "Bir Şey Olmasını Mı Bekliyorsun?"
  //             break
  //           case "4.txt":
  //             result = "Postman, API geliştirme ve testi aşamasında kullanışlı olabiliyor"
  //             break
  //           case "5.txt":
  //             result = "SQL olmayan veri tabanlarına da enjeksiyon atabilirsin"
  //             break
  //           case "6.txt":
  //             result = "Yawai Mo"
  //             break
  //           case "7.txt":
  //             result = "Komutlara argüman girilebildiğini biliyor muydun?"
  //             break
  //           case "8.txt":
  //             result = "ARKANA BAK"
  //             break
  //           case "9.txt":
  //             result = "Ah be Kaneki bu kaderi haketmiyordun..."
  //             break
  //           case "10.txt":
  //             result = "Arkanda Biri Mi Var?"
  //             break
  //           default:
  //             break
      
            
  //         }
  //         break;
  //       default:
  //         result = `Command not found: ${args[0]}`;
  //     }
  //     break
  //     case 3:
  //     switch (args[0]) {
  //     case 'ls':
  //         result = '-flag.txt';
        

  //       break;
  //     case 'cat':
  //       if(command === 'cat -- -flag.txt'){
  //         result="TIMTAL={S€4RCH_P4R4M€TERS}"
  //       }
  //       break;
  //     default:
  //       result = `Command not found: ${args[0]}`;
  //   }
  //   break;
  //     default:
  //       break
  // }
    
    
  };

  return (
    <> <Navbar></Navbar>
    <div id='terminalBG'>
      <div><ul id='commandLog'>
      { output && output.map((output,key)=>{
        return <li key={key}><code>{output}</code></li>
      })}</ul>
        <div id='input' style={{display:'flex',flexDirection:'row'}}><pre className='prem'>{`${username}@mergen:${currentDirectory}$ 
`}</pre>
        <input
        className='commandInput'
        placeholder='...'
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleEnterKey}
        /></div>
      </div>
      <div>
        
      </div>
    </div></>
  );
}

export default Terminal;