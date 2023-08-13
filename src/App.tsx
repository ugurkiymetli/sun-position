import "./App.css";
import { useEffect, useState } from "react";
import { City, Time, Geo } from "./utils/types";
import { Steps } from "intro.js-react";
import { Position } from "./utils/enums";
import {
  API_KEY,
  capitalizeFirst,
  getTimePeriod,
  getDirection,
  getSunPosition,
  steps,
} from "./utils/utils";

const cityData: City[] = require("./assets/cities.json").data;
const timeData: Time[] = require("./assets/hours.json");
const istanbul = cityData.filter((city) => city.plaka_kodu === "34")[0];
const ankara = cityData.filter((city) => city.plaka_kodu === "06")[0];
const defaultTime = timeData.filter(({ time }) => time === "08:00")[0];

function App() {
  const [city1, setCity1] = useState(istanbul.il_adi);
  const [city2, setCity2] = useState(ankara.il_adi);
  const [time, setTime] = useState(defaultTime.time);
  const [coordinates1, setCoordinates1] = useState<Geo>();
  const [coordinates2, setCoordinates2] = useState<Geo>();
  const [sunPosition, setSunPosition] = useState<Position>();

  useEffect(() => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city1
      )}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const coordinates = data.results[0].geometry;
        const { lat, lng } = coordinates;
        setCoordinates1({ lat, lng });
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  }, [city1]);

  useEffect(() => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city2
      )}&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const coordinates = data.results[0].geometry;
        const { lat, lng } = coordinates;
        setCoordinates2({ lat, lng });
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
      });
  }, [city2]);

  useEffect(() => {
    if (coordinates1?.lng && coordinates2?.lng && time) {
      const { lng: lng1 } = coordinates1;
      const { lng: lng2 } = coordinates2;
      const t = getTimePeriod(time);
      const dir = getDirection(lng1, lng2);
      const pos = getSunPosition(dir, t);

      setSunPosition(pos);

      console.log({ timePeriod: t, dir, pos });
    }
  }, [coordinates1, coordinates2, time]);

  const [isIntroOpen, setIsIntroOpen] = useState(false);

  return (
    <div className="app">
      <h2>
        Calculate Sun Position 🌞 <br />
      </h2>
      <div className="selected-cities-container">
        <strong>{capitalizeFirst(city1)}</strong>
        <span> ⬇ </span>
        <strong>{capitalizeFirst(city2)}</strong>
        {time && (
          <>
            <br />
            <strong>
              <span className="timeEmoji">🕐 </span> {time}
            </strong>
          </>
        )}
      </div>
      <div className="sunPosition">
        {sunPosition && sunPosition !== Position.Unknown && (
          <h3>
            In this trip sun will be mostly on{" "}
            <strong id="sunPosition">{sunPosition}</strong>.
          </h3>
          )}
      </div>
      <div className="select-div">
        <label htmlFor="city-1">
          choose <strong>from</strong> city:
        </label>{" "}
        <br />
        <select
          name="city-1"
          id="city1"
          onChange={(e) => setCity1(e.target.value)}
          value={city1}
        >
          {getCitiesAndDistricts()}
        </select>
      </div>
      <div className="select-div">
        <label htmlFor="city-2">
          choose <strong>to</strong> city:
        </label>
        <br />
        <select
          name="city-2"
          id="city2"
          onChange={(e) => setCity2(e.target.value)}
          value={city2}
        >
          {getCitiesAndDistricts()}
        </select>
      </div>
      {city1 && city2 && (
        <div className="select-div">
          <label htmlFor="time">
            choose <strong>time</strong>{" "}
          </label>{" "}
          <br />
          <select
            name="Time"
            id="time"
            onChange={(e) => setTime(e.target.value)}
            value={time}
          >
            {timeData.map(({ time }) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}
      <footer>
        <button
          title="Click to view intro tour!"
          className="infoButton"
          onClick={() => setIsIntroOpen(true)}
        >
          <i className="icon-info-sign" /> intro tour
        </button>
        <button>
          <a
            href="https://github.com/ugurkiymetli/sun-position"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon-github-sign" /> repo
          </a>
        </button>
        <button>
          <a
            href="https://linkedin.com/in/ugurkiymetli"
            target="_blank"
            rel="noreferrer"
          >
            <i className="icon-linkedin-sign" /> uğur
          </a>
        </button>
      </footer>
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

  function getCitiesAndDistricts() {
    return cityData.map((city) => {
      const options: JSX.Element[] = [];
      const il = (
        <>
          <option key={city.il_adi + "--"} value="" disabled>
            -------------------------
          </option>
          <option
            key={`${city.plaka_kodu} - ${city.il_adi}`}
            value={city.il_adi}
          >
            {city.il_adi}
          </option>
        </>
      );
      options.push(il);
      city.ilceler
        .filter((ilce) => ilce.ilce_adi !== "MERKEZ")
        .map((district) =>
          options.push(
            <option
              key={`${city.plaka_kodu} - ${district.ilce_adi}`}
              value={district.ilce_adi}
            >
              {city.plaka_kodu} - {capitalizeFirst(district.ilce_adi)}
            </option>
          )
        );
      return options;
    });
  }
}

export default App;
