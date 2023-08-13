import "./App.css";
import { useEffect, useState } from "react";
import { City, Time, Geo } from "./utils/types";
import {
  API_KEY,
  capitalizeFirst,
  getTimePeriod,
  getDirection,
  getSunPosition,
  Position,
} from "./utils/utils";

const cityData: City[] = require("./assets/cities.json").data;
const timeData: Time[] = require("./assets/hours.json");

function App() {
  const [city1, setCity1] = useState(cityData[0].il_adi);
  const [city2, setCity2] = useState(cityData[1].il_adi);
  const [time, setTime] = useState(timeData[16].time);
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

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Calculate Sun Position 🌞 <br />
          <span>
            made by{" "}
            <a
              href="http://www.github.com/ugurkiymetli"
              target="_blank"
              className="App-link"
              rel="noreferrer"
            >
              uğur
            </a>
            .
          </span>
        </h2>
        <div className="selected-cities-container">
          <strong>{city1}</strong>
          <span> ⬇ </span>
          <strong>{city2}</strong>
          {time && (
            <>
              <br />
              <strong>
                <span>🕐 : </span>
                {time}
              </strong>
            </>
          )}
        </div>
        <div className="sunPosition">
          {sunPosition && sunPosition !== Position.Unknown && (
            <div className="direction">
              <h3>
                In this trip sun will be mostly on{" "}
                <strong>{sunPosition}</strong>.
              </h3>
            </div>
          )}
        </div>
        <div className="select-div">
          <label htmlFor="City 1">
            choose <strong>from</strong> city:{" "}
          </label>{" "}
          <br />
          <select
            name="City 1"
            id="City 1"
            onChange={(e) => setCity1(e.target.value)}
            value={city1}
          >
            {getCitiesAndDistricts()}
          </select>
        </div>
        <div className="select-div">
          <label htmlFor="City 1">
            choose <strong>to</strong> city:{" "}
          </label>{" "}
          <br />
          <select
            name="City 2"
            id="City 2"
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
      </header>
    </div>
  );
}

export default App;
