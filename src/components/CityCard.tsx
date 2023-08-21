import * as React from "react";
import { capitalizeFirst } from "../utils/utils";

export interface CityCardProps {
  city1: string;
  city2: string;
  time: string;
}

export default function CityCard({ city1, city2, time }: CityCardProps) {
  return (
    <div className="selected-cities-container">
      <strong>{capitalizeFirst(city1)}</strong>
      <span> ⬇ </span>
      <strong>{capitalizeFirst(city2)}</strong>
      {time && (
        <>
          <br />
          <strong>
            <span className="time-emoji">🕐 </span> {time}
          </strong>
        </>
      )}
    </div>
  );
}
