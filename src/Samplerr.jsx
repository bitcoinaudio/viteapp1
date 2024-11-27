// Samplerr.jsx
import React, { useState, useEffect, useRef } from 'react';
 import styled from 'styled-components';

const numSamples = 12;
const defaultBPM = 91.5;

const SamplerrContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 0.25rem;
  position: relative;

  @media (max-width: 1024px) and (orientation: landscape) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20px;
    max-height: 100vh;
    overflow-y: auto;
  }
    @media (max-aspect-ratio: 1/1) {
    display: block;
    overflow-y: auto;
    max-height: 100vh;
    
  }
`;

const SampleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 125px);
  grid-gap: 4px;
  justify-content: center;
  box-shadow: 1px 1px 20px 6px rgb(27, 27, 27);

  @media (max-width: 1024px) and (orientation: landscape) {
    flex: 0 0 auto;
    margin-right: 0px;
    order: 1;
  }
`;

const ControlsContainer = styled.div`
  color: #f8f9fa;
  background-color: #111111e3;
  border: #1c2023;
  padding: 10px;
  font-size: 1em;
  border-radius: 8px;
  border-color: rgba(0, 0, 0, 0.53);
  border-width: 1px;
  box-shadow: 1px 1px 20px 5px rgb(27, 27, 27);

  @media (max-width: 1024px) and (orientation: landscape) {
    margin-top: 0;
    flex: 1 1 auto;
    overflow-y: auto;
    padding-right: 10px;
    order: 2;
  }
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


const CustomSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  thumbImage,
}) => (
  <SliderContainer>
    <label>{label}</label>
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
 
  const sampleGridRef = useRef(null);
  const [currentSample, setCurrentSample] = useState({ audioUrl, imageUrl });
 
  const [samplePads, setSamplePads] = useState([]);

  
  useEffect(() => {
    loadSoundAndImage(currentSample.audioUrl, currentSample.imageUrl);
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 150); // Match this duration with CSS transition
      return () => clearTimeout(timer);
    }
    return () => {
     
      if (player) {
        player.dispose();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipping, currentSample]);


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
    img.crossOrigin = 'Anonymous';  
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
      const maxStartTime = player.buffer.duration - sampleLength;

       const validStartTime = Math.max(0, Math.min(startTime, maxStartTime));

      player.stop();
      player.loop = isLooping;
      if (isLooping) {
        player.loopStart = validStartTime;
        player.loopEnd = validStartTime + sampleLength;
      }
      player.playbackRate = bpmSliderValue / defaultBPM;
      player.start(undefined, validStartTime, isLooping ? undefined : sampleLength);
    }
  };
  const stopSample = () => {
    if (player) {
      player.stop();
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
            onMouseDown={() => selectSample(pad.id)}
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
        <ControlsContainer>
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
            min={45}
            max={220}
            step={1}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label={`Sample Length: ${sampleLengthValue.toFixed(2)}s`}
            value={sampleLengthValue}
            min={0}
            max={sampleDuration}
            step={0.1}
            onChange={(e) => handleSampleLengthChange(Number(e.target.value))}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label={`Sample Start: ${formatTime(sampleStartValue)}`}
            value={sampleStartValue}
            min={0}
            max={sampleDuration}
            step={0.1}
            onChange={(e) => handleSampleStartChange(Number(e.target.value))}
            thumbImage={buttonImage}
          />

          <CustomSlider
            label="Volume"
            value={volumeValue}
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => adjustVolume(Number(e.target.value))}
            thumbImage={buttonImage}
          />
          <div className="flex items-center gap-8">
          <label className="flex items-center">
            Looping: {isLooping ? 'On' : 'Off'}
            <input
              type="checkbox"
              className="toggle toggle-primary ml-2"
              checked={isLooping}
              onChange={toggleLoop}
            />
          </label>

          <button onClick={stopSample} title="Stop">🛑</button>
          <button onClick={() => { stopSample(); onBack(); }} title="Back">🔙</button>
          </div>
        </ControlsContainer>
      ) : (
        <p>Loading...</p>
      )}
    </SamplerrContainer>

  );
  
};

export default Samplerr;
