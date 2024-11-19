import React, { useState, useEffect, useLayoutEffect } from 'react';
import Samplerr from './Samplerr.jsx';
import { ordArray, vinylLables } from './ordArray.js';

let randomLabel = vinylLables[Math.floor(Math.random() * vinylLables.length)];
let randomLabelUrl = randomLabel.url; 
 
var url = window.location.pathname;
var urlarray = url.split("/");
var ins_id = urlarray[urlarray.length - 1];
//var ins_id = "4e36c60daf4a9dc31c7b4527d31b3191e1ab3cf52ba4fdff866b6e68e335f94di0";
let id = ins_id.endsWith('i0') ? ins_id.slice(0, -2) : ins_id;

const chunkSize = Math.floor(id.length / 8);
const chunks = [];
for (let i = 0; i < 8; i++) {
  chunks.push(id.slice(i * chunkSize, (i + 1) * chunkSize));
}

const colors = chunks.map(chunk => '#' + chunk.slice(0, 6) + "a0");

const randomOrd = ordArray[Math.floor(Math.random() * ordArray.length)];  
const coinUrl = randomOrd.coin; 
 
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

      
      {/* Add marble texture definitions */}
      <defs>
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
          <feColorMatrix type="saturate" values="0" result="desaturatedNoise"/>
          <feBlend in="SourceGraphic" in2="desaturatedNoise" mode="multiply" result="blend"/>
        </filter>
        
        {/* <linearGradient id="marbleGradient" gradientTransform="rotate(45)">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="25%" stopColor="#f0f0f0"/>
          <stop offset="50%" stopColor="#ffffff"/>
          <stop offset="75%" stopColor="#e0e0e0"/>
          <stop offset="100%" stopColor="#ffffff"/>
        </linearGradient> */}
        
        <pattern id="goldVeins" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="rgba(218,165,32,0.4)" strokeWidth="0.5"/>
          <path d="M0,25 Q25,75 50,25 T100,25" fill="none" stroke="rgba(218,165,32,0.3)" strokeWidth="0.5"/>
          <path d="M0,75 Q25,25 50,75 T100,75" fill="none" stroke="rgba(218,165,32,0.3)" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* Replace black circle with marble texture */}
      <circle 
        cx="150" 
        cy="150" 
        r="140" 
        fill="url(#marbleGradient)"
        filter="url(#noise)"
      />
      {/* <circle 
        cx="150" 
        cy="150" 
        r="140" 
        fill="url(#goldVeins)"
        opacity="0.8"
      /> */}

      {/* Update grooves to be more subtle and golden */}
      {[...Array(9)].map((_, i) => (
        <circle
          key={i}
          cx="150"
          cy="150"
          r={120 - i * 12}
          fill="none"
          stroke="rgba(218,165,32,0.2)"
          strokeWidth="0.5"
        />
      ))}

      {/* Center label */}
      <circle cx="150" cy="150" r="45" fill="white" />
      <image
        href={coinUrl}
        x="105"
        y="105"
        width="100"
        height="100"
        clipPath="circle(40px at 45px 45px)"
      />
      {/* <text
        x="150"
        y="150"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="black"
        fontSize="10px"
        fontFamily="Arial"
      >
        {text}
      </text> */}
    </svg>
  );
}

const gradientColors = colors.join(', ');
export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);
   const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerrThumbnail, setShowSamplerrThumbnail] = useState(false);
  const [showSamplerrComponent, setShowSamplerrComponent] = useState(false);
  const [showColorGrid, setShowColorGrid] = useState(false);
  const [showVinylRecord, setShowVinylRecord] = useState(false);  
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
 

  useEffect(() => {
  
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
        console.log("CORS success");
      } else if (url === "https://arweave.net/") {
        setCorsSuccess(false);
        console.log("CORS failure");
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
   checkCORS("localhost");
  
     return () => {
      console.log('Component will unmount');
      
    };
  }, [isFlipping]); // The empty array means this effect runs once on mount and clean up on unmount

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === true) {
    return (
      <div>
       <div
        style={{
          backgroundImage: `url(${coinUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
        <div
          style={{
            background: `linear-gradient(45deg, ${gradientColors})`, // Example gradient
            // opacity: 0.5, // Adjust opacity for desired effect
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -1, // Positioned above the blurred background
          }}
        />

       <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >        
          {!showSamplerrComponent ? (
            <> 
                <VinylRecord
                  text={text}
                  onClick={() => {
                    setAudioUrl(
                      'https://ordinals.com/content/78b3b56af07cb926b0f8ac22322cf02714db23984b875bc5be15c726cd1ed27ci0'
                    );
                    setImageUrl(
                      coinUrl
                    );
                    setShowSamplerrComponent(true);
                    setShowVinylRecord(false);
                    
                  }}
                 />
              

              {showSamplerrThumbnail && (
                <img
                  src={imageUrl}
                  alt="Samplerr Thumbnail"
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    height: '300px',
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  onClick={() => setShowSamplerrComponent(true)}
                />
              )}
            </>
          ) : (
            <Samplerr
              audioUrl={audioUrl}
              imageUrl={imageUrl}
              onBack={() => {
                setShowSamplerrComponent(false);
              }}
              
            />
          )}
        
      </div>
    </div>
    );
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
      />   
     )
  };

}