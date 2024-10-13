import "./ChallengeModal.css";
import { useState } from "react";
import { BadgeInfo,FileX,BookCheck } from "lucide-react";

function ChallengeModal(props) {
  const [style, setStyle] = useState({});
  const [gain, setGain] = useState({ opacity: "0" });
  const [fail, setFail] = useState({ opacity: "0" });
  const [sol, setSol] = useState({ opacity: "0" });
  const [flagControl, setFlagControl] = useState("");
  const [flagAnswer, setFlagAnswer] = useState("");
  const modalClass = props.modalActive
    ? "challengeModalMain active"
    : "challengeModalMain";
  const modalBody = props.modalActive ? "modalCard active" : "modalCard";
  const closeModal = () => {
    props.sendDataToParent(false);
    setTimeout(() => {
      setStyle({ animation: " fadeOut .5s linear" });
    }, 500);
    setTimeout(() => {
      setStyle({});
    }, 500);
    setFlagAnswer("");
  };
  const flagSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const userData = {
      challengeIndex: Number(props.index),
      flag: flagControl,
    };
    fetch("http://127.0.0.1:3001/flag-control", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Doğru Cevap") {
          setFlagAnswer("Doğru Cevap! Yönlendiriliyor.");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setFlagAnswer("Yanlış Cevap!");
          props.fetchFail();
        }
      });
  };
  const handleChange = (e) => {
    console.log(props.index);
    setFlagControl(e.target.value);
  };
  const handleHoverIn = () => {
    setGain({});
  };
  const handleHoverOut = () => {
    setGain({ opacity: "0" });
  };
  const handleHoverFailIn = () => {
    setFail({});
  };
  const handleHoverFailOut = () => {
    setFail({ opacity: "0" });
  };
  const handleHoverSolIn = () => {
    setSol({});
  };
  const handleHoverSolOut = () => {
    setSol({ opacity: "0" });
  };
  const buyHint = () => {
    const token = sessionStorage.getItem("token");
    const userData = {
      challengeIndex: Number(props.index),
    };
    fetch("http://127.0.0.1:3001/buy-hint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          props.fetchFail()
          setFlagAnswer("Satın Alım Başarılı!");
        } else {
          setFlagAnswer(data.reason);
        }
      });
  }
  return (
    <div>
      <div onClick={closeModal} className={modalClass} style={style}></div>
      <div style={style} className={modalBody}>
        <section className="modal-header">
          <div className="gainContainer">
            <div className="gaintooltip" style={gain}>
              <p className="tooltiptext">Kazanım: {props.challangeGain}</p>
            </div>
            <BadgeInfo
              onMouseOver={handleHoverIn}
              onMouseOut={handleHoverOut}
              color="grey"
              size={20}
              className="gain"
            ></BadgeInfo>
          </div>
          <div className="failContainer">
            <div className="failtooltip" style={sol}>
              <p className="tooltiptext">{`Çözüm Sayısı: ${props.solCount}`}</p>
            </div>
            <BookCheck
              onMouseOver={handleHoverSolIn}
              onMouseOut={handleHoverSolOut}
              color="grey"
              size={20}
              className="gain"
            ></BookCheck>
          </div>
           {props.failCount!=null?<div className="solContainer">
            <div className="soltooltip" style={fail}>
              <p className="tooltiptext">{`Yanlış Sayısı: ${props.failCount}`}</p>
            </div>
            <FileX
              onMouseOver={handleHoverFailIn}
              onMouseOut={handleHoverFailOut}
              color="grey"
              size={20}
              className="gain"
            ></FileX>
          </div>:<></>}
          

            <div className="hintContainer">
              {props.hintUnlocked ? 
                <p className="hint">İpucu: {props.hint}</p>
               : 
                <button className="hint-buy" onClick={buyHint}>
                  İpucu: {props.points / 10} puan
                </button>
              }
            </div>
          

          <p className="modalChallengeName">{props.challengeName}</p>
          <p className="modalChallengePoints">{props.points}</p>
        </section>
        <section className="modal-body">
          <p className="modalDesc">{props.description}</p>
          {props.keywords && (
            <p className="keywords">Anahtar kelimeler: {props.keywords}</p>
          )}
        </section>
        <section className="modal-flag">
          <form onSubmit={flagSubmit} className="button-group">
            <input
              onChange={handleChange}
              className="flagInput"
              type="text"
              placeholder="TIMTAL={...}"
            ></input>
            <button className="flagSubmit">Kontrol</button>
          </form>
          <p className="wrongAnswer">{flagAnswer}</p>
        </section>
      </div>
    </div>
  );
}

export default ChallengeModal;
