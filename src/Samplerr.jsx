// Samplerr.jsx
import React, { useState, useEffect, useRef } from 'react';
 import styled from 'styled-components';

const numSamples = 12;
const defaultBPM = 91.5;
export const ordArray = [
  {
    id: 1,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/29eee78e1de8a6c10aa85aa79e2ab47ab0481964f7856ab39425811656d4a757i0',
    image:
      'https://ordinals.com/content/923e1b0253a09c01e46c0c3e7f51404970ab30544e555c3fcccddfa5d78d5ee7i0',
  },
  {
    id: 2,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/0dd65cb9dfa10d672c16e3741d73eead9085a710ff5f8796ef626799c85f944bi0',
    image:
      'https://ordinals.com/content/2b0be26d10f643c5fd719f59b8094ab6c94cd7660ddf6d6fadc6e0c8c0db5918i0',
  },
  {
    id: 3,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/ee21b5240619eab16b498afbcefb673285d5e39f3a597b4a6a54a34dec274a3ai0',
    image:
      'https://ordinals.com/content/3c058d094e10ccad06ffa0e97b8e147b315ee8d5c0dfe0376d61cfe520fa6fd5i0',
  },
  {
    id: 4,
    name: 'Rare Scrilla',
    alias: 'Rare_Scrilla',
    audio:
      'https://ordinals.com/content/53f06b0bf1aa83d51b9d08e85fa952efd5792d79e81ee2d08003c550c3773121i0',
    image:
      'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
  },
  {
    id: 5,
    name: 'Rare Scrilla',
    alias: 'Rare Scrilla',
    audio:
      'https://ordinals.com/content/0dd65cb9dfa10d672c16e3741d73eead9085a710ff5f8796ef626799c85f944bi0',
    image:
      'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
  },
  {
    id: 6,
    name: 'GFK',
    alias: 'GFK',
    audio:
      'https://ordinals.com/content/069f79685c04af6357058eeeb65c4835ed13d00b5bf5a69c4cff5e513d9b0fffi0',
    image:
      'https://ordinals.com/content/99d1ce468eccac8a43eb07fc99f83d920bbd4846255d477fc9746b28f877ee4ci0',
  },
];

const SamplerrContainer = styled.div`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  position: relative;
`;

const SampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 125px);
  grid-gap: 4px;
  justify-content: center;
`;

const Pad = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border: ${(props) => (props.selected ? '2px solid yellow' : '2px solid #444')};
  cursor: pointer;
`;

const SliderContainer = styled.div`
  margin-top: 4px;
`;

const StyledSlider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  border-radius: 5px;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 25px;
    height: 25px;
    background: #444;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #444;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #fff;
  }
