import { useEffect, useState } from "react";
import "./App.css";
import { City } from "./assets/cities-types";
import { Time } from "./assets/time-type";
import {
  determineTimePeriod,
  getDirection,
  getSunPosition,
  Position,
} from "./utils/utils";
const cityData: City[] = require("./assets/cities.json").data;
const timeData: Time[] = require("./assets/hours.json");

const API_KEY = "0fea786133384dcd80f50c2a9297f488";

interface Geo {
  lat: number | undefined;
  lng: number | undefined;
}

function App() {
  const [city1, setCity1] = useState(cityData[0].il_adi);
  const [city2, setCity2] = useState(cityData[1].il_adi);
  const [time, setTime] = useState(timeData[0].time);
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
      const timePeriod = determineTimePeriod(time);
      const dir = getDirection(lng1, lng2);
      const pos = getSunPosition(dir, timePeriod);
      console.log({ timePeriod, dir, pos });
      setSunPosition(pos);
    }
  }, [coordinates1, coordinates2, time]);

  function getCitiesAndDistricts() {
    return cityData.map((city) => {
      const options: JSX.Element[] = [];
      const il = (
        <option key={city.alan_kodu} value={city.il_adi}>
          {city.il_adi}
        </option>
      );
      options.push(il);
      city.ilceler
        .filter((ilce) => ilce.ilce_adi !== "MERKEZ")
        .map((district) =>
          options.push(
            <option key={district.ilce_kodu} value={district.ilce_adi}>
              {district.ilce_adi}
            </option>
          )
        );
      return options;
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Calculate Sun Position 🌞</h2>
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
          <label htmlFor="City 1">Choose city 1</label> <br />
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
          <label htmlFor="City 1">Choose city 2</label> <br />
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
            <label htmlFor="time">Choose time </label> <br />
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
