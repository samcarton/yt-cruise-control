import { useState } from "react";
import ReactPlayer from "react-player";
import classes from "./VideoPlayer.module.css";

const replaceSpeedHistory = (speed: number | string) => {
  if ("URLSearchParams" in window) {
    const url = new URL(window.location as unknown as string);
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

  if (
    urlInput.startsWith("https://youtu.be") ||
    urlInput.startsWith("https://music.youtube.com")
  ) {
    // regex to extract the video ID from: https://youtu.be/sjgtpKxhZa4?si=lhbg5O4yeHiABClV
    const videoId = urlInput.match(
      /(?:\?v=|&v=|youtu\.be\/)(.*?)(?:\?|$)/,
    )?.[1];
    if (videoId) {
      urlInput = videoId;
    }
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
      <div className={classes.responsiveWrapper}>
        <ReactPlayer
          url={videoUrl}
          width={"100%"}
          height={"100%"}
          controls
          playbackRate={speed}
          className={classes.player}
        />
      </div>
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
      <div className={classes.rangeLabels}>
        <div>50%</div>
        <div></div>
        <div>60%</div>
        <div></div>
        <div>70%</div>
        <div></div>
        <div>80%</div>
        <div></div>
        <div>90%</div>
        <div></div>
        <div>100%</div>
      </div>
    </div>
  );
};
