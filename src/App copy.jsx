import React, { useState, useRef, useEffect } from 'react';
import { Stats, OrbitControls, Circle, Environment, Text3D, Center } from '@react-three/drei'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'

function Box(props) {
 
   const ref = useRef()
   const [hovered, hover] = useState(false)
   const [clicked, click] = useState(false)
  //  useFrame((state, delta) => (ref.current.rotation.x += delta))
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        click(false)
      }, 150) // 150ms delay, adjust as needed
      return () => clearTimeout(timer)
    }
  }, [clicked])

   return (
    
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(true)}
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}>
        
      <boxGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial color={hovered ? 'orange' : 'gray'} />
    
    </mesh>
  )
}

export default function App() {
  const gltf = useLoader(GLTFLoader, './iom-vinyl.glb')
  const [text, setText] = useState('Ides of March');
  const [corsSuccess, setCorsSuccess] = useState(null);

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
  checkCORS(url);
  
    // If you need to clean up (analogous to componentWillUnmount), return a function:
    return () => {
      console.log('Component will unmount');
      // Clean up code here (e.g., remove event listeners)
    };
  }, []); // The empty array means this effect runs once on mount and clean up on unmount

  if (corsSuccess === null) {
    return <div>Loading...</div>; 
  }

  if (corsSuccess === false) {
    return (
      <Canvas camera={{ position: [0, -3.75, 0] }} shadows>
        <Environment preset="lobby" background />
        <directionalLight
          position={[3.3, 1.0, 4.4]}
          intensity={Math.PI * 2}
        />
        <primitive
          object={gltf.scene}
          position={[0, -3, 0]}
          scale={3}
          children-0-castShadow
        />
        <Center position={[0, 0, 2]}>
  
          {/* <Text3D
            font="https://ordinals.com/content/e41d23e435aa7c9881d7073c1f96f511140a9558bbd229b1c786a0647f6fdb57i0"
            size={0.5}
            height={0.2}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelOffset={0}
            bevelSegments={5}
            rotation={[Math.PI / 2, 0, 0]}
          >
            Ides of March
            <meshStandardMaterial color="gray" metalness={0.5} roughness={0.5} />
          </Text3D>
   */}
         
        </Center>
  
  
        {/* <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial />
        </Circle> */}
        <OrbitControls target={[0, 1, 0]} />
        {/* <axesHelper args={[5]} /> */}
        {/* <Stats /> */}
      </Canvas>
  
    )
  } else {
    return (
    <Canvas camera={{ position: [0, -8, 0] }} shadows>
    <Environment preset="studio" background />
    <directionalLight
      position={[3.3, 1.0, 4.4]}
      intensity={Math.PI * 2}
    />
   
    <Center position={[0, 0, 4]}>

      <Text3D
        font="https://ordinals.com/content/e41d23e435aa7c9881d7073c1f96f511140a9558bbd229b1c786a0647f6fdb57i0"
        size={0.5}
        height={0.1}
        curveSegments={12}
         
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        rotation={[Math.PI / 2, 0, 0]}
      >
        Samplerr
        <meshStandardMaterial color="gray" metalness={0.5} roughness={0.5} />
      </Text3D>

    </Center>

    <OrbitControls target={[0, 1, 0]} />
    {/* <axesHelper args={[5]} /> */}
 
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      
      {[...Array(4)].map((_, rowIndex) =>
          [...Array(4)].map((_, colIndex) => (
            <Box
              key={`${rowIndex}-${colIndex}`}
              position={[
                (colIndex - 1.5) * 1.5,  // X position
                0,                       // Y position
                (rowIndex - 1.5) * 1.5   // Z position
              ]}
            />
          ))
        )}
    </Canvas>
    )
  }

}