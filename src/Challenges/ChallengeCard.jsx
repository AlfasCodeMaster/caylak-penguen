import React, { useEffect, useRef, useState } from "react";
import "./ChallengeCard.css";
import ChallengeModal from "./ChallengeModal";

function ChallengeCard(props) {
  const mainRef = useRef()
  const [randomCharacters, setRandomCharacters] = useState([]);
  const [toggle, setToggle] = useState(false);
  // Use useEffect to change the style when the component mounts

  const generateRandomCharacters = () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10; // Change this value to the desired length of your character array
    let result = [];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result.push(characters.charAt(randomIndex));
    }

    setRandomCharacters(result);
  };

  useEffect(() => {
    // Generate random characters initially
    if( props.isUnlocked==false){
      mainRef.current.classList.add('challenge-card-body-disabled');
    }
    generateRandomCharacters();

    // Set an interval to generate random characters every 2 seconds (you can adjust the interval)
    setTimeout(() => {
      generateRandomCharacters()
    }, 100);
    setTimeout(() => {
      generateRandomCharacters()
    }, 200);
    setTimeout(() => {
      generateRandomCharacters()
    }, 300);
    setTimeout(() => {
      generateRandomCharacters()
    }, 400);
    setTimeout(() => {
      generateRandomCharacters()
    }, 450);
    

  }, []);

  const modalToggle = () => {
    if(props.isUnlocked){
      setToggle(true);
    }
  };

  const handleDataFromChild = (data) => {
    setToggle(data);
  };
  const fetchFail = (data) => {
    props.fetchFail()
  };

  return (
    <>
    <section className="challenge-card-body" ref={mainRef} >
      <div className="challenge-card-top" onClick={modalToggle} >
      <p className="challenge-category">
          {props.isUnlocked ? props.category : randomCharacters}
        </p>
        <p className="challenge-name">
          {props.isUnlocked ? props.challengeName : randomCharacters}
        </p>
        <p className="point">
          {props.isUnlocked
            ? props.challengePoints + " Puan"
            : randomCharacters}
        </p>
      </div>

      <ChallengeModal
        challengeName={props.challengeName}
        challangeGain={props.challangeGain}
        points={props.challengePoints}
        flag={props.flag}
        description={props.desc}
        keywords={props.keywords}
        index={props.index}
        modalActive={toggle}
        hintUnlocked={props.hintUnlocked}
        hint={props.hint}
        sendDataToParent={handleDataFromChild}
        fetchFail={fetchFail}
        failCount= {props.failCount==0 ? 0:props.failCount}
        solCount = {props.solCount}
      />
    </section></>
  );
};

export default ChallengeCard;
