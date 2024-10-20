import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Navbar from "../Navbar/Navbar";
import "./Scoreboard.css";

function Scoreboard() {
  const [scoreboard, setScoreboard] = useState([]);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://127.0.0.1:3001/get-points", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        FLAG: "TIMTAL={AG_VER!51N3_D1KK4T}",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data.message=='Invalid token'){
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          window.location = `/`
        }
        setScoreboard(data.points);
      });
  }, []);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  ChartJS.defaults.borderColor = "gray";
  ChartJS.defaults.color = "#ffffff";
  const option = {
    responsive: true,
    plugins: {
      legend: { position: "chartArea" },
    },
  };
  const colors = [
    "#335bff",
    "#7133ff",
    "#d733ff",
    "#ff33c1",
    "#ff335b",
    "#ff7133",
    "#DAF7A6",
    "#b1f7a6",
    "#a6f7c3",
    "#a6f7eb",
    "#a6daf7",
    "#a6b1f7",
    "#c3a6f7",
    "#eca6f7",
    "#f7a6d9",
    "#f7a6b1",
    "#f7c3a6",
    "#f7eba6",
    "#daf7a6",
    "#f7a6f2",
    "#f7a6c9",
    "#f7ab00",
    "#f700ff",
    "#f2f7aff",
    "#c9f7ff",
    "#0aaaff",
    "red",
    "teal",
    "green",
    "orange",
    "lightgreen",
  ];
  const data = {
    labels: ["Puanlar"],
    datasets: scoreboard.map((user, index) => {
      return {
        label: user[0],
        data: [user[1]],
        backgroundColor: colors[index],
      };
    }),
  };
  return (
    <>
    <Navbar></Navbar>
    <div className="barChartMain" style={{ padding: "0px" }}>
      <div className="barContainer">
        <div className="bar">
          <Bar options={option} data={data} />
        </div>
      </div>
    </div></>
  );
}
export default Scoreboard;
