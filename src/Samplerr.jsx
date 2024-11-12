// Samplerr.jsx
import React, { useState, useEffect, useRef } from 'react';
 
const numSamples = 12;
const defaultBPM = 91.5;
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
           name: 'Rare Scrilla',
           alias: 'Rare Scrilla',
           audio: 'https://ordinals.com/content/0dd65cb9dfa10d672c16e3741d73eead9085a710ff5f8796ef626799c85f944bi0',
           image: 'https://ordinals.com/content/3c4062f5e3433b997a92020f849fad8a82c7c2369a5c810a2f92ecdd61421e33i0',
        },
        {
          id: 6,
          name: 'GFK',
          alias: 'GFK',
          audio: 'https://ordinals.com/content/069f79685c04af6357058eeeb65c4835ed13d00b5bf5a69c4cff5e513d9b0fffi0',
          image: 'https://ordinals.com/content/99d1ce468eccac8a43eb07fc99f83d920bbd4846255d477fc9746b28f877ee4ci0',
       }
   ];
   

const Samplerr = ({ audioUrl, imageUrl, onBack, buttonImage   }) => {
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

  // Initialize Tone.Player and load image
  useEffect(() => {
    loadSoundAndImage(currentSample.audioUrl, currentSample.imageUrl);
    if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setShowSamplerrComponent(true);
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
      imageUrl: newImageUrl
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

  const [samplePads, setSamplePads] = useState([]);

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
      player.start(undefined, startTime, isLooping ? undefined : sampleLength);    }
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
      loopBPM[selectedSampleIndex] = value;
      playSample(selectedSampleIndex, sampleLengthValue);
    }
  };

  const handleSampleLengthChange = (value) => {
    setSampleLengthValue(value);
    if (selectedSampleIndex !== -1) {
      loopLengths[selectedSampleIndex] = value;
      playSample(selectedSampleIndex, value);
    }
  };

  const handleSampleStartChange = (value) => {
    setSampleStartValue(value);
    if (selectedSampleIndex !== -1) {
      loopStarts[selectedSampleIndex] = value;
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
    const data = event.data;
    const command = data[0] & 0xf0;
    const channel = data[0] & 0x0f;
    const note = data[1];
    const velocity = data[2];

    // Handle drum pads (channel 9)
    if (channel === 9) {
      if (command === 0x90 && velocity > 0) {
            // Convert MIDI note to grid index starting from bottom left
      const midiOffset = note - 36; // Assuming MIDI notes start at 36
      const row = Math.floor(midiOffset / 4);
      const col = midiOffset % 4;
      
       const index = row * 3 + col;
      if (index >= 0 && index < numSamples) {
        selectSample(index);
        playSample(index, loopLengths[index]);
       }
      }
    }
    // Handle Control Change messages (knobs/sliders)
    else if (command === 0xb0) {
      const control = note;
      const value = velocity / 127;

      if (listeningFor) {
        // Learning mode - assign control to parameter
        setMidiAssignments((prev) => {
          const newAssignments = { ...prev, [listeningFor]: control };
          localStorage.setItem('midiAssignments', JSON.stringify(newAssignments));
          return newAssignments;
        });
        alert(`Assigned control ${control} to ${listeningFor}`);
        setListeningFor(null);
      } else {
        // Normal mode - use control
        if (control === midiAssignments.volume) {
          adjustVolume(value);
        } else if (control === midiAssignments.bpm) {
          handleBpmChange(Math.round(value * 180));
        } else if (control === midiAssignments.sampleStart) {
          handleSampleStartChange(value * sampleDuration);
        } else if (control === midiAssignments.sampleLength) {
          handleSampleLengthChange(value * sampleDuration);
        }
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

  const sliderStyles = {
    container: {
      marginTop: '4px',
    },
    slider: {
      WebkitAppearance: 'none',
      width: '100%',
      height: '2px',
      borderRadius: '5px',
      background: '#d3d3d3',
      outline: 'none',
      opacity: '0.7',
      transition: 'opacity .2s',
    },
    // Webkit (Chrome, Safari, newer versions of Opera)
    sliderThumb: {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: '25px',
      height: '25px',
      background: `url(${buttonImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '50%',
    },
    // Mozilla Firefox
    sliderThumbMoz: {
      width: '25px',
      height: '25px',
      background: `url(${buttonImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '50%',
    },
  };
  
  // Update the input range elements to use the custom styles
  const CustomSlider = ({ label, value, min, max, step, onChange, midiControl }) => (
    <div style={sliderStyles.container}>
      <label>{label}</label>
      {midiAvailable && midiControl && (
        <button onClick={() => listenForControl(midiControl)}>
          Listen for {midiControl}
        </button>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        style={{
          ...sliderStyles.slider,
          '::-webkit-slider-thumb': sliderStyles.sliderThumb,
          '::-moz-range-thumb': sliderStyles.sliderThumbMoz,
        }}
      />
    </div>
  );
  

  return (

    
    <div className="samplerr-container shadow-lg p-2 mb-2 bg-body-tertiary rounded"
    style={{
      // backgroundImage: `url(${buttonImage})`,
      // backgroundSize: 'cover',
      // backgroundPosition: 'center',
      // width: '100%',
      // height: '100%',
    }}
        >
      
      <div
        className=""
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 125px)',
          gridGap: '4px',
          justifyContent: 'center',
        }}
      >
        {samplePads.map((pad) => (
          <div
            key={pad.id}
            id={pad.id}
            onClick={() => selectSample(pad.id)}
            style={{
              width: '100%',
              aspectRatio: '1',
              border:
              selectedSampleIndex === pad.id ? '2px solid yellow' : '2px solid #444',
              cursor: 'pointer',
            }}
          >
            <img className=""
              src={pad.image}
              alt={`Pad ${pad.id}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {trackLoaded ? (
        <div className="controls  " 
        style={{ marginTop: '20px' }}>
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
      />

          <CustomSlider
        label={`Sample Length: ${sampleLengthValue.toFixed(2)}s`}
        value={sampleLengthValue}
        min={0}
        max={sampleDuration}
        step={0.01}
        onChange={(e) => handleSampleLengthChange(Number(e.target.value))}
        midiControl="sampleLength"
      />

      <CustomSlider
        label={`Sample Start: ${formatTime(sampleStartValue)}`}
        value={sampleStartValue}
        min={0}
        max={sampleDuration}
        step={0.01}
        onChange={(e) => handleSampleStartChange(Number(e.target.value))}
        midiControl="sampleStart"
      />
      <CustomSlider
        label="Volume"
        value={volumeValue}
        min={0}
        max={1}
        step={0.01}
        onChange={(e) => adjustVolume(Number(e.target.value))}
        midiControl="volume"
      />

         
<label>
    Looping: {isLooping ? 'On' : 'Off'}
    <button onClick={toggleLoop} style={{ marginLeft: '10px' }}>
      {isLooping ? 'Turn Off' : 'Turn On'}
    </button>
  </label>


<img
              src={buttonImage}
              alt="Back Button"
              className='hover:scale-110 transition-transform'
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
               
                cursor: 'pointer',
                zIndex: 1,
                width: '20vw',
                height: 'auto',
                transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              onClick={() => {
                setIsFlipping(true);
                onBack();
                console.log('Button clicked');
              }}
              />


        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Samplerr;
