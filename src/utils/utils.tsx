export enum TimePeriod {
  Noon = "Noon",
  Midday = "Midday",
  Afternoon = "Afternoon",
  Nighttime = "Nighttime",
}

export function determineTimePeriod(selectedTime: string): TimePeriod {
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

export enum Direction {
  West = "west",
  East = "east",
  Same = "same",
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

export enum Position {
  Right = "right",
  Left = "left",
  Above = "above",
  Unknown = "unknown",
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

export function capitalizeFirstLetter(string: string): string {
  const lowercase = string.toLocaleLowerCase("tr");
  return string.charAt(0).toUpperCase() + lowercase.slice(1);
}
