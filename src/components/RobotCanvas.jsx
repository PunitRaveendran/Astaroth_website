import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';

// CAD origin offset extracted from Autodesk Fusion 360 / ATF export:
const cx = 143.66;
const cy = 322.03;
const cz = 270.02;

// Axle center of the drum weapon relative to CAD center:
const drumAxleX = 143.56 - cx;
const drumAxleY = 182.53 - cy;
const drumAxleZ = 264.47 - cz;

// Clean STL geometry helper: strip custom vertex color channels
function sanitizeSTLGeometry(geo) {
  if (geo.attributes.color) {
    geo.deleteAttribute('color');
  }
  geo.computeVertexNormals();
  return geo;
}

function LawnmowerBot({ stateRef, rotRef }) {
  const meshWheelLRef = useRef();
  const meshWheelRRef = useRef();
  const drumExplodeGroupRef = useRef();
  const drumMeshRef = useRef();
  const botGroupRef = useRef();
  const currentExplodeRef = useRef(0);

  // Load rear plate texture
  const textureRearPlate = useLoader(THREE.TextureLoader, '/lawnmower_rear_plate.png');
  textureRearPlate.colorSpace = THREE.SRGBColorSpace;

  // Load binary STLs
  const [rawBF, rawTD, rawWL, rawWR, rawDW, rawDS] = useLoader(STLLoader, [
    '/part_bottom_frame.stl',
    '/part_top_deck.stl',
    '/part_wheel_left.stl',
    '/part_wheel_right.stl',
    '/part_drum_teeth.stl',
    '/part_drum_shaft.stl'
  ]);

  // Center geometries around combat center of mass
  const { gBF, gTD, gWL, gWR, gDW, gDS, gRP } = useMemo(() => {
    const bF = sanitizeSTLGeometry(rawBF.clone());
    bF.translate(-cx, -cy, -cz);

    const tD = sanitizeSTLGeometry(rawTD.clone());
    tD.translate(-cx, -cy, -cz);

    const wL = sanitizeSTLGeometry(rawWL.clone());
    wL.translate(-cx, -cy, -cz);

    const wR = sanitizeSTLGeometry(rawWR.clone());
    wR.translate(-cx, -cy, -cz);

    const dW = sanitizeSTLGeometry(rawDW.clone());
    dW.translate(-143.56, -182.53, -264.47);

    const dS = sanitizeSTLGeometry(rawDS.clone());
    dS.translate(-143.56, -182.53, -264.47);

    // Rear Lawnmower Logo Plate geometry (covers rear slits completely)
    // In STL space viewed from rear (+Y looking toward -Y):
    // rxRight (+X) is to viewer left, rxLeft (-X) is to viewer right.
    // To display text forward from left to right (L -> R):
    // rxRight (viewer left) maps to U=0, rxLeft (viewer right) maps to U=1.
    const rpGeo = new THREE.BufferGeometry();
    const rw = 284, rh = 92, ry = 200.8, rzCenter = -11.0;
    const rzBottom = rzCenter - rh / 2, rzTop = rzCenter + rh / 2;
    const rxLeft = -rw / 2, rxRight = rw / 2;
    rpGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      rxLeft,  ry, rzBottom, // 0: bottom right (viewer)
      rxRight, ry, rzBottom, // 1: bottom left (viewer)
      rxRight, ry, rzTop,    // 2: top left (viewer)
      rxLeft,  ry, rzTop     // 3: top right (viewer)
    ]), 3));
    rpGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
      1, 0, // 0: u=1, v=0 (bottom right)
      0, 0, // 1: u=0, v=0 (bottom left)
      0, 1, // 2: u=0, v=1 (top left)
      1, 1  // 3: u=1, v=1 (top right)
    ]), 2));
    rpGeo.setIndex(new THREE.BufferAttribute(new Uint16Array([
      0, 2, 1,
      0, 3, 2
    ]), 1));
    rpGeo.computeVertexNormals();

    return { gBF: bF, gTD: tD, gWL: wL, gWR: wR, gDW: dW, gDS: dS, gRP: rpGeo };
  }, [rawBF, rawTD, rawWL, rawWR, rawDW, rawDS]);

  // Authentic Iron Man Red & 24K Gold Color Scheme:
  // Saturated candy/crimson hot-rod red body (zero brown), metallic 24K gold drum, matte black rubber wheels
  const materials = useMemo(() => {
    const matChassis = new THREE.MeshStandardMaterial({
      color: 0x9e111b, // Saturated Iron Man Hot-Rod Crimson Red
      metalness: 0.35,
      roughness: 0.40,
      emissive: 0x220205, // Rich crimson ambient fill to avoid muddy dark brown in shadows
      emissiveIntensity: 0.15
    });

    const matTopDeck = new THREE.MeshStandardMaterial({
      color: 0x960f18, // Matching Iron Man Crimson Red
      metalness: 0.35,
      roughness: 0.40,
      emissive: 0x200205,
      emissiveIntensity: 0.15
    });

    const matWheel = new THREE.MeshStandardMaterial({
      color: 0x141416, // Matte dark tire rubber
      metalness: 0.10,
      roughness: 0.85,
      emissive: 0x020202,
      emissiveIntensity: 0.04
    });

    const matDrum = new THREE.MeshStandardMaterial({
      color: 0xd4a017, // 24K Metallic Gold Drum Teeth (Rolling outer teeth only)
      metalness: 0.88,
      roughness: 0.28,
      emissive: 0x281902,
      emissiveIntensity: 0.12
    });

    const matShaft = new THREE.MeshStandardMaterial({
      color: 0x141416, // Black Inner Shaft, central pulley & mounting hardware
      metalness: 0.20,
      roughness: 0.75,
      emissive: 0x020202,
      emissiveIntensity: 0.04
    });

    const matRearPlate = new THREE.MeshStandardMaterial({
      map: textureRearPlate,
      metalness: 0.35,
      roughness: 0.40,
      emissive: 0x220205,
      emissiveIntensity: 0.15,
      side: THREE.DoubleSide
    });

    return { matChassis, matTopDeck, matWheel, matDrum, matShaft, matRearPlate };
  }, [textureRearPlate]);

  // Frame update: direct GPU animation & robot rotation
  useFrame((state, delta) => {
    const currentState = stateRef ? stateRef.current : { targetExplode: 0, weaponRPM: 0 };
    const { targetExplode = 0, weaponRPM = 0 } = currentState;

    // 1. Explode Separation Interpolation
    currentExplodeRef.current += (targetExplode - currentExplodeRef.current) * 0.12;
    const curExp = currentExplodeRef.current;

    // ONLY wheels and weapon drum decouple:
    if (meshWheelLRef.current) {
      meshWheelLRef.current.position.x = -125 * curExp;
    }
    if (meshWheelRRef.current) {
      meshWheelRRef.current.position.x = 125 * curExp;
    }
    if (drumExplodeGroupRef.current) {
      drumExplodeGroupRef.current.position.y = -120 * curExp;
    }

    // 2. Drum Weapon continuous spin
    const spinSpeed = Math.max(0.12, (weaponRPM / 60) * Math.PI * 2 * delta * 0.08);
    if (drumMeshRef.current) {
      drumMeshRef.current.rotation.x -= spinSpeed;
    }

    // 3. Robot-Only Rotation (Base stays 100% stationary)
    if (rotRef && rotRef.current) {
      const r = rotRef.current;
      // Auto-orbit when user is not dragging
      if (r.autoOrbit && !r.isDragging) {
        r.targetRotY += delta * 0.18;
      }
      r.rotY += (r.targetRotY - r.rotY) * 0.08;
      r.rotX += (r.targetRotX - r.rotX) * 0.08;

      if (botGroupRef.current) {
        botGroupRef.current.rotation.y = r.rotY;
        botGroupRef.current.rotation.x = r.rotX;
      }
    }
  });

  return (
    // Robot master group - rotates independently above the arena floor
    <group ref={botGroupRef} rotation={[0.14, 0.55, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* LOWER FRAME - SOLID UNIBODY CHASSIS (STAYS AT 0,0,0) */}
        <mesh geometry={gBF} material={materials.matChassis} castShadow receiveShadow />

        {/* TOP DECK - SOLID UNIBODY CHASSIS (STAYS AT 0,0,0) */}
        <mesh geometry={gTD} material={materials.matTopDeck} castShadow receiveShadow />

        {/* REAR LAWNMOWER LOGO PLATE (COVERS REAR SLITS COMPLETELY, UN-MIRRORED) */}
        <mesh geometry={gRP} material={materials.matRearPlate} castShadow receiveShadow />

        {/* LEFT DRIVE WHEEL (SLIDES LATERALLY -X) */}
        <mesh ref={meshWheelLRef} geometry={gWL} material={materials.matWheel} castShadow receiveShadow />

        {/* RIGHT DRIVE WHEEL (SLIDES LATERALLY +X) */}
        <mesh ref={meshWheelRRef} geometry={gWR} material={materials.matWheel} castShadow receiveShadow />

        {/* ROTATING QUAD-TOOTH DRUM & BLACK INNER SHAFT */}
        <group ref={drumExplodeGroupRef}>
          <group position={[drumAxleX, drumAxleY, drumAxleZ]}>
            <group ref={drumMeshRef}>
              {/* Only the rolling drum teeth are 24K Gold */}
              <mesh geometry={gDW} material={materials.matDrum} castShadow receiveShadow />
              {/* Inner shaft, pulley, and axle hardware are Matte Black */}
              <mesh geometry={gDS} material={materials.matShaft} castShadow receiveShadow />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}


function ResponsiveCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 1.0) {
      // Mobile portrait view: frame the 550mm exploded robot with comfortable margin
      const targetZ = Math.min(2650, Math.max(1300, 850 / (0.64984 * aspect)));
      const targetY = 320;
      camera.position.z += (targetZ - camera.position.z) * 0.12;
      camera.position.y += (targetY - camera.position.y) * 0.12;
      camera.position.x += (0 - camera.position.x) * 0.12;
      camera.lookAt(0, 50, 0);
    } else {
      // Desktop landscape view:
      const targetZ = 1080;
      const targetY = 240;
      camera.position.z += (targetZ - camera.position.z) * 0.12;
      camera.position.y += (targetY - camera.position.y) * 0.12;
      camera.lookAt(0, 0, 0);
    }
    camera.updateProjectionMatrix();
  });

  return null;
}

