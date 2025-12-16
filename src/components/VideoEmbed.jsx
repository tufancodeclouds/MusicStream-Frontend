import { useState, useEffect, useRef } from "react";

const VideoEmbed = ({ videoId, isPlaying, onPlay }) => {
  const iframeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== "https://www.youtube.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          // 0 = ended, 1 = playing, 2 = paused, 3 = buffering
          if (data.info === 1) {
            setPlaying(true);
          } else if (data.info === 2) {
            setPlaying(false);
          }
        }
      } catch (e) {
        // Silent catch
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (isPlaying && !playing) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo" }),
          "*"
        );
        setPlaying(true);
      }
    } else if (!isPlaying && playing) {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo" }),
          "*"
        );
        setPlaying(false);
      }
    }
  }, [isPlaying, playing]);

  const handlePlay = () => {
    onPlay();
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo" }),
        "*"
      );
      setPlaying(true);
    }
  };

  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <iframe
        ref={iframeRef}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&controls=1&fs=1&showinfo=0&iv_load_policy=3`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        sandbox="allow-same-origin allow-scripts allow-presentation allow-popups"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      ></iframe>

      {!playing && (
        <div
          onClick={handlePlay}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "default",
            zIndex: 99999,
          }}
        >
          <div style={styles.customBtn} className="customBtn2">▶</div>
        </div>
      )}

      <style>
        {`
          @media (max-width: 575.99px) {
            .customBtn2 {
              font-size: 26px !important;
              width: 70px !important;
              height: 50px !important;
              border-radius: 15px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  customBtn: {
    color: 'white',
    fontSize: '32px',
    backgroundColor: '#ea9fde',
    width: '73px',
    height: '73px',
    borderRadius: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default VideoEmbed;
