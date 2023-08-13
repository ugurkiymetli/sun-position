import { TimePeriod, Direction, Position } from "./enums";

export function getTimePeriod(selectedTime: string): TimePeriod {
  const selectedHour = parseInt(selectedTime.split(":")[0], 10);

  if (selectedHour >= 6 && selectedHour < 12) {
    return TimePeriod.Noon;
  } else if (selectedHour >= 12 && selectedHour < 13) {
    return TimePeriod.Midday;
  } else if (selectedHour >= 13 && selectedHour <= 20) {
    return TimePeriod.Afternoon;
  } else {
    return TimePeriod.Nighttime;
  }
}

export function getDirection(
  longitude1: number,
  longitude2: number
): Direction {
  if (longitude1 < longitude2) {
    return Direction.West;
  } else if (longitude1 > longitude2) {
    return Direction.East;
  } else {
    return Direction.Same;
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
  if (direction === Direction.West) {
    if (time === TimePeriod.Noon) {
      return Position.Right;
    }
    if (time === TimePeriod.Afternoon) {
      return Position.Left;
    }
  } else if (direction === Direction.East) {
    if (time === TimePeriod.Noon) {
      return Position.Left;
    }
    if (time === TimePeriod.Afternoon) {
      return Position.Right;
    }
  }
  return Position.Unknown;
}

export function capitalizeFirst(string: string): string {
  const lowercase = string.toLocaleLowerCase("tr");
  return string.charAt(0).toUpperCase() + lowercase.slice(1);
}

export const API_KEY = "0fea786133384dcd80f50c2a9297f488";

export const steps = [
  {
    element: "#city1",
    intro: "Choose the starting city from this dropdown.",
  },
  {
    element: "#city2",
    intro: "Choose the destination city from this dropdown.",
  },
  {
    element: "#time",
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
];
