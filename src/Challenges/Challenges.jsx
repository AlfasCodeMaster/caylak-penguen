import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import ChallengeCard from "./ChallengeCard";
import "./Challenges.css";

function Challenges() {
  const [gridChallenges, setChallenges] = useState([]);
  const fetchFail = () => {
    const token = sessionStorage.getItem('token');
    fetch("http://127.0.0.1:3001/get-challenges", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setChallenges(data.challenges);
      });
  };
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    fetch("http://127.0.0.1:3001/get-challenges", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setChallenges(data.challenges);
      });
  }, []);

  const [active, setActive] = useState(0)
  const categories = ["Tümü","Web","OSINT","Kriptografi","Linux Terminali"]
  const [style0,setStyle0] = useState({})
    const [style1,setStyle1] = useState({})
    const [style2,setStyle2] = useState({})
    const [style3,setStyle3] = useState({})
    const [style4,setStyle4] = useState({})

    const [diff, setDiff] = useState(0)
  const diffs = ["Tümü","Kolay","Orta","Zor","Ruh Emici"]
  const [diff1,setdiff1] = useState({})
    const [diff2,setdiff2] = useState({})
    const [diff3,setdiff3] = useState({})
    const [diff4,setdiff4] = useState({})
    const [diff5,setdiff5] = useState({})

    useEffect(()=>{
        switch(active){
            case 0:
                setTimeout(()=>{setStyle0({backgroundColor:'#aa8250'})})
                break
            case 1:
                setTimeout(()=>{setStyle1({backgroundColor:'#aa8250'})})
                break
            case 2:
                setTimeout(()=>{setStyle2({backgroundColor:'#aa8250'})})
                break
            case 3:
                setTimeout(()=>{setStyle3({backgroundColor:'#aa8250'})})
                break
            case 4:
                setTimeout(()=>{setStyle4({backgroundColor:'#aa8250'})})
                break
            default:
                break
        }
    },[active]) 

    useEffect(()=>{
      switch(diff){
          case 0:
              setTimeout(()=>{setdiff1({backgroundColor:'#aa8250'})})
              break
          case 1:
              setTimeout(()=>{setdiff2({backgroundColor:'#aa8250'})})
              break
          case 2:
              setTimeout(()=>{setdiff3({backgroundColor:'#aa8250'})})
              break
          case 3:
              setTimeout(()=>{setdiff4({backgroundColor:'#aa8250'})})
              break
          case 4:
              setTimeout(()=>{setdiff5({backgroundColor:'#aa8250'})})
              break
          default:
              break
      }
  },[diff]) 



    const handleClick = (e) => {
        switch(active){
            case 1:
                setTimeout(()=>{setStyle1({})})
                break
            case 2:
                setTimeout(()=>{setStyle2({})})
                break
            case 3:
                setTimeout(()=>{setStyle3({})})
                break
            case 0:
                setTimeout(()=>{setStyle0({})})
                break
            case 4:
                setTimeout(()=>{setStyle4({})})
                break
            default:
                break
        }
        setActive(e.target.value)
        console.log(e.target.value)
    }

    const handleDiff = (e) => {
      switch(diff){
          case 1:
              setTimeout(()=>{setdiff2({})})
              break
          case 2:
              setTimeout(()=>{setdiff3({})})
              break
          case 3:
              setTimeout(()=>{setdiff4({})})
              break
          case 0:
              setTimeout(()=>{setdiff1({})})
              break
          case 4:
              setTimeout(()=>{setdiff5({})})
              break
          default:
              break
      }
      setDiff(e.target.value)
      console.log(e.target.value)
  }

  return (
    <>
    <Navbar></Navbar>
    
    <div style={{ padding: "0px" }}  id="challenges-main">
      <div>
        <h1 id="challengeHeader">Meydan Okumalar</h1>
      </div>
      <div className="challenge-type-buttons">
      <ul className='type-button-group'><li className='button' value={0} style={style0} onClick={handleClick}>Tümü</li><li className='button' value={1} style={style1} onClick={handleClick}>Web</li><li className='button' value={2} style={style2} onClick={handleClick}>OSINT</li><li className='button' value={3} style={style3} onClick={handleClick}>Kriptografi</li><li className='button' value={4} style={style4} onClick={handleClick}>Terminal</li></ul>
      </div>
      <div className="challenge-type-buttons">
      <ul className='type-button-group'><li className='button' value={0} style={diff1} onClick={handleDiff}>Tümü</li><li className='button' value={1} style={diff2} onClick={handleDiff}>Kolay</li><li className='button' value={2} style={diff3} onClick={handleDiff}>Orta</li><li className='button' value={3} style={diff4} onClick={handleDiff}>Zor</li><li className='button' value={4} style={diff5} onClick={handleDiff}>Ruh Emici</li></ul>
      </div>
      <div className="challenge-grid">
      {gridChallenges &&

      active==0 && diff==0 ? 
        gridChallenges
          .map((challengeData, index) => (
            <ChallengeCard
              key={index}
              index={index}
              isCompleted={challengeData.completed}
              isUnlocked={challengeData.unlocked}
              category={challengeData.category}
              challangeGain= {challengeData.challangeGain}
              challengeName={challengeData.challengeName}
              challengePoints={challengeData.points}
              keywords={challengeData.keywords}
              unlocks={challengeData.unlocks}
              flag={challengeData.flag}
              hint={challengeData.hint}
              hintUnlocked = {challengeData.hintUnlocked}
              desc={challengeData.challengeDesc}
              fetchFail= {fetchFail}
              failCount= {challengeData.fails==0 ? "":challengeData.fails}
              solCount = {challengeData.solCount}
            />
          ))
        :active!=0 && diff==0? gridChallenges
        .filter(challengeData => challengeData.category === categories[active] )
        .map((challengeData, index) => (
          <ChallengeCard
          key={index}
          index={index}
          isCompleted={challengeData.completed}
          isUnlocked={challengeData.unlocked}
          category={challengeData.category}
          challangeGain= {challengeData.challangeGain}
          challengeName={challengeData.challengeName}
          challengePoints={challengeData.points}
          keywords={challengeData.keywords}
          unlocks={challengeData.unlocks}
          flag={challengeData.flag}
          hint={challengeData.hint}
          hintUnlocked = {challengeData.hintUnlocked}
          desc={challengeData.challengeDesc}
          fetchFail= {fetchFail}
          failCount= {challengeData.fails==0 ? "":challengeData.fails}
          solCount = {challengeData.solCount}
          />
        )): active==0 && diff!=0 ? gridChallenges
        .filter(challengeData => challengeData.difficulty === diffs[diff] )
        .map((challengeData, index) => (
          <ChallengeCard
          key={index}
          index={index}
          isCompleted={challengeData.completed}
          isUnlocked={challengeData.unlocked}
          category={challengeData.category}
          challangeGain= {challengeData.challangeGain}
          challengeName={challengeData.challengeName}
          challengePoints={challengeData.points}
          keywords={challengeData.keywords}
          unlocks={challengeData.unlocks}
          flag={challengeData.flag}
          hint={challengeData.hint}
          hintUnlocked = {challengeData.hintUnlocked}
          desc={challengeData.challengeDesc}
          fetchFail= {fetchFail}
          failCount= {challengeData.fails==0 ? "":challengeData.fails}
          solCount = {challengeData.solCount}
          />
        )):gridChallenges
        .filter(challengeData => {
          return challengeData.difficulty === diffs[diff] && challengeData.category === categories[active];
        } )
        .map((challengeData, index) => (
          <ChallengeCard
          key={index}
          index={index}
          isCompleted={challengeData.completed}
          isUnlocked={challengeData.unlocked}
          category={challengeData.category}
          challangeGain= {challengeData.challangeGain}
          challengeName={challengeData.challengeName}
          challengePoints={challengeData.points}
          keywords={challengeData.keywords}
          unlocks={challengeData.unlocks}
          flag={challengeData.flag}
          hint={challengeData.hint}
          hintUnlocked = {challengeData.hintUnlocked}
          desc={challengeData.challengeDesc}
          fetchFail= {fetchFail}
          failCount= {challengeData.fails==0 ? null:challengeData.fails}
          solCount = {challengeData.solCount}
          />
        ))}

      </div>
    </div>
    </>
  );
}

export default Challenges;