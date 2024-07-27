import { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import classes from "./VideoPlayer.module.css";

export const VideoPlayer = () => {
  const handleClick = () => {};
  const [speed, setSpeed] = useState(1);

  return (
    <div className={classes.container}>
      <ReactPlayer
        url="https://www.youtube.com/watch?v=O2IuJPh6h_A"
        width={"100%"}
        controls
        playbackRate={speed}
      />
      <input
        type="range"
        min="0.5"
        max="1"
        step="0.05"
        list="markers"
        className={classes.rangeInput}
        onChange={(e) => setSpeed(parseFloat(e.target.value))}
        value={speed}
      />
      <datalist id="markers" className={classes.rangeLabels}>
        <option value="0.5" label="50%"></option>
        <option value="0.60" label="60%"></option>
        <option value="0.70" label="70%"></option>
        <option value="0.80" label="80%"></option>
        <option value="0.90" label="90%"></option>
        <option value="1" label="100%"></option>
      </datalist>
    </div>
  );
};
