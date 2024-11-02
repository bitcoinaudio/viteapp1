import React, { useState, useRef, useEffect } from 'react';
import { Stats, OrbitControls, Circle, Environment, Text3D, Center } from '@react-three/drei'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'


function VinylRecord({ text }) {
  return (
    <svg width="800" height="800" viewBox="0 0 300 300">
      {/* Vinyl disc with gradient */}
      <defs>
       
        <linearGradient id="vinylGradient" gradientTransform="rotate(45)">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="14%" stopColor="#FF8000" />
          <stop offset="28%" stopColor="#FFFF00" />
          <stop offset="42%" stopColor="#00FF00" />
          <stop offset="56%" stopColor="#00FFFF" />
          <stop offset="70%" stopColor="#0000FF" />
          <stop offset="84%" stopColor="#8000FF" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
      </defs>
      
      {/* Main vinyl disc */}
      <circle cx="150" cy="150" r="145" fill="url(#vinylGradient)" />
      <circle cx="150" cy="150" r="140" fill="black" opacity="0.8" />
      
      {/* Grooves */}
      {[...Array(8)].map((_, i) => (
        <circle 
          key={i}
          cx="150"
          cy="150"
          r={120 - (i * 15)}
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
        {/* {text} */}
      </text>
    </svg>
  );
}
 
function ColorGrid({ isLarge, onClick }) {
  const gridSize = isLarge ? '400px' : '100px';
  const cellSize = isLarge ? '100px' : '25px';
  
  return (
    <div 
      onClick={onClick}
      style={{
        position: isLarge ? 'fixed' : 'absolute',
        bottom: isLarge ? '50%' : '20px',
        right: isLarge ? '50%' : '20px',
        transform: isLarge ? 'translate(50%, 50%)' : 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        width: gridSize,
        height: gridSize,
        gap: '1px',
        background: '#333',
        padding: '1px',
        cursor: 'pointer',
        zIndex: isLarge ? 10 : 1,
      }}
    >
      {[
        '#FF0000', '#FF8000', '#FFFF00', '#00FF00',
        '#00FFFF', '#0000FF', '#8000FF', '#FF00FF',
        '#FF0000', '#FF8000', '#FFFF00', '#00FF00',
        '#00FFFF', '#0000FF', '#8000FF', '#FF00FF'
      ].map((color, index) => (
        <div
          key={index}
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
}
export default function App() {
  const [text, setText] = useState('The Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);
  const [showSamplerr, setShowSamplerr] = useState(false);

  useEffect(() => {
    // This function will run when the component mounts
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
  
     return () => {
      console.log('Component will unmount');
     };
  }, []);  

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === false) {
    return (
 <div>CORS failure</div>
    )
  } else {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        position: 'relative',
        backgroundColor: '#1a1a1a'  // Optional: added dark background to make vinyl pop
      }}>
        <VinylRecord text={text} />
        <ColorGrid 
          isLarge={false} 
          onClick={() => setShowSamplerr(true)} 
        />
        {showSamplerr && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9,
            }}
            onClick={() => setShowSamplerr(false)}
          >
            <ColorGrid 
              isLarge={true} 
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        )}
      </div>
    );
  }

}