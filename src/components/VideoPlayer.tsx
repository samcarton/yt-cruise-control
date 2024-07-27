import { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import classes from "./VideoPlayer.module.css";

const replaceSpeedHistory = (speed: number | string) => {
  if ("URLSearchParams" in window) {
    const url = new URL(window.location);
    url.searchParams.set("s", speed.toString());
    history.replaceState(null, "", url);
  }
};

const tryParseDefaultSpeed = (speedParam: string | null) => {
  if (!speedParam) {
    return 1;
  }

  const speed = parseFloat(speedParam as string);
  if (!isNaN(speed)) {
    const s = Math.max(0.5, Math.min(speed, 1));
    replaceSpeedHistory(s);
    return s;
  }

  return 1;
};

const tryGetVideoUrl = (urlInput: string | null) => {
  if (!urlInput) {
    return "";
  }

  if (urlInput.startsWith("https://www.youtube.com")) {
    return urlInput;
  }

  const fallback = new URL("https://www.youtube.com/watch");
  fallback.searchParams.set("v", urlInput);
  return fallback.href;
};

export const VideoPlayer = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = tryGetVideoUrl(urlParams.get("v"));
  const defaultSpeed = tryParseDefaultSpeed(urlParams.get("s"));
  const [speed, setSpeed] = useState(defaultSpeed);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
    replaceSpeedHistory(e.target.value);
  };

  return (
    <div className={classes.container}>
      <ReactPlayer
        url={videoUrl}
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
        onChange={handleSpeedChange}
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