`;

const BackButton = styled.img`
  padding: 10px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1;
  width: 5vw;
  height: auto;
  transform: ${(props) => (props.isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  transition: transform 0.6s;

  &:hover {
    transform: scale(1.1);
  }
`;

const CustomSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  midiControl,
  midiAvailable,
  listenForControl,
  thumbImage,
}) => (
  <SliderContainer>
    <label>{label}</label>
    {midiAvailable && midiControl && (
      <button onClick={() => listenForControl(midiControl)}>
        Assign MIDI to {midiControl}
      </button>
    )}
    <StyledSlider value={value} min={min} max={max} step={step} onChange={onChange} thumbImage={thumbImage} />
  </SliderContainer>
);

const Samplerr = ({ audioUrl, imageUrl, onBack, buttonImage }) => {
  // States
  const [isFlipping, setIsFlipping] = useState(false);
  const [player, setPlayer] = useState(null);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(-1);
  const [baseSampleDuration, setBaseSampleDuration] = useState(0);
  const [sampleDuration, setSampleDuration] = useState(0);
  const [trackLoaded, setTrackLoaded] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [loopStarts, setLoopStarts] = useState(new Array(numSamples).fill(0));
  const [loopLengths, setLoopLengths] = useState(new Array(numSamples).fill(1.0));
  const [loopBPM, setLoopBPM] = useState(new Array(numSamples).fill(defaultBPM));
  const [bpmSliderValue, setBpmSliderValue] = useState(defaultBPM);
  const [volumeValue, setVolumeValue] = useState(0.5);
  const [sampleLengthValue, setSampleLengthValue] = useState(0);
  const [sampleStartValue, setSampleStartValue] = useState(0);
  const [midiAvailable, setMidiAvailable] = useState(false);
  const [listeningFor, setListeningFor] = useState(null);
  const [midiAssignments, setMidiAssignments] = useState({
    volume: null,
    bpm: null,
    sampleStart: null,
    sampleLength: null,
  });

  const sampleGridRef = useRef(null);
  const [currentSample, setCurrentSample] = useState({ audioUrl, imageUrl });
  const midiAccessRef = useRef(null);

  const [samplePads, setSamplePads] = useState([]);

  // Initialize Tone.Player and load image
  useEffect(() => {
    loadSoundAndImage(currentSample.audioUrl, currentSample.imageUrl);
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 150); // Match this duration with CSS transition
      return () => clearTimeout(timer);
    }

    // Load MIDI assignments from localStorage
    const storedMidiAssignments = JSON.parse(localStorage.getItem('midiAssignments'));
    if (storedMidiAssignments) {
      setMidiAssignments(storedMidiAssignments);
    }

    setupMIDI();

    // Cleanup function
    return () => {
      if (midiAccessRef.current) {
        for (let input of midiAccessRef.current.inputs.values()) {
          input.onmidimessage = null;
        }
      }
      if (player) {
        player.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipping, currentSample]);

  const handleColorGridClick = (newAudioUrl, newImageUrl) => {
    // Clean up existing player if needed
    if (player) {
      player.dispose();
    }

    setCurrentSample({
      audioUrl: newAudioUrl,
      imageUrl: newImageUrl,
    });

    // Reset states as needed
    setSelectedSampleIndex(-1);
    setTrackLoaded(false);
    setSamplePads([]);
  };

  const loadSoundAndImage = (audioUrl, imageUrl) => {
    const newPlayer = new Tone.Player({
      url: audioUrl,
      loop: isLooping,
    }).toDestination();

    newPlayer.autostart = false;
    setPlayer(newPlayer);

    Tone.loaded().then(() => {
      const duration = newPlayer.buffer.duration;
      setSampleDuration(duration);
      setBaseSampleDuration(duration / numSamples);
      setTrackLoaded(true);
    });

    loadAndDrawImage(imageUrl);
  };

  const loadAndDrawImage = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Important for cross-origin images
    img.src = imageUrl;
    img.onload = () => {
      fillGridWithImage(img);
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
      // Image is wider than the grid
      sHeight = img.height;
      sWidth = img.height * gridAspectRatio;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      // Image is taller than the grid
      sWidth = img.width;
      sHeight = img.width / gridAspectRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    const pads = [];

    for (let i = 0; i < numCols * numRows; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.id = i.toString();

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

      pads.push({ id: i, image: canvas.toDataURL() });
    }

    // Set the sample pads in state
    setSamplePads(pads);
  };

  const selectSample = (index) => {
    setSelectedSampleIndex(index);
    setSampleLengthValue(loopLengths[index]);
    setSampleStartValue(loopStarts[index]);
    setBpmSliderValue(loopBPM[index]);
    playSample(index, loopLengths[index]);
  };

  const playSample = (index, sampleLength) => {
    if (player) {
      const startTime = index * baseSampleDuration + sampleStartValue;
      player.stop();
      player.loop = isLooping;
      if (isLooping) {
        player.loopStart = startTime;
        player.loopEnd = startTime + sampleLength;
      }
      player.playbackRate = bpmSliderValue / defaultBPM;
      player.start(undefined, startTime, isLooping ? undefined : sampleLength);
    }
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
    if (player) {
      player.loop = !isLooping;
      if (selectedSampleIndex !== -1) {
        playSample(selectedSampleIndex, sampleLengthValue);
      }
    }
  };

  const handleBpmChange = (value) => {
    setBpmSliderValue(value);
    if (selectedSampleIndex !== -1) {
      const newLoopBPM = [...loopBPM];
      newLoopBPM[selectedSampleIndex] = value;
      setLoopBPM(newLoopBPM);
      playSample(selectedSampleIndex, sampleLengthValue);
    }
  };

  const handleSampleLengthChange = (value) => {
    setSampleLengthValue(value);
    if (selectedSampleIndex !== -1) {
      const newLoopLengths = [...loopLengths];
      newLoopLengths[selectedSampleIndex] = value;
      setLoopLengths(newLoopLengths);
      playSample(selectedSampleIndex, value);
    }
  };

  const handleSampleStartChange = (value) => {
    setSampleStartValue(value);
    if (selectedSampleIndex !== -1) {
      const newLoopStarts = [...loopStarts];
      newLoopStarts[selectedSampleIndex] = value;
      setLoopStarts(newLoopStarts);
      playSample(selectedSampleIndex, sampleLengthValue);
    }
  };

  const adjustVolume = (value) => {
    setVolumeValue(value);
    if (player) {
      player.volume.value = Tone.gainToDb(value);
    }
  };

  // MIDI Handling
  const setupMIDI = () => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          midiAccessRef.current = access;

          for (let input of access.inputs.values()) {
            input.onmidimessage = handleMIDIMessage;
          }

          setMidiAvailable(access.inputs.size > 0);
        })
        .catch((err) => {
          console.error('MIDI Access Failed:', err);
          setMidiAvailable(false);
        });
    } else {
      console.warn('WebMIDI not supported in this browser');
      setMidiAvailable(false);
    }
  };

  const handleMIDIMessage = (event) => {
    const [status, data1, data2] = event.data;
    const command = status & 0xf0;
    const note = data1;
    const velocity = data2 / 127;

    // Handle MIDI note inputs
    if (command === 0x90 && velocity > 0) {
      const index = note - 36; // Map MIDI note to grid index
      if (index >= 0 && index < numSamples) {
        selectSample(index);
      }
    }

    // Handle Control Change messages
    if (command === 0xb0) {
      if (listeningFor) {
        // Assign MIDI control to a parameter
        setMidiAssignments((prev) => {
          const updated = { ...prev, [listeningFor]: data1 };
          localStorage.setItem('midiAssignments', JSON.stringify(updated));
          return updated;
        });
        alert(`Assigned control ${data1} to ${listeningFor}`);
        setListeningFor(null);
      } else {
        // Adjust parameters based on MIDI control
        const control = data1;
        if (control === midiAssignments.volume) adjustVolume(velocity);
        if (control === midiAssignments.bpm)
          handleBpmChange(Math.round(velocity * 180));
        if (control === midiAssignments.sampleStart)
          handleSampleStartChange(velocity * sampleDuration);
        if (control === midiAssignments.sampleLength)
          handleSampleLengthChange(velocity * sampleDuration);
      }
    }
  };

  const listenForControl = (parameter) => {
    setListeningFor(parameter);
    alert(`Listening for MIDI control to assign to ${parameter}...`);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return `${minutes}:${seconds}`;
  };

  return (
    <SamplerrContainer>
      <SampleGrid>
        {samplePads.map((pad) => (
          <Pad
            key={pad.id}
            id={pad.id}
            onClick={() => selectSample(pad.id)}
            selected={selectedSampleIndex === pad.id}
          >
            <img
              src={pad.image}
              alt={`Pad ${pad.id}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Pad>
        ))}
      </SampleGrid>

      {trackLoaded ? (
        <div style={{ marginTop: '20px', position: 'relative' }}>
          <div>
            <label>
              Start Time: {formatTime(selectedSampleIndex * baseSampleDuration)}
            </label>
          </div>
          <div>
            <label>Sample Length: {formatTime(sampleLengthValue)}</label>
          </div>
          <CustomSlider
            label={`BPM: ${bpmSliderValue} BPM`}
            value={bpmSliderValue}
            min={60}
            max={180}
            step={1}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            midiControl="bpm"
            midiAvailable={midiAvailable}
            listenForControl={listenForControl}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label={`Sample Length: ${sampleLengthValue.toFixed(2)}s`}
            value={sampleLengthValue}
            min={0}
            max={sampleDuration}
            step={0.1}
            onChange={(e) => handleSampleLengthChange(Number(e.target.value))}
            midiControl="sampleLength"
            midiAvailable={midiAvailable}
            listenForControl={listenForControl}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label={`Sample Start: ${formatTime(sampleStartValue)}`}
            value={sampleStartValue}
            min={0}
            max={sampleDuration}
            step={0.1}
            onChange={(e) => handleSampleStartChange(Number(e.target.value))}
            midiControl="sampleStart"
            midiAvailable={midiAvailable}
            listenForControl={listenForControl}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label="Volume"
            value={volumeValue}
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => adjustVolume(Number(e.target.value))}
            midiControl="volume"
            midiAvailable={midiAvailable}
            listenForControl={listenForControl}
            thumbImage={buttonImage}
          />

          <label className="flex items-center">
            Looping: {isLooping ? 'On' : 'Off'}
            <input
              type="checkbox"
              className="toggle toggle-primary ml-2"
              checked={isLooping}
              onChange={toggleLoop}
            />
          </label>
         
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </SamplerrContainer>

  );
};

export default Samplerr;
