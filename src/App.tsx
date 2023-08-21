import "./App.css";
import { useEffect, useState } from "react";
import { Geo } from "./utils/types";
import { Steps } from "intro.js-react";
import { Position } from "./utils/enums";
import {
  getTimePeriod,
  getDirection,
  getSunPosition,
  steps,
  fetchCoordinates,
  quotaError,
} from "./utils/utils";

import { CitySelect } from "./components/CitySelect";
import Map from "./components/Map";
import Footer from "./components/Footer";
import { QuotaError } from "./components/QuotaError";
import CityCard from "./components/CityCard";
import { SunPosition } from "./components/SunPosition";

function App() {
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [city1, setCity1] = useState("İstanbul");
  const [city2, setCity2] = useState("Ankara");
  const [coordinates1, setCoordinates1] = useState<Geo>();
  const [coordinates2, setCoordinates2] = useState<Geo>();
  const [time, setTime] = useState("08:00");
  const [sunPosition, setSunPosition] = useState<Position>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchCoordinates(city1, setCoordinates1, setError);
  }, [city1]);

  useEffect(() => {
    fetchCoordinates(city2, setCoordinates2, setError);
  }, [city2]);

  useEffect(() => {
    if (coordinates1 && coordinates2 && time) {
      const t = getTimePeriod(time);
      const dir = getDirection(coordinates1, coordinates2);
      const pos = getSunPosition(dir, t);
      setSunPosition(pos);
      console.log(city1, " - ", city2, { t, dir, pos });
    }
  }, [city1, city2, coordinates1, coordinates2, time]);

  const disabled = error?.message !== undefined;

  return (
    <div className="app">
      <h2>
        Calculate Sun Position 🌞 <br />
      </h2>
      <CityCard city1={city1} city2={city2} time={time} />

      <SunPosition sunPosition={sunPosition} />

      {error?.message === quotaError && <QuotaError />}

      {error && <div className="error">Oops! Something went wrong.</div>}

      <CitySelect
        error={error}
        city1={city1}
        setCity1={setCity1}
        city2={city2}
        setCity2={setCity2}
        time={time}
        setTime={setTime}
      />

      {coordinates1 && coordinates2 && (
        <Map
          coordinates1={coordinates1}
          coordinates2={coordinates2}
          city1={city1}
          city2={city2}
        />
      )}

      <br />
      <br />
      <br />
      <Footer setIsIntroOpen={setIsIntroOpen} disabled={disabled} />
      <Steps
        enabled={isIntroOpen}
        steps={steps}
        initialStep={0}
        onExit={() => setIsIntroOpen(false)}
        options={{
          showStepNumbers: true,
          exitOnEsc: true,
          showProgress: true,
          showBullets: false,
        }}
      />
    </div>
  );
}

export default App;
