import "./ChallengeCard.css";
import ChallengeModal from "./ChallengeModal";
import React, { useEffect, useState } from "react";

function ChallengeCard(props) {
  const [randomCharacters, setRandomCharacters] = useState([]);
  const [style, setStyle] = useState({});
  const [toggle, setToggle] = useState(false);
  // Use useEffect to change the style when the component mounts
  useEffect(() => {
    // Update the style when the component mounts 
    if (props.isCompleted === false && props.isUnlocked === true) {
      setStyle({ animation: "glow 1.5s linear infinite" });
    }
    if (props.isCompleted === true && props.isUnlocked === true) {
      setStyle({ "box-shadow": "#009b00 0px 0px 70px", "border":" 1px solid #009b00" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setToggle(true);
  };

  const handleDataFromChild = (data) => {
    setToggle(data);
  };
  const fetchFail = (data) => {
    props.fetchFail()
  };

  return (
    <>
    <section className="challenge-card-body" style={style} >
      <div className="challenge-card-top" onClick={modalToggle}>
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
        description={
          props.desc
        }
        keywords={props.keywords}
        index={props.index}
        modalActive={toggle}
        hintUnlocked={props.hintUnlocked}
        hint={props.hint}
        sendDataToParent={handleDataFromChild}
        fetchFail={fetchFail}
        failCount= {props.failCount==0 ? null:props.failCount}
        solCount = {props.solCount}
      />
    </section></>
  );
}

export default ChallengeCard;
