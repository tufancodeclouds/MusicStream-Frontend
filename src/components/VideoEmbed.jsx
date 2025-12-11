// VideoEmbed.jsx
import React, { useRef, useState } from "react";

const VideoEmbed = ({ videoId }) => {
  const iframeRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
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
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0&controls=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
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
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <div style={{ color: "white", fontSize: "32px" }}>▶</div>
        </div>
      )}
    </div>
  );
};

export default VideoEmbed;
