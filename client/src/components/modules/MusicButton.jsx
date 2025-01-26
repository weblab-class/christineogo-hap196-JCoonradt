import React, { useRef, useState, useEffect } from "react";
import "./MusicButton.css";
import bigX from "../../assets/bigX.png";
import musicNote from "../../assets/musicNote.png";
import music from "../../assets/ZeldaMusic.mp3"; // Ensure this is correctly imported

const MusicButton = () => {
  const [isPlayingUI, setIsPlayingUI] = useState(true); // For UI updates
  const isPlayingRef = useRef(true); // For audio control
  const audioRef = useRef(null);

  useEffect(() => {
    // Autoplay music on component mount
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          isPlayingRef.current = true;
          setIsPlayingUI(true); // Sync UI with playback
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
          isPlayingRef.current = false;
          setIsPlayingUI(false); // Sync UI if autoplay fails
        });
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingRef.current) {
        audioRef.current.pause();
        isPlayingRef.current = false; // Update ref
      } else {
        audioRef.current.play();
        isPlayingRef.current = true; // Update ref
      }
      setIsPlayingUI(!isPlayingUI); // Trigger UI update immediately
    }
  };

  return (
    <div className="music-container">
      <button className="pixelated-button" onClick={toggleMusic}>
        <div className="image-container">
          <img src={musicNote} alt="Music Note" className="note-image" />
          {!isPlayingUI && <img src={bigX} alt="Overlay" className="note-overlay-image" />}
        </div>
      </button>
      <audio ref={audioRef} loop>
        <source src={music} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicButton;
