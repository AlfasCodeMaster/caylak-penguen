import React, { useState,useEffect } from 'react';
import './terminal.css'
import LevelSwitch from './LevelSwitch';
import Navbar from '../Navbar/Navbar';

function Terminal() {
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [currentLevel,setCurrentLevel] = useState(1)

  useEffect(()=>{
    setInputValue('')
    setOutput('')
    setCurrentDirectory('~')
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
    const args = command.split(' ');
    
    switch(currentLevel){
      case 1:
      switch (args[0]) {
      case 'ls':
        if (currentDirectory === "flag_bu_klarasörde") {
          result = 'homework.txt grades.txt flag.txt';
        } else {
          result = 'flag_bu_klarasörde'
        }

        break;
      case 'cd':
        // Implement cd logic here to change the current directory.
        if (args[1] === '..') {

          setCurrentDirectory('~');
        } else {
          if (args[1] && currentDirectory === "flag_bu_klarasörde") {
            result = `bash: cd: ${args[1]}: No such file or directory`
          } else if (args[1] === "flag_bu_klarasörde" && currentDirectory==='~')
          {            setCurrentDirectory('flag_bu_klarasörde')
          } else if (args[1] && currentDirectory !== "flag_bu_klarasörde"){
            result= `bash: cd: ${args[1]}: No such file or directory`
          }
        }
        break;
      case 'cat':
        // Implement cat logic here to display file contents.
        if (args[1] === 'homework.txt' && currentDirectory==="flag_bu_klarasörde") {
          result = 'İngilizce: Workbook ve Student Book 3.1 Vocabulary Booster';
        } else if (args[1] === 'grades.txt' && currentDirectory==="flag_bu_klarasörde") {
          result = 'Türkçe:90\nİngilizce:40';
        } else if (args[1] === 'flag.txt' && currentDirectory==="flag_bu_klarasörde") {
          result = 'TIMTAL={L1NUX_TERMINAL_G0!}';
        } else {
          result = `cat: ${args[1]}: No such file or directory`;
        }
        break;
      default:
        result = `Command not found: ${args[0]}`;
    }
    break;
    case 2:
      switch (args[0]) {
        case 'ls':
          if(!args[1]){
            result = '1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'
          }else if(args[1]!=='-a'&& args[1].startsWith('-')){
            result = `ls: invalid option -- '${args[1]}'`
          }else if(args!=='-a'&& !args[1].startsWith('-')){
            result = `ls: cannot access '${args[1]}': No such file or directory`
          }else{
            result = '.flag.txt 1.txt 2.txt 3.txt 4.txt 5.txt 6.txt 7.txt 8.txt 9.txt 10.txt'
          }
          break;
        case 'cat':
          // Implement cat logic here to display file contents.
          switch(args[1]){
            case ".flag.txt":
              result = "TIMTAL={H1DD3N_F!L€S}"
              break;
            case "1.txt":
              result = "Tamamen Yalnız Değilsin"
              break
            case "2.txt":
              result = "Tamamen Yalnızsın"
              break
            case "3.txt":
              result = "Bir Şey Olmasını Mı Bekliyorsun?"
              break
            case "4.txt":
              result = "Postman, API geliştirme ve testi aşamasında kullanışlı olabiliyor"
              break
            case "5.txt":
              result = "SQL olmayan veri tabanlarına da enjeksiyon atabilirsin"
              break
            case "6.txt":
              result = "Yawai Mo"
              break
            case "7.txt":
              result = "Komutlara argüman girilebildiğini biliyor muydun?"
              break
            case "8.txt":
              result = "ARKANA BAK"
              break
            case "9.txt":
              result = "Ah be Kaneki bu kaderi haketmiyordun..."
              break
            case "10.txt":
              result = "Arkanda Biri Mi Var?"
              break
            default:
              break
      
            
          }
          break;
        default:
          result = `Command not found: ${args[0]}`;
      }
      break
      case 3:
      switch (args[0]) {
      case 'ls':
          result = '-flag.txt';
        

        break;
      case 'cat':
        // Implement cat logic here to display file contents.
        if(command === 'cat -- -flag.txt'){
          result="TIMTAL={S€4RCH_P4R4M€TERS}"
        }
        break;
      default:
        result = `Command not found: ${args[0]}`;
    }
    break;
      default:
        break
  }
    setOutput([...output,result]);
    
  };

  return (
    <> <Navbar></Navbar>
    <div id='terminalBG'>
      
      <LevelSwitch switcher={switcher}/>
      <div><ul id='commandLog'>
      { output && output.map((output)=>{
        return <li><code>{output}</code></li>
      })}</ul>
        <div id='input' style={{display:'flex',flexDirection:'row'}}><pre>{`alfascodemaster@codarium:${currentDirectory}$ 
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