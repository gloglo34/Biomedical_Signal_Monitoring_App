import { useLocation } from "react-router-dom";
import HrCard from "../components/cards/HrCard";
import BrCard from "../components/cards/BrCard";
import Spo2Card from "../components/cards/Spo2Card";
import "../components/cards/Card.css";
import StepsCard from "../components/cards/StepsCard";
import SleepCard from "../components/cards/SleepCard";
import SkinTempCard from "../components/cards/SkinTempCard";
import HrvCard from "../components/cards/HrvCard";

export default function Dashboard2() {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="grid-container">
      <HrCard />
      <BrCard />
      <HrvCard />
      <Spo2Card />
      <SleepCard />
      <SkinTempCard />
      <StepsCard />
    </div>
  );
}
