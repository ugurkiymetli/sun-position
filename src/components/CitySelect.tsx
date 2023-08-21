import React from "react";
import { City, Time } from "../utils/types";
import { getCitiesAndDistricts } from "../utils/utils";

type Props = {
  error: Error | undefined;
  city1: string;
  city2: string;
  setCity1: React.Dispatch<React.SetStateAction<string>>;
  setCity2: React.Dispatch<React.SetStateAction<string>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
};
const cityData: City[] = require("../assets/cities.json").data;
const timeData: Time[] = require("../assets/hours.json");

const selectCity1 = "select-city-1";
const selectCity2 = "select-city-2";
const selectTime = "select-time";

export const CitySelect = ({
  error,
  city1,
  city2,
  setCity1,
  setCity2,
  time,
  setTime,
}: Props) => {
  const handleCity1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCity1(event.target.value);
    document.getElementById(selectCity2)?.focus();
  };

  const handleCity2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCity2(event.target.value);
    document.getElementById(selectTime)?.focus();
  };
  const disabled = error?.message !== undefined;

  return (
    <>
      <div className="select-div">
        <label className={disabled ? "disabled" : ""} htmlFor={selectCity1}>
          choose <strong>from</strong> city:
        </label>{" "}
        <br />
        <select
          disabled={disabled}
          name={selectCity1}
          id={selectCity1}
          onChange={handleCity1Change}
          value={city1}
        >
          {getCitiesAndDistricts(cityData)}
        </select>
      </div>
      <div className="select-div">
        <label className={disabled ? "disabled" : ""} htmlFor={selectCity2}>
          choose <strong>to</strong> city:
        </label>
        <br />
        <select
          disabled={disabled}
          name={selectCity2}
          id={selectCity2}
          onChange={handleCity2Change}
          value={city2}
        >
          {getCitiesAndDistricts(cityData)}
        </select>
      </div>
      {city1 && city2 && (
        <div className="select-div">
          <label className={disabled ? "disabled" : ""} htmlFor={selectTime}>
            choose <strong>time</strong>{" "}
          </label>{" "}
          <br />
          <select
            disabled={disabled}
            name={selectTime}
            id={selectTime}
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
    </>
  );
};
