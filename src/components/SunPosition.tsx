import { Position } from "../utils/enums";
interface SunPositionProps {
  sunPosition: Position | undefined;
}
export function SunPosition({ sunPosition }: SunPositionProps) {
  return (
    <div className="sun-position">
      {sunPosition && sunPosition !== Position.Unknown && (
        <h3>
          In this trip sun will be mostly on{" "}
          <strong id="sunPosition">{sunPosition}</strong>.
        </h3>
      )}
    </div>
  );
}