function RobotScene({ stateRef, rotRef }) {
  const currentSceneXRef = useRef(0);
  const sceneGroupRef = useRef();

  useFrame(() => {
    const currentState = stateRef ? stateRef.current : { targetCamX: 0 };
    const { targetCamX = 0 } = currentState;

    // Smoothly shift scene X so bottom circle touches left screen edge and robot centers in empty space
    currentSceneXRef.current += (targetCamX - currentSceneXRef.current) * 0.08;
    if (sceneGroupRef.current) {
      sceneGroupRef.current.position.x = currentSceneXRef.current;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* Arena Floor Disc with Glowing Perimeter Ring - REMAINS COMPLETELY STATIONARY */}
      <group position={[0, -88, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[480, 64]} />
          <meshStandardMaterial color={0x08090d} roughness={0.85} metalness={0.3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <ringGeometry args={[380, 385, 64]} />
          <meshBasicMaterial color={0xef3340} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 3D Model with Suspense Fallback */}
      <React.Suspense fallback={null}>
        <LawnmowerBot stateRef={stateRef} rotRef={rotRef} />
      </React.Suspense>
    </group>
  );
}

function RobotCanvas({ stateRef }) {
  // Cap DPR to 1.5 to prevent GPU bottleneck on 4K/Retina displays
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
  const [isDraggingState, setIsDraggingState] = useState(false);

  // Dedicated robot rotation state (Only the robot rotates, base floor stays flat and still)
  const rotRef = useRef({
    rotX: 0.14,
    rotY: 0.55,
    targetRotX: 0.14,
    targetRotY: 0.55,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    autoOrbit: true
  });

  const handlePointerDown = (e) => {
    rotRef.current.isDragging = true;
    rotRef.current.lastX = e.clientX;
    rotRef.current.lastY = e.clientY;
    setIsDraggingState(true);
    // Only capture pointer on mouse/pen to allow mobile touch to scroll vertically
    if (e.pointerType !== 'touch') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const handlePointerMove = (e) => {
    if (!rotRef.current.isDragging) return;
    const dx = e.clientX - rotRef.current.lastX;
    const dy = e.clientY - rotRef.current.lastY;
    rotRef.current.lastX = e.clientX;
    rotRef.current.lastY = e.clientY;
    // Horizontal swipe orbits the robot
    rotRef.current.targetRotY += dx * 0.008;
    // Tilt pitch angle only on mouse
    if (e.pointerType !== 'touch') {
      rotRef.current.targetRotX = Math.max(-0.55, Math.min(0.65, rotRef.current.targetRotX + dy * 0.008));
    }
  };

  const handlePointerUp = (e) => {
    rotRef.current.isDragging = false;
    setIsDraggingState(false);
    if (e.pointerType !== 'touch') {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        cursor: isDraggingState ? 'grabbing' : 'grab',
        touchAction: 'pan-y'
      }}
    >
      <Canvas
        camera={{ position: [0, 240, 1080], fov: 36, near: 1, far: 4000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={dpr}
      >
        {/* Authentic Studio Lighting tailored for rich Iron Man candy crimson */}
        <ResponsiveCamera />
        <hemisphereLight skyColor={0xffeedd} groundColor={0x200004} intensity={0.70} />
        <ambientLight color={0xffe6e6} intensity={0.45} />

        <directionalLight color={0xfff2ee} intensity={1.30} position={[50, 240, 700]} />
        <directionalLight color={0xffe0dd} intensity={1.15} position={[340, 480, 380]} />
        <directionalLight color={0xffe8e8} intensity={0.95} position={[-340, 200, 180]} />
        <pointLight color={0xffffff} intensity={1.8} distance={1600} position={[-180, 260, -380]} />
        <pointLight color={0xb8141f} intensity={2.6} distance={1400} position={[220, 180, -320]} />
        <directionalLight color={0xdd1520} intensity={0.75} position={[0, -250, 150]} />

        <React.Suspense fallback={null}>
          <RobotScene stateRef={stateRef} rotRef={rotRef} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

export default React.memo(RobotCanvas);
