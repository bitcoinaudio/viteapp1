import React, { useState, useEffect, useLayoutEffect } from 'react';
import { OrbitControls, Environment, Center, GradientTexture } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
import Samplerr from './Samplerr.jsx';
import {ordArray, glbModels} from './ordArray.js';
 
const coinStyle = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  height: '600px',
  cursor: 'pointer',
  zIndex: 1,
  transition: 'transform 0.15s ease-in-out',
  transformStyle: 'preserve-3d',
};

var url = window.location.pathname;
var urlarray = url.split("/");
// ins_id = urlarray[urlarray.length - 1];
var ins_id = "4e36c60daf4a9dc31c7b4527d31b3191e1ab3cf52ba4fdff866b6e68e335f94di0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6) + "a0");

function GradientEnvironment() {
  return (
    <Environment background>
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial side={2}>
          <GradientTexture
            stops={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]} // Add more stops for more complex gradients
            colors={colors} // Use all colors from inscription
          />
        </meshBasicMaterial>
      </mesh>
    </Environment>
  );
}
function VinylRecord({ text, onClick }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 300"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Vinyl disc with gradient */}
      <defs>
        <linearGradient id="vinylGradient" gradientTransform="rotate(45)">
          {colors.map((color, idx) => (
            <stop
              key={idx}
              offset={`${(idx * 100) / (colors.length - 1)}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>

      {/* Main vinyl disc */}
      <circle cx="150" cy="150" r="145" fill="url(#vinylGradient)" />
      <circle cx="150" cy="150" r="140" fill="black" opacity="0.8" />

      {/* Grooves */}
      {[...Array(9)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={120 - i * 15}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Center label */}
      <circle cx="150" cy="150" r="45" fill="white" />
      <text
        x="150"
        y="150"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10px"
        fontFamily="Arial"
      >
        {text}
      </text>
    </svg>
  );
}
const ColorGrid = ({ isLarge, onClick }) => {
  const gridSize = isLarge ? '60vh' : '20vh';
  const svgSize = isLarge ? 300 : 100;
  const rectSize = svgSize / 3;
  const expectedLength = 64;

  if (id.length !== expectedLength) {
    console.error('ins_id has unexpected length');
    return null;
  }

  const localChunks = [];
  const chunkSize = 7;
  let index = 0;
  for (let i = 0; i < 8; i++) {
    localChunks.push(id.slice(index, index + chunkSize));
    index += chunkSize;
  }
  localChunks.push(id.slice(index));

  const localColors = localChunks.map(chunk => '#' + chunk.slice(0, 6));

  return (
    <div
      onClick={onClick}
      style={{
        position: isLarge ? 'fixed' : 'absolute',
        bottom: isLarge ? '50%' : '20px',
        right: isLarge ? '50%' : '20px',
        transform: isLarge ? 'translate(50%, 50%)' : 'none',
        width: gridSize,
        height: gridSize,
        gap: '1px',
        background: '#333',
        padding: '1px',
        cursor: 'pointer',
        zIndex: isLarge ? 10 : 1,
      }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {localColors.map((color, idx) => {
          const x = (idx % 3) * rectSize;
          const y = Math.floor(idx / 3) * rectSize;
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={rectSize}
              height={rectSize}
              fill={color}
              stroke="black"
            />
          );
        })}
      </svg>
    </div>
  );
};

function selectRandomOrd() {
  const random = Math.random() * 100; // Generate number between 0-100

  // Define rarity distribution
  if (random < 30) return ordArray[0]; // 30% chance
  if (random < 55) return ordArray[1]; // 25% chance
  if (random < 75) return ordArray[2]; // 20% chance
  if (random < 90) return ordArray[3]; // 15% chance
  if (random < 98) return ordArray[4]; // 8% chance
  return ordArray[5]; // 2% chance
}
 
const randomModel = () => {
  const random = Math.random() * 100; // Generate number between 0-100
  if (random < 50) return glbModels[0]; // 50% chance
  if (random < 75) return glbModels[1]; // 25% chance
  return glbModels[2]; // 25% chance
}


export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);

  const gltf = useLoader(GLTFLoader, 'https://ordinals.com/content/f5bc81d7d049c47cb9a956661371ccc4870211cdaf2057a670ab31e810d7a3f9i0');

  const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerrThumbnail, setShowSamplerrThumbnail] = useState(false);
  const [showSamplerrComponent, setShowSamplerrComponent] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [showVinylRecord, setShowVinylRecord] = useState(false);  
  const [loadCount, setLoadCount] = useState(
    parseInt(localStorage.getItem('loadCount') || '0') + 1
  );
  const [clickCount, setClickCount] = useState(
    parseInt(localStorage.getItem('clickCount') || '0')
  );
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [buttonImage, setButtonImage] = useState(() => {
    const selectedOrd = selectRandomOrd();
    return selectedOrd.coin;
  });

  useEffect(() => {
    localStorage.setItem('loadCount', loadCount.toString());
 
        // setShowSamplerrThumbnail(true);
        if(!showVinylRecord) {
          const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];
          setAudioUrl(randomOrd.audio);
          setImageUrl(randomOrd.image);
        }
 

     if (isFlipping) {
      const timer = setTimeout(() => {
        setIsFlipping(false);
        setShowSamplerrComponent(true);
      }, 150); // Match this duration with CSS transition
      return () => clearTimeout(timer);
    }
    
    console.log('Component mounted');
    
    function checkCORS(url) {
      if (url === "localhost") {
        setCorsSuccess(true);
        console.log("CORS success (localhost)");
      } else if (url === "https://arweave.net/") {
        setCorsSuccess(false);
        console.log("CORS failure (arweave.net)");
      } else {
        // For any other URL, perform the actual CORS check
        fetch(url)
          .then(response => {
            if (response.ok) {
              setCorsSuccess(true);
              console.log("CORS success");
            } else {
              setCorsSuccess(false);
              console.log("CORS failure");
            }
          })
          .catch(error => {
            setCorsSuccess(false);
            console.log("CORS failure (error)", error);
          });
      }
    }  
  
  const url = "https://arweave.net/"; // or "localhost"
  const local = "localhost";
  checkCORS(local);
  
    // If you need to clean up (analogous to componentWillUnmount), return a function:
    return () => {
      console.log('Component will unmount');
      // Clean up code here (e.g., remove event listeners)
    };
  }, [isFlipping]); // The empty array means this effect runs once on mount and clean up on unmount

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === true) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        position: 'relative',
      }}>
        {!showSamplerrComponent ? (
                      
              <>
                <Canvas camera={{ position: [0, -80, 0] }} shadows>
                  <GradientEnvironment /> 
                  <directionalLight
                    position={[50, -400, 0]}
                    intensity={Math.PI * 2}
                  />
                  <primitive
                    object={gltf.scene}
                    position={[0, 0, 0]}
                    rotation={[0, 0 , -3.14]}
                    scale={3}
                    children-0-castShadow
                  />
                  <Center position={[0, 0, 0]} />
                  <OrbitControls target={[0, 0, 0]} />
                </Canvas>
  
                <img
                  src={buttonImage}
                  alt="Play Button"
                  style={{
                    ...coinStyle,
                    width: '20vw',
                    height: 'auto',
                    transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                  onClick={() => {
                    setIsFlipping(true);
                     console.log('Button clicked');
                  }}
                />
              </>
            ) : (
  
           
          <Samplerr
            audioUrl={audioUrl}
            imageUrl={imageUrl}            
            onBack={() => {
              setShowSamplerrComponent(false);
            }}
            
            buttonImage={buttonImage}
          />
        )}
      </div>
    )
  } else {
    return (
    <iframe 
        src="https://arweave.net/ml05xf2_JpNGZNygviKlq1BCkvEkGMYhbA-AQEbSwoI"
         style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
        title="Fullscreen Content"
      />    )
  }

}