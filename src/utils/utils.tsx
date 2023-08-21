import { LatLngLiteral } from "leaflet";
import { API_BASE_URL, API_KEY } from "./config";
import { TimePeriod, Direction, Position } from "./enums";
import { City, Geo } from "./types";
export const quotaError = "quota exceeded";
export async function fetchCoordinates(
  city: string,
  setCoordinates: React.Dispatch<React.SetStateAction<Geo | undefined>>,
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}?q=${encodeURIComponent(city)}&key=${API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      const coordinates = data.results[0].geometry;
      const { lat, lng } = coordinates;
      setCoordinates({ lat, lng });
    } else
      await response.json().then((res) => {
        const d = new Date(res.rate.reset * 1000);
        console.log(`Quota will reset at ${d.toLocaleString()}`);
        throw new Error(res.status.message);
      });
  } catch (error) {
    const err = error as Error;
    setError(err);
    console.error("Error fetching :", error);
  }
}

export function getTimePeriod(selectedTime: string): TimePeriod {
  const selectedHour = parseInt(selectedTime.split(":")[0], 10);

  if (selectedHour >= 6 && selectedHour < 12) {
    return TimePeriod.Noon;
  } else if (selectedHour >= 12 && selectedHour < 14) {
    return TimePeriod.Midday;
  } else if (selectedHour >= 14 && selectedHour <= 20) {
    return TimePeriod.Afternoon;
  } else {
    return TimePeriod.Nighttime;
  }
}

export function getDirection(
  city1Coordinates: Geo,
  city2Coordinates: Geo
): Direction {
  const { lat: lat1, lng: lng1 } = city1Coordinates;
  const { lat: lat2, lng: lng2 } = city2Coordinates;

  let nsDirection: Direction = Direction.Unknown;

  if (lat1 && lat2) {
    if (lat1 < lat2) {
      nsDirection = Direction.North;
    } else if (lat1 > lat2) {
      nsDirection = Direction.South;
    }
  }

  let ewDirection: Direction = Direction.Unknown;

  if (lng1 && lng2) {
    if (lng1 < lng2) {
      ewDirection = Direction.East;
    } else if (lng1 > lng2) {
      ewDirection = Direction.West;
    }
  }

  // Determine the combined direction
  if (nsDirection === Direction.North && ewDirection === Direction.East) {
    return Direction.NorthEast;
  } else if (
    nsDirection === Direction.North &&
    ewDirection === Direction.West
  ) {
    return Direction.NorthWest;
  } else if (
    nsDirection === Direction.South &&
    ewDirection === Direction.East
  ) {
    return Direction.SouthEast;
  } else if (
    nsDirection === Direction.South &&
    ewDirection === Direction.West
  ) {
    return Direction.SouthWest;
  } else {
    return nsDirection !== Direction.Unknown ? nsDirection : ewDirection;
  }
}
export function getSunPosition(
  direction: Direction,
  time: TimePeriod
): Position {
  if (time === TimePeriod.Midday) {
    return Position.Above;
  }
  if (time === TimePeriod.Nighttime) {
    return Position.Unknown;
  }

  switch (direction) {
    case Direction.North:
      if (time === TimePeriod.Noon) {
        return Position.Right;
      } else if (time === TimePeriod.Afternoon) {
        return Position.Left;
      }
      break;
    case Direction.NorthWest:
      if (time === TimePeriod.Noon) {
        return Position.Right;
      } else if (time === TimePeriod.Afternoon) {
        return Position.Left;
      }
      break;
    case Direction.West:
      if (time === TimePeriod.Noon || time === TimePeriod.Afternoon) {
        return Position.Left;
      }
      break;
    case Direction.SouthWest:
      if (time === TimePeriod.Noon) {
        return Position.Left;
      } else if (time === TimePeriod.Afternoon) {
        return Position.Right;
      }
      break;
    case Direction.South:
      if (time === TimePeriod.Noon || time === TimePeriod.Afternoon) {
        return Position.Right;
      }
      break;
    case Direction.SouthEast:
      if (time === TimePeriod.Noon) {
        return Position.Left;
      } else if (time === TimePeriod.Afternoon) {
        return Position.Right;
      }
      break;
    case Direction.East:
      if (time === TimePeriod.Noon || time === TimePeriod.Afternoon) {
        return Position.Right;
      }
      break;
    case Direction.NorthEast:
      if (time === TimePeriod.Noon || time === TimePeriod.Afternoon) {
        return Position.Right;
      }
      break;
    default:
      return Position.Unknown;
  }

  return Position.Unknown; // Default case
}

export function capitalizeFirst(string: string): string {
  const lowercase = string.toLocaleLowerCase("tr");
  return string.charAt(0).toUpperCase() + lowercase.slice(1);
}

export const steps = [
  {
    element: "#select-city-1",
    intro: "Choose the starting city from this dropdown.",
  },
  {
    element: "#select-city-2",
    intro: "Choose the destination city from this dropdown.",
  },
  {
    element: "#select-time",
    intro: "Select the time of travel.",
  },
  {
    element: ".selected-cities-container",
    intro: "This is where you see the selected cities and selected time.",
  },
  {
    element: "#sunPosition",
    intro: "Here you'll find information about the sun's position.",
  },

  {
    element: ".leaflet-container",
    intro: "Here you'll find selected cities on the map.",
  },
];

export function getCitiesAndDistricts(cityData: City[]) {
  return cityData.map((city) => {
    const options: JSX.Element[] = [];
    const il = (
      <>
        {/* <option key={city.il_adi + "--"} value="" disabled>
          -------------------------
        </option> */}
        <option key={`${city.plaka_kodu} - ${city.il_adi}`} value={city.il_adi}>
          {city.plaka_kodu} - {city.il_adi}
        </option>
      </>
    );
    options.push(il);
    // city.ilceler
    //   .filter((ilce) => ilce.ilce_adi !== "MERKEZ")
    //   .map((district) =>
    //     options.push(
    //       <option
    //         key={`${city.plaka_kodu} - ${district.ilce_adi}`}
    //         value={district.ilce_adi}
    //       >
    //         {city.plaka_kodu} - {capitalizeFirst(district.ilce_adi)}
    //       </option>
    //     )
    //   );
    return options;
  });
}

export const getDistance = (coordinates1: Geo, coordinates2: Geo): number => {
  const { lat: lat1, lng: lon1 } = coordinates1;
  const { lat: lat2, lng: lon2 } = coordinates2;
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return Number(distance.toFixed(2));
};

export const getZoomLevel = (distance: number): number => {
  const minZoom = 4;
  const maxZoom = 12;
  const dist = Number(Math.log2(distance).toFixed(2));
  const zoomLevel = Math.min(maxZoom, Math.max(minZoom, Math.floor(16 - dist)));
  return zoomLevel;
};

export const getMapCenter = (
  coordinates1: Geo,
  coordinates2: Geo
): LatLngLiteral => {
  return {
    lat: (coordinates1.lat + coordinates2.lat) / 2,
    lng: (coordinates1.lng + coordinates2.lng) / 2,
  };
};
