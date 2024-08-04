import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import classes from "./VideoPlayer.module.css";
import { PauseIcon } from "./PauseIcon";
import { PlayIcon } from "./PlayIcon";

// todo - loop params in URL
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
  const playerRef = useRef<ReactPlayer | null>(null);
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = tryGetVideoUrl(urlParams.get("v"));

  const [duration, setDuration] = useState(99999);
  const handleDuration = (duration: number) => {
    setDuration(duration);
    setLoopTo(duration);
  };

  // #region Speed
  const defaultSpeed = tryParseDefaultSpeed(urlParams.get("s"));
  const [speed, setSpeed] = useState(defaultSpeed);
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
    replaceSpeedHistory(e.target.value);
  };

  // #endregion

  // #region loop
  const [isLooping, setIsLooping] = useState(false);
  const [loopFrom, setLoopFrom] = useState<number | null>(null);
  const [loopTo, setLoopTo] = useState<number | null>(null);
  const minLoopSeconds = 2;
  const hasValidLoopingValues = loopFrom !== null && loopTo !== null;

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!isLooping || loopFrom === null || loopTo === null) {
      return;
    }

    if (state.playedSeconds > loopTo) {
      playerRef.current?.seekTo(loopFrom);
      // playing=true needs to be set on the player otherwise it pauses after seeking
    }
  };

  const handleSetLoopLast = (xSeconds: number) => {
    const to = Math.max(
      playerRef.current?.getCurrentTime() || 0,
      minLoopSeconds,
    );
    setLoopTo(to);
    setLoopFrom(Math.max(to - xSeconds, 0));
    setIsLooping(true);
  };

  const handleSetLoopNext = (xSeconds: number) => {
    const from = playerRef.current?.getCurrentTime() || 0;
    setLoopFrom(from);
    setLoopTo(from + xSeconds);
    setIsLooping(true);
  };

  // tap-twice - start here, end here
  const handleSetStartLoopHere = () => {
    setLoopFrom(playerRef.current?.getCurrentTime() || 0);
  };

  const handleSetEndLoopHere = () => {
    setLoopTo(
      Math.max(playerRef.current?.getCurrentTime() || 0, minLoopSeconds),
    );
    if (loopFrom !== null) {
      setIsLooping(true);
    }
  };

  const handleClearLoop = () => {
    setLoopFrom(null);
    setLoopTo(null);
    setIsLooping(false);
  };

  const handleBumpLoopStart = (xSeconds: number) => {
    if (loopFrom === null) {
      return;
    }

    const loopFromBumped = Math.max(0, loopFrom + xSeconds);
    setLoopFrom(loopFromBumped);

    playerRef.current?.seekTo(loopFromBumped);
  };

  const handleBumpLoopEnd = (xSeconds: number) => {
    if (loopTo === null) {
      return;
    }

    const loopToBumped = Math.max(loopFrom || 0, loopTo + xSeconds);
    setLoopTo(loopToBumped);
  };

  // #endregion

  // #region Playback
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    setIsPlaying((x) => !x);
  };

  // #endregion

  return (
    <div className={classes.container}>
      <div className={classes.responsiveWrapper}>
        <ReactPlayer
          playing={isPlaying}
          ref={playerRef}
          url={videoUrl}
          width={"100%"}
          height={"100%"}
          controls
          playbackRate={speed}
          className={classes.player}
          onProgress={handleProgress}
          progressInterval={100}
          onDuration={handleDuration}
        />
      </div>
      <div className={classes.playbackGroup}>
        <button onClick={handleTogglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <h3>Speed</h3>
      <input
        type="range"
        min="0.5"
        max="1"
        step="0.05"
        list="markers"
        className={classes.rangeInput}
        onChange={handleSpeedChange}
        value={speed}
        aria-label="Playback speed"
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
      <h3>Looping</h3>
      <div className={classes.loopDisplay}>
        <div>Loop: {isLooping ? "Enabled" : "Disabled"}</div>
        {hasValidLoopingValues && (
          <div>
            from: {loopFrom.toFixed(2)}s to {loopTo.toFixed(2)}s
          </div>
        )}
      </div>
      <div className={classes.loopGroup}>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopLast(20)}
        >
          Last 20s
        </button>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopLast(10)}
        >
          Last 10s
        </button>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopLast(5)}
        >
          Last 5s
        </button>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopNext(5)}
        >
          Next 5s
        </button>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopNext(10)}
        >
          Next 10s
        </button>
        <button
          className={classes.roundedButton}
          onClick={() => handleSetLoopNext(20)}
        >
          Next 20s
        </button>
      </div>
      <div className={classes.loopGroup}>
        <button
          className={classes.roundedButton}
          onClick={handleSetStartLoopHere}
        >
          Start here
        </button>
        <button
          className={classes.roundedButton}
          onClick={handleSetEndLoopHere}
        >
          End here
        </button>
      </div>
      <div className={classes.loopGroup}>
        <button
          className={classes.roundedButton}
          onClick={() => setIsLooping((x) => !x)}
        >
          {isLooping ? "Disable" : "Enable"} loop
        </button>
        <button className={classes.roundedButton} onClick={handleClearLoop}>
          Clear loop
        </button>
      </div>
      <div>👉 Nudge</div>
      <div className={classes.loopGroup}>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopStart(-5)}
        >
          5s
        </button>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopStart(-2)}
        >
          2s
        </button>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopStart(-1)}
        >
          1s
        </button>
        start
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopStart(1)}
        >
          1s
        </button>
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopStart(2)}
        >
          2s
        </button>
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopStart(5)}
        >
          5s
        </button>
      </div>
      <div className={classes.loopGroup}>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopEnd(-5)}
        >
          5s
        </button>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopEnd(-2)}
        >
          2s
        </button>
        <button
          className={classes.buttonLeft}
          onClick={() => handleBumpLoopEnd(-1)}
        >
          1s
        </button>
        end
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopEnd(1)}
        >
          1s
        </button>
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopEnd(2)}
        >
          2s
        </button>
        <button
          className={classes.buttonRight}
          onClick={() => handleBumpLoopEnd(5)}
        >
          5s
        </button>
      </div>
    </div>
  );
};
