// Samplerr.jsx
import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';

// Define the number of samples and default BPM
const numSamples = 12;
const defaultBPM = 90;

// One of five gets a random ord
export const ordArray = [
 {
        id: 1,
        name: 'Rare Scrilla',
        alias: 'Rare_Scrilla',
        audio: 'https://ordinals.com/content/29eee78e1de8a6c10aa85aa79e2ab47ab0481964f7856ab39425811656d4a757i0',
        image: 'https://ordinals.com/content/923e1b0253a09c01e46c0c3e7f51404970ab30544e555c3fcccddfa5d78d5ee7i0',
     },
    {
        id: 2,
        name: 'Rare Scrilla',
        alias: 'Rare_Scrilla',
        audio: 'https://ordinals.com/content/0dd65cb9dfa10d672c16e3741d73eead9085a710ff5f8796ef626799c85f944bi0',
        image: 'https://ordinals.com/content/2b0be26d10f643c5fd719f59b8094ab6c94cd7660ddf6d6fadc6e0c8c0db5918i0',
     },
    {
        id: 3,
        name: 'Rare Scrilla',
        alias: 'Rare_Scrilla',
        audio: 'https://ordinals.com/content/ee21b5240619eab16b498afbcefb673285d5e39f3a597b4a6a54a34dec274a3ai0',
        image: 'https://ordinals.com/content/3c058d094e10ccad06ffa0e97b8e147b315ee8d5c0dfe0376d61cfe520fa6fd5i0',
     },
    {
        id: 4,
        name: 'Rare Scrilla',
        alias: 'Rare_Scrilla',
        audio: 'https://ordinals.com/content/53f06b0bf1aa83d51b9d08e85fa952efd5792d79e81ee2d08003c550c3773121i0',
        image: 'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
     },
     {
        id: 5,
        name: 'GFK',
        alias: 'GFK',
        audio: 'https://ordinals.com/content/53f06b0bf1aa83d51b9d08e85fa952efd5792d79e81ee2d08003c550c3773121i0',
        image: 'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
     }
];

const Samplerr = ({ audioUrl, imageUrl, onBack }) => {
  const [player, setPlayer] = useState(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(-1);
  const [baseSampleDuration, setBaseSampleDuration] = useState(null);
  const [loopLengths, setLoopLengths] = useState(new Array(numSamples).fill(1.0));
  const [bpm, setBpm] = useState(defaultBPM);
  const [duration, setDuration] = useState(0);
  const sampleGridRef = useRef(null);

  useEffect(() => {
    if (audioUrl && imageUrl) {
      loadSoundAndImage(audioUrl, imageUrl);
    }
    // Cleanup on unmount
    return () => {
      if (player) {
        player.stop();
      }
    };
  }, [audioUrl, imageUrl]);

  const loadSoundAndImage = (audioUrl, imageUrl) => {
    const newPlayer = new Tone.Player({
      url: audioUrl,
      loop: false,
    }).toDestination();

    setPlayer(newPlayer);

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      fillGridWithImage(img);
      Tone.loaded().then(() => {
        const duration = newPlayer.buffer.duration;
        setBaseSampleDuration(duration / numSamples);
        setDuration(duration / numSamples);
      });
    };
  };

  const fillGridWithImage = (img) => {
    const numCols = 3;
    const numRows = 4;
    const canvasWidth = 100;
    const canvasHeight = 100;
    const imageAspectRatio = img.width / img.height;
    const gridAspectRatio = (numCols * canvasWidth) / (numRows * canvasHeight);
    let sx, sy, sWidth, sHeight;

    if (imageAspectRatio > gridAspectRatio) {
      sHeight = img.height;
      sWidth = img.height * gridAspectRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = img.width / gridAspectRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    // Clear existing content
    if (sampleGridRef.current) {
      sampleGridRef.current.innerHTML = '';
    }

    for (let i = 0; i < numCols * numRows; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.id = `pad-${i}`;
      canvas.className = 'pad';
      const ctx = canvas.getContext('2d');

      const col = i % numCols;
      const row = Math.floor(i / numCols);

      ctx.drawImage(
        img,
        sx + (col * sWidth) / numCols,
        sy + (row * sHeight) / numRows,
        sWidth / numCols,
        sHeight / numRows,
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      canvas.addEventListener('click', () => selectSample(i));
      sampleGridRef.current?.appendChild(canvas);
    }
  };

  const selectSample = (index) => {
    if (selectedSampleIndex !== -1) {
      const prevPad = document.getElementById(`pad-${selectedSampleIndex}`);
      prevPad?.classList.remove('selected');
    }

    setSelectedSampleIndex(index);
    const currentPad = document.getElementById(`pad-${index}`);
    currentPad?.classList.add('selected');

    if (player) {
      player.loop = false;
    }
  };

  const playSample = () => {
    if (!player || selectedSampleIndex === -1) return;

    const sampleDuration = duration;
    const startTime = selectedSampleIndex * baseSampleDuration;
    if (!player.loop) {
      player.stop();
    }

    player.loopStart = startTime;
    player.loopEnd = startTime + sampleDuration;
    player.playbackRate = bpm / defaultBPM;
    player.start(Tone.now(), startTime, sampleDuration);
  };

  const stopSample = () => {
    if (player) {
      player.stop();
    }
  };

  const adjustLoopLength = (index, value) => {
    const newLoopLengths = [...loopLengths];
    newLoopLengths[index] = parseFloat(value);
    setLoopLengths(newLoopLengths);
  };

  return (
    <div className="samplerr-container justify-items-center shadow-lg shadow-black rounded-lg  hover:shadow-md hover:shadow-yellow-600 transition-all duration-300  ">
      <button onClick={onBack}>Back</button>
      <div ref={sampleGridRef} className="sample-grid grid"></div>
      <div className="controls">
        <button onClick={playSample}>Play</button>
        <button onClick={stopSample}>Stop</button>
        <div>
          <label>BPM: {bpm}</label>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
          />
        </div>
        
        <div>
          <label>Duration: {duration}s</label>
          <input
            type="range"
            min="0.1"
            max={baseSampleDuration}
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Samplerr;
