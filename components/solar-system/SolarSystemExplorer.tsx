'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface PlanetData {
  name: string;
  size: number;
  distance: number;
  speed: number;
  diameter: string;
  mass: string;
  temp: string;
  dayLength: string;
  yearLength: string;
  moons: number;
  desc: string;
  facts: string[];
  roughness: number;
  metalness: number;
  axialTilt: number;
  atmosphereColor?: string;
  hasRings?: boolean;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
}

interface PlanetUserData extends PlanetData {
  key: string;
  angle: number;
  rotationSpeed: number;
  tilt: number;
  clouds?: THREE.Mesh;
  atmosphere?: THREE.Mesh;
  moon?: THREE.Mesh;
  moonAngle?: number;
}

// Realistic relative sizes (Earth = 1) and distances (scaled for visibility)
const planetDataConfig: Record<string, PlanetData> = {
  mercury: {
    name: 'Mercury',
    size: 0.383,
    distance: 8,
    speed: 0.047,
    diameter: '4,879 km',
    mass: '3.30×10²³ kg',
    temp: '-180°C to 430°C',
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    moons: 0,
    desc: 'The smallest planet in our solar system and closest to the Sun. Mercury has extreme temperature variations and a heavily cratered surface similar to our Moon.',
    facts: [
      'Mercury has no atmosphere to retain heat',
      'A day on Mercury lasts 59 Earth days',
      'Mercury has been visited by only 2 spacecraft'
    ],
    roughness: 1.0,
    metalness: 0.3,
    axialTilt: 0.034,
  },
  venus: {
    name: 'Venus',
    size: 0.949,
    distance: 12,
    speed: 0.035,
    diameter: '12,104 km',
    mass: '4.87×10²⁴ kg',
    temp: '465°C',
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    moons: 0,
    desc: "Often called Earth's sister planet due to similar size and mass. Venus has a thick, toxic atmosphere that traps heat, making it the hottest planet in our solar system.",
    facts: [
      'Venus rotates backwards compared to other planets',
      'A day on Venus is longer than its year',
      'Surface pressure is 90 times that of Earth'
    ],
    roughness: 0.9,
    metalness: 0.1,
    axialTilt: 177.4,
    atmosphereColor: '#ffd27d',
  },
  earth: {
    name: 'Earth',
    size: 1,
    distance: 16,
    speed: 0.029,
    diameter: '12,742 km',
    mass: '5.97×10²⁴ kg',
    temp: '15°C (average)',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    moons: 1,
    desc: 'Our home planet and the only known world to harbor life. Earth is the largest terrestrial planet with a protective atmosphere and abundant liquid water.',
    facts: [
      '71% of Earth\'s surface is covered by water',
      'Earth\'s core is as hot as the Sun\'s surface',
      'Earth is the only planet not named after a god'
    ],
    roughness: 0.6,
    metalness: 0.2,
    axialTilt: 23.44,
    atmosphereColor: '#88ccff',
  },
  mars: {
    name: 'Mars',
    size: 0.532,
    distance: 21,
    speed: 0.024,
    diameter: '6,779 km',
    mass: '6.42×10²³ kg',
    temp: '-60°C (average)',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    moons: 2,
    desc: 'The Red Planet, named for the Roman god of war. Mars has the largest volcano and canyon in the solar system and shows evidence of ancient water flows.',
    facts: [
      'Olympus Mons is the tallest volcano in the solar system',
      'Mars has the largest dust storms in the solar system',
      'Mars has two small moons: Phobos and Deimos'
    ],
    roughness: 1.0,
    metalness: 0.0,
    axialTilt: 25.19,
    atmosphereColor: '#ffaa88',
  },
  jupiter: {
    name: 'Jupiter',
    size: 2.8,
    distance: 32,
    speed: 0.013,
    diameter: '139,820 km',
    mass: '1.90×10²⁷ kg',
    temp: '-110°C',
    dayLength: '9.9 hours',
    yearLength: '11.9 Earth years',
    moons: 95,
    desc: 'The largest planet in our solar system, a gas giant with a mass more than twice that of all other planets combined. Its Great Red Spot is a storm larger than Earth.',
    facts: [
      'The Great Red Spot has been raging for over 400 years',
      'Jupiter has the strongest magnetic field of any planet',
      'Jupiter could fit 1,300 Earths inside it'
    ],
    roughness: 0.7,
    metalness: 0.0,
    axialTilt: 3.13,
    atmosphereColor: '#d4a574',
  },
  saturn: {
    name: 'Saturn',
    size: 2.3,
    distance: 44,
    speed: 0.009,
    diameter: '116,460 km',
    mass: '5.68×10²⁶ kg',
    temp: '-140°C',
    dayLength: '10.7 hours',
    yearLength: '29.5 Earth years',
    moons: 146,
    desc: 'Known for its spectacular ring system made of billions of ice and rock particles. Saturn is the least dense planet and could theoretically float in water.',
    facts: [
      'Saturn\'s rings span up to 282,000 km but are only 10m thick',
      'Saturn is less dense than water',
      'Titan, Saturn\'s moon, has a thick atmosphere'
    ],
    roughness: 0.8,
    metalness: 0.0,
    axialTilt: 26.73,
    hasRings: true,
    ringInnerRadius: 1.5,
    ringOuterRadius: 2.8,
    atmosphereColor: '#f5d7a8',
  },
  uranus: {
    name: 'Uranus',
    size: 1.6,
    distance: 56,
    speed: 0.006,
    diameter: '50,724 km',
    mass: '8.68×10²⁵ kg',
    temp: '-195°C',
    dayLength: '17.2 hours',
    yearLength: '84 Earth years',
    moons: 28,
    desc: 'An ice giant that rotates on its side at nearly 90 degrees. This unique tilt causes extreme seasonal variations lasting over 20 Earth years.',
    facts: [
      'Uranus rotates on its side at 98 degrees',
      'Uranus was the first planet discovered with a telescope',
      'Uranus has faint rings like Saturn'
    ],
    roughness: 0.5,
    metalness: 0.1,
    axialTilt: 97.77,
    atmosphereColor: '#7dd8e8',
    hasRings: true,
    ringInnerRadius: 1.3,
    ringOuterRadius: 1.6,
  },
  neptune: {
    name: 'Neptune',
    size: 1.55,
    distance: 68,
    speed: 0.005,
    diameter: '49,244 km',
    mass: '1.02×10²⁶ kg',
    temp: '-200°C',
    dayLength: '16.1 hours',
    yearLength: '165 Earth years',
    moons: 16,
    desc: 'The windiest planet in our solar system with supersonic winds reaching 2,100 km/h. Neptune was the first planet located through mathematical predictions.',
    facts: [
      'Neptune has the strongest winds in the solar system',
      'Neptune was discovered through mathematical predictions',
      'Neptune\'s moon Triton orbits backwards'
    ],
    roughness: 0.5,
    metalness: 0.1,
    axialTilt: 28.32,
    atmosphereColor: '#5577ff',
  },
};

// High-quality procedural texture generation with noise functions
function noise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

function turbulence(x: number, y: number, size: number): number {
  let value = 0;
  let initialSize = size;
  while (size >= 1) {
    value += noise2D(x / size, y / size) * size;
    size /= 2;
  }
  return value / initialSize;
}

// Mercury - Heavily cratered surface
function createMercuryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base gray-brown surface
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noise = fbm(x * 0.01, y * 0.01, 6);
      const base = 100 + noise * 60;
      const r = Math.floor(base + Math.random() * 20);
      const g = Math.floor(base * 0.95 + Math.random() * 15);
      const b = Math.floor(base * 0.85 + Math.random() * 10);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add craters of various sizes
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 30 + 3;
    
    // Crater rim (lighter)
    const rimGradient = ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius * 1.1);
    rimGradient.addColorStop(0, 'rgba(140, 130, 120, 0)');
    rimGradient.addColorStop(0.7, 'rgba(160, 150, 140, 0.6)');
    rimGradient.addColorStop(1, 'rgba(140, 130, 120, 0)');
    ctx.fillStyle = rimGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Crater floor (darker)
    const floorGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.7);
    floorGradient.addColorStop(0, 'rgba(60, 55, 50, 0.8)');
    floorGradient.addColorStop(0.5, 'rgba(80, 75, 70, 0.6)');
    floorGradient.addColorStop(1, 'rgba(100, 95, 90, 0)');
    ctx.fillStyle = floorGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Venus - Thick cloudy atmosphere with swirling patterns
function createVenusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base yellowish-orange color
  const baseGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  baseGradient.addColorStop(0, '#e8c080');
  baseGradient.addColorStop(0.5, '#ddb870');
  baseGradient.addColorStop(1, '#e8c080');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add swirling cloud bands
  for (let y = 0; y < canvas.height; y += 2) {
    const waveOffset = Math.sin(y * 0.02) * 30 + Math.sin(y * 0.05) * 15;
    for (let x = 0; x < canvas.width; x += 2) {
      const t = turbulence(x + waveOffset, y, 64);
      const brightness = 0.7 + t * 0.3;
      const r = Math.floor(232 * brightness);
      const g = Math.floor(192 * brightness);
      const b = Math.floor(112 * brightness);
      ctx.fillStyle = `rgba(${r},${g},${b},0.5)`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Add atmospheric streaks
  for (let i = 0; i < 100; i++) {
    const y = Math.random() * canvas.height;
    const width = Math.random() * canvas.width * 0.8 + canvas.width * 0.2;
    const height = Math.random() * 20 + 5;
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, 'rgba(255, 220, 150, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 220, 150, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 220, 150, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, y, width, height);
  }

  return new THREE.CanvasTexture(canvas);
}

// Earth - Realistic continents, oceans, and clouds
function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Ocean base with depth variation
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const depth = fbm(x * 0.005, y * 0.005, 4);
      const r = Math.floor(20 + depth * 30);
      const g = Math.floor(60 + depth * 40);
      const b = Math.floor(120 + depth * 60);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Simplified continents
  const continents = [
    { x: 1024, y: 350, w: 300, h: 200, name: 'NorthAmerica' },
    { x: 1100, y: 550, w: 180, h: 250, name: 'SouthAmerica' },
    { x: 1600, y: 350, w: 400, h: 300, name: 'Eurasia' },
    { x: 1650, y: 600, w: 200, h: 200, name: 'Africa' },
    { x: 400, y: 650, w: 250, h: 180, name: 'Australia' },
    { x: 1024, y: 900, w: 800, h: 120, name: 'Antarctica' },
  ];

  continents.forEach(cont => {
    // Draw irregular landmass
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    const points = 24;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const r = (cont.w / 2) * (0.6 + fbm(cont.x + i * 10, cont.y + i * 10, 3) * 0.8);
      const px = cont.x + Math.cos(angle) * r;
      const py = cont.y + Math.sin(angle) * r * (cont.h / cont.w);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Add terrain variation
    for (let i = 0; i < 500; i++) {
      const px = cont.x + (Math.random() - 0.5) * cont.w;
      const py = cont.y + (Math.random() - 0.5) * cont.h;
      const terrain = Math.random();
      if (terrain > 0.7) {
        ctx.fillStyle = 'rgba(60, 100, 40, 0.5)'; // Forest
      } else if (terrain > 0.4) {
        ctx.fillStyle = 'rgba(80, 120, 50, 0.3)'; // Plains
      } else {
        ctx.fillStyle = 'rgba(139, 119, 101, 0.4)'; // Mountains
      }
      ctx.fillRect(px, py, 4, 4);
    }
  });

  // Ice caps
  const iceGradientNorth = ctx.createLinearGradient(0, 0, 0, 100);
  iceGradientNorth.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  iceGradientNorth.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = iceGradientNorth;
  ctx.fillRect(0, 0, canvas.width, 100);

  const iceGradientSouth = ctx.createLinearGradient(0, canvas.height - 80, 0, canvas.height);
  iceGradientSouth.addColorStop(0, 'rgba(255, 255, 255, 0)');
  iceGradientSouth.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
  ctx.fillStyle = iceGradientSouth;
  ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

  return new THREE.CanvasTexture(canvas);
}

// Mars - Red desert with polar caps and geological features
function createMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base rusty red surface
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noise = fbm(x * 0.008, y * 0.008, 5);
      const r = Math.floor(180 + noise * 60);
      const g = Math.floor(80 + noise * 40);
      const b = Math.floor(50 + noise * 30);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add geological features - Valles Marineris
  ctx.strokeStyle = 'rgba(100, 40, 30, 0.8)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(600, 500);
  ctx.bezierCurveTo(800, 480, 1000, 520, 1200, 510);
  ctx.stroke();

  // Olympus Mons (volcano)
  const volcanoGradient = ctx.createRadialGradient(400, 400, 0, 400, 400, 100);
  volcanoGradient.addColorStop(0, 'rgba(120, 60, 40, 0.9)');
  volcanoGradient.addColorStop(0.5, 'rgba(160, 80, 50, 0.6)');
  volcanoGradient.addColorStop(1, 'rgba(180, 90, 60, 0)');
  ctx.fillStyle = volcanoGradient;
  ctx.beginPath();
  ctx.arc(400, 400, 100, 0, Math.PI * 2);
  ctx.fill();

  // Polar ice caps
  const northPolar = ctx.createRadialGradient(canvas.width / 2, 0, 0, canvas.width / 2, 0, 200);
  northPolar.addColorStop(0, 'rgba(255, 250, 245, 0.95)');
  northPolar.addColorStop(0.5, 'rgba(255, 240, 230, 0.6)');
  northPolar.addColorStop(1, 'rgba(255, 230, 220, 0)');
  ctx.fillStyle = northPolar;
  ctx.fillRect(0, 0, canvas.width, 150);

  const southPolar = ctx.createRadialGradient(canvas.width / 2, canvas.height, 0, canvas.width / 2, canvas.height, 150);
  southPolar.addColorStop(0, 'rgba(255, 250, 245, 0.9)');
  southPolar.addColorStop(0.5, 'rgba(255, 240, 230, 0.5)');
  southPolar.addColorStop(1, 'rgba(255, 230, 220, 0)');
  ctx.fillStyle = southPolar;
  ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

  // Add dust storms
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = 200 + Math.random() * 600;
    const size = Math.random() * 80 + 30;
    const stormGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    stormGradient.addColorStop(0, 'rgba(220, 160, 120, 0.4)');
    stormGradient.addColorStop(1, 'rgba(220, 160, 120, 0)');
    ctx.fillStyle = stormGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Jupiter - Gas giant with bands and Great Red Spot
function createJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Create horizontal bands
  const bandColors = [
    '#d4a574', '#c88b3a', '#e8c4a0', '#b8894d', '#d4a574',
    '#c9a670', '#ddb070', '#c88b3a', '#e8c4a0', '#d4a574',
    '#b8894d', '#c9a670', '#ddb070', '#c88b3a', '#e8c4a0'
  ];

  let y = 0;
  bandColors.forEach((color, index) => {
    const bandHeight = 60 + Math.random() * 40;
    
    // Main band color
    ctx.fillStyle = color;
    ctx.fillRect(0, y, canvas.width, bandHeight);
    
    // Add turbulence to bands
    for (let py = y; py < y + bandHeight; py += 2) {
      for (let px = 0; px < canvas.width; px += 2) {
        const turb = turbulence(px + index * 100, py, 32);
        const alpha = turb * 0.3;
        ctx.fillStyle = `rgba(${index % 2 === 0 ? 255 : 200}, ${180 + turb * 50}, ${100 + turb * 50}, ${alpha})`;
        ctx.fillRect(px, py, 2, 2);
      }
    }
    
    y += bandHeight;
  });

  // Great Red Spot
  const spotX = canvas.width * 0.3;
  const spotY = canvas.height * 0.55;
  
  // Outer swirl
  for (let ring = 0; ring < 5; ring++) {
    ctx.strokeStyle = `rgba(${180 - ring * 20}, ${60 - ring * 10}, ${40}, ${0.8 - ring * 0.1})`;
    ctx.lineWidth = 15 - ring * 2;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, 90 - ring * 10, 55 - ring * 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Center of the spot
  const spotGradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 70);
  spotGradient.addColorStop(0, 'rgba(200, 80, 50, 0.9)');
  spotGradient.addColorStop(0.5, 'rgba(180, 60, 40, 0.8)');
  spotGradient.addColorStop(1, 'rgba(160, 50, 30, 0)');
  ctx.fillStyle = spotGradient;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 70, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Saturn - Pale gold with subtle bands
function createSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base pale gold
  const baseGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  baseGradient.addColorStop(0, '#e8d5a5');
  baseGradient.addColorStop(0.5, '#f5e0b0');
  baseGradient.addColorStop(1, '#e8d5a5');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle horizontal bands
  for (let y = 0; y < canvas.height; y += 25) {
    const bandAlpha = 0.1 + Math.random() * 0.15;
    const bandColor = Math.random() > 0.5 ? 'rgba(200, 180, 140,' : 'rgba(240, 220, 180,';
    ctx.fillStyle = bandColor + bandAlpha + ')';
    
    const bandHeight = 20 + Math.random() * 15;
    ctx.fillRect(0, y, canvas.width, bandHeight);
    
    // Add slight turbulence
    for (let x = 0; x < canvas.width; x += 4) {
      const offset = Math.sin(x * 0.01 + y * 0.1) * 5;
      ctx.fillStyle = `rgba(${220 + Math.random() * 30}, ${200 + Math.random() * 20}, ${160 + Math.random() * 20}, 0.2)`;
      ctx.fillRect(x, y + offset, 4, 4);
    }
  }

  // Add polar darkening
  const northPolar = ctx.createLinearGradient(0, 0, 0, 150);
  northPolar.addColorStop(0, 'rgba(180, 160, 120, 0.4)');
  northPolar.addColorStop(1, 'rgba(180, 160, 120, 0)');
  ctx.fillStyle = northPolar;
  ctx.fillRect(0, 0, canvas.width, 150);

  return new THREE.CanvasTexture(canvas);
}

// Uranus - Pale cyan/blue-green
function createUranusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base cyan-green gradient
  const baseGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  baseGradient.addColorStop(0, '#a8e8e8');
  baseGradient.addColorStop(0.5, '#7dd8e8');
  baseGradient.addColorStop(1, '#5bc8d8');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Very subtle bands
  for (let y = 0; y < canvas.height; y += 40) {
    const alpha = 0.05 + Math.random() * 0.1;
    ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${220 + Math.random() * 35}, ${230 + Math.random() * 25}, ${alpha})`;
    ctx.fillRect(0, y, canvas.width, 30 + Math.random() * 20);
  }

  // Add methane cloud patterns
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 60 + 20;
    const cloudGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    cloudGradient.addColorStop(0, 'rgba(200, 240, 245, 0.3)');
    cloudGradient.addColorStop(1, 'rgba(200, 240, 245, 0)');
    ctx.fillStyle = cloudGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Neptune - Deep blue with storm features
function createNeptuneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Deep blue base
  const baseGradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  baseGradient.addColorStop(0, '#4477cc');
  baseGradient.addColorStop(0.5, '#3366bb');
  baseGradient.addColorStop(1, '#2255aa');
  ctx.fillStyle = baseGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Atmospheric bands
  for (let y = 0; y < canvas.height; y += 35) {
    const waveOffset = Math.sin(y * 0.015) * 20;
    for (let x = 0; x < canvas.width; x += 3) {
      const t = turbulence(x + waveOffset, y, 48);
      const alpha = 0.1 + t * 0.2;
      ctx.fillStyle = `rgba(${80 + t * 60}, ${120 + t * 60}, ${200 + t * 55}, ${alpha})`;
      ctx.fillRect(x, y, 3, 30);
    }
  }

  // Great Dark Spot
  const spotX = canvas.width * 0.6;
  const spotY = canvas.height * 0.45;
  const spotGradient = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 60);
  spotGradient.addColorStop(0, 'rgba(30, 50, 100, 0.8)');
  spotGradient.addColorStop(0.5, 'rgba(40, 60, 120, 0.5)');
  spotGradient.addColorStop(1, 'rgba(50, 80, 150, 0)');
  ctx.fillStyle = spotGradient;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 70, 45, Math.PI / 8, 0, Math.PI * 2);
  ctx.fill();

  // White cloud streaks
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const width = Math.random() * 150 + 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3 + Math.random() * 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + width * 0.3, y - 20,
      x + width * 0.7, y + 20,
      x + width, y
    );
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// Earth clouds - Realistic cloud patterns
function createCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Generate cloud patterns using noise
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const noise = fbm(x * 0.003, y * 0.003, 6);
      if (noise > 0.45) {
        const alpha = Math.min((noise - 0.45) * 3, 0.9);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  // Add some wispy clouds
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 80 + 30;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Sun texture with dynamic surface features
function createSunTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base solar surface
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noise = fbm(x * 0.01, y * 0.01, 4);
      const r = Math.floor(255);
      const g = Math.floor(180 + noise * 75);
      const b = Math.floor(50 + noise * 50);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add granulation pattern
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 10 + 3;
    const brightness = Math.random();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(255, ${200 + brightness * 55}, ${80 + brightness * 40}, 0.6)`);
    gradient.addColorStop(1, `rgba(255, ${150 + brightness * 50}, ${30 + brightness * 30}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add sunspots
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = 200 + Math.random() * (canvas.height - 400);
    const size = Math.random() * 40 + 15;
    
    // Umbra (dark center)
    const umbraGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 0.4);
    umbraGradient.addColorStop(0, 'rgba(80, 40, 20, 0.9)');
    umbraGradient.addColorStop(1, 'rgba(120, 60, 30, 0)');
    ctx.fillStyle = umbraGradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Penumbra (lighter ring)
    const penumbraGradient = ctx.createRadialGradient(x, y, size * 0.3, x, y, size);
    penumbraGradient.addColorStop(0, 'rgba(140, 80, 40, 0.6)');
    penumbraGradient.addColorStop(1, 'rgba(200, 120, 60, 0)');
    ctx.fillStyle = penumbraGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add solar flares/prominences at edges
  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const x = canvas.width / 2 + Math.cos(angle) * (canvas.width * 0.4);
    const y = canvas.height / 2 + Math.sin(angle) * (canvas.height * 0.4);
    const size = Math.random() * 60 + 20;
    const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    flareGradient.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
    flareGradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.4)');
    flareGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = flareGradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// Saturn's rings with realistic banding
function createRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Ring structure from inner to outer
  const ringBands = [
    { start: 0, end: 0.15, color: [180, 160, 130], alpha: 0.3 }, // D Ring
    { start: 0.15, end: 0.25, color: [200, 180, 150], alpha: 0.6 }, // C Ring
    { start: 0.25, end: 0.28, color: [0, 0, 0], alpha: 0 }, // Colombo Gap
    { start: 0.28, end: 0.55, color: [220, 200, 170], alpha: 0.9 }, // B Ring
    { start: 0.55, end: 0.6, color: [0, 0, 0], alpha: 0 }, // Cassini Division
    { start: 0.6, end: 0.85, color: [200, 180, 150], alpha: 0.7 }, // A Ring
    { start: 0.85, end: 0.87, color: [0, 0, 0], alpha: 0 }, // Encke Gap
    { start: 0.87, end: 1.0, color: [180, 160, 140], alpha: 0.4 }, // F Ring
  ];

  for (let x = 0; x < canvas.width; x++) {
    const pos = x / canvas.width;
    
    for (const band of ringBands) {
      if (pos >= band.start && pos < band.end) {
        const noise = Math.random() * 0.2 + 0.9;
        const r = Math.floor(band.color[0] * noise);
        const g = Math.floor(band.color[1] * noise);
        const b = Math.floor(band.color[2] * noise);
        const alpha = band.alpha * (0.8 + Math.random() * 0.4);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillRect(x, 0, 1, canvas.height);
        break;
      }
    }
  }

  // Add radial striations
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

// Uranus rings (faint)
function createUranusRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  for (let x = 0; x < canvas.width; x++) {
    const pos = x / canvas.width;
    let alpha = 0;
    
    // Uranus has 13 known rings
    const ringPositions = [0.3, 0.35, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95];
    
    for (const ringPos of ringPositions) {
      const distance = Math.abs(pos - ringPos);
      if (distance < 0.02) {
        alpha = Math.max(alpha, (1 - distance / 0.02) * 0.3);
      }
    }
    
    if (alpha > 0) {
      ctx.fillStyle = `rgba(150, 140, 130, ${alpha})`;
      ctx.fillRect(x, 0, 1, canvas.height);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

// Moon texture
function createMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Gray lunar surface
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noise = fbm(x * 0.02, y * 0.02, 4);
      const gray = Math.floor(120 + noise * 60);
      ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray * 0.95})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Add craters
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 15 + 2;
    
    // Crater shadow
    const craterGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    craterGradient.addColorStop(0, 'rgba(60, 60, 65, 0.8)');
    craterGradient.addColorStop(0.7, 'rgba(100, 100, 105, 0.4)');
    craterGradient.addColorStop(1, 'rgba(140, 140, 145, 0)');
    ctx.fillStyle = craterGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add mare (dark areas)
  const marePositions = [
    { x: 150, y: 100, r: 60 },
    { x: 300, y: 150, r: 80 },
    { x: 400, y: 80, r: 50 },
  ];
  
  marePositions.forEach(mare => {
    const mareGradient = ctx.createRadialGradient(mare.x, mare.y, 0, mare.x, mare.y, mare.r);
    mareGradient.addColorStop(0, 'rgba(70, 70, 75, 0.6)');
    mareGradient.addColorStop(1, 'rgba(100, 100, 105, 0)');
    ctx.fillStyle = mareGradient;
    ctx.beginPath();
    ctx.arc(mare.x, mare.y, mare.r, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}

// Asteroid texture for asteroid belt
function createAsteroidTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const noise = Math.random();
      const gray = Math.floor(80 + noise * 80);
      ctx.fillStyle = `rgb(${gray}, ${gray * 0.9}, ${gray * 0.85})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

export default function SolarSystemExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const speedMultiplierRef = useRef(1.0);
  const hoveredPlanetRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const targetCameraPositionRef = useRef<THREE.Vector3 | null>(null);
  const clockRef = useRef(new THREE.Clock());

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [speedDisplay, setSpeedDisplay] = useState('1.0x');
  const [cameraDistance, setCameraDistance] = useState(75.0);
  const [hoveredPlanetName, setHoveredPlanetName] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
  const [showOrbits, setShowOrbits] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);

  // Create enhanced starfield with nebula effects
  const createStarfield = useCallback((scene: THREE.Scene) => {
    // Main starfield - distant stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const starsVertices: number[] = [];
    const starsColors: number[] = [];

    for (let i = 0; i < 30000; i++) {
      const x = (Math.random() - 0.5) * 3000;
      const y = (Math.random() - 0.5) * 3000;
      const z = (Math.random() - 0.5) * 3000;
      starsVertices.push(x, y, z);
      
      // Add color variation (white, blue-white, yellow, orange)
      const colorType = Math.random();
      if (colorType > 0.95) {
        starsColors.push(1, 0.8, 0.6); // Orange giant
      } else if (colorType > 0.85) {
        starsColors.push(1, 1, 0.8); // Yellow star
      } else if (colorType > 0.7) {
        starsColors.push(0.8, 0.9, 1); // Blue-white
      } else {
        starsColors.push(1, 1, 1); // White
      }
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    starsMaterial.vertexColors = true;
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Add brighter individual stars
    for (let i = 0; i < 200; i++) {
      const starSize = Math.random() * 1.5 + 0.3;
      const starGeo = new THREE.SphereGeometry(starSize, 8, 8);
      const brightness = Math.random();
      const hue = Math.random() > 0.7 ? 0.1 : 0.6; // Some warm, some cool
      const starMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.2, 0.7 + brightness * 0.3),
        transparent: true,
        opacity: 0.6 + brightness * 0.4,
      });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
      );
      scene.add(star);
    }

    // Add subtle nebula/galaxy background
    const nebulaColors = [
      { color: 0x4466aa, x: -800, y: 400, z: -1000 },
      { color: 0x664488, x: 600, y: -300, z: -900 },
      { color: 0x446688, x: 200, y: 600, z: -800 },
    ];

    nebulaColors.forEach(nebula => {
      const nebulaGeo = new THREE.SphereGeometry(300, 32, 32);
      const nebulaMat = new THREE.MeshBasicMaterial({
        color: nebula.color,
        transparent: true,
        opacity: 0.03,
        side: THREE.BackSide,
      });
      const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
      nebulaMesh.position.set(nebula.x, nebula.y, nebula.z);
      nebulaMesh.scale.set(2, 1.5, 1);
      scene.add(nebulaMesh);
    });

    setLoadingProgress(20);
  }, []);

  // Create the Sun with glow effects
  const createSun = useCallback((scene: THREE.Scene) => {
    const sunGeometry = new THREE.SphereGeometry(5, 128, 128);
    const sunTexture = createSunTexture();
    
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xffffee,
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    sunRef.current = sun;

    // Main sun light - high intensity with physical decay
    const sunLight = new THREE.PointLight(0xffffff, 8, 600);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 600;
    sunLight.decay = 1.5; // Realistic light falloff but not too aggressive
    sun.add(sunLight);

    // Secondary warm light for golden glow
    const warmLight = new THREE.PointLight(0xffcc66, 4, 400);
    warmLight.decay = 1.5;
    sun.add(warmLight);

    // Tertiary softer fill light for outer planets
    const outerFillLight = new THREE.PointLight(0xffeedd, 2, 800);
    outerFillLight.decay = 1.0; // Less decay to reach outer planets
    sun.add(outerFillLight);

    // Corona/Glow layers
    const glowLayers = [
      { size: 6, opacity: 0.15, color: 0xffff88 },
      { size: 7, opacity: 0.1, color: 0xffaa44 },
      { size: 8.5, opacity: 0.06, color: 0xff8822 },
      { size: 10, opacity: 0.03, color: 0xff6600 },
      { size: 12, opacity: 0.015, color: 0xff4400 },
    ];

    glowLayers.forEach(layer => {
      const glowGeometry = new THREE.SphereGeometry(layer.size, 64, 64);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      sun.add(glow);
    });

    // Add lens flare effect using sprites
    const flareTexture = createLensFlareTexture();
    const flareMaterial = new THREE.SpriteMaterial({
      map: flareTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const flare = new THREE.Sprite(flareMaterial);
    flare.scale.set(20, 20, 1);
    sun.add(flare);

    setLoadingProgress(40);
  }, []);

  // Create lens flare texture
  const createLensFlareTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 220, 150, 0.8)');
    gradient.addColorStop(0.3, 'rgba(255, 180, 100, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 50, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Add rays
    ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(128, 128);
      ctx.lineTo(128 + Math.cos(angle) * 120, 128 + Math.sin(angle) * 120);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const getTextureForPlanet = useCallback((key: string) => {
    switch (key) {
      case 'mercury': return createMercuryTexture();
      case 'venus': return createVenusTexture();
      case 'earth': return createEarthTexture();
      case 'mars': return createMarsTexture();
      case 'jupiter': return createJupiterTexture();
      case 'saturn': return createSaturnTexture();
      case 'uranus': return createUranusTexture();
      case 'neptune': return createNeptuneTexture();
      default: return createEarthTexture();
    }
  }, []);

  // Create planets with atmospheres, moons, and rings
  const createPlanets = useCallback((scene: THREE.Scene) => {
    const planets: THREE.Mesh[] = [];
    const orbitsGroup = new THREE.Group();
    orbitsGroup.name = 'orbits';
    scene.add(orbitsGroup);

    Object.keys(planetDataConfig).forEach((key, index) => {
      const data = planetDataConfig[key];
      const planetGeometry = new THREE.SphereGeometry(data.size, 128, 128);
      const colorMap = getTextureForPlanet(key);

      const planetMaterial = new THREE.MeshStandardMaterial({
        map: colorMap,
        roughness: Math.max(0.3, data.roughness * 0.8), // Reduce roughness for better light reflection
        metalness: Math.min(0.4, data.metalness + 0.1), // Slight metalness for specularity
        emissive: new THREE.Color(0x111111), // Subtle self-illumination
        emissiveIntensity: 0.05, // Very subtle to not look unrealistic
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.castShadow = true;
      planet.receiveShadow = true;

      const userData: PlanetUserData = {
        key,
        ...data,
        angle: (index / 8) * Math.PI * 2 + Math.random() * 0.5,
        rotationSpeed: 0.003 + Math.random() * 0.002,
        tilt: data.axialTilt * (Math.PI / 180),
        moonAngle: 0,
      };

      planet.userData = userData;
      planet.rotation.z = userData.tilt;

      // Add atmosphere for planets with atmosphereColor
      if (data.atmosphereColor) {
        const atmosphereGeometry = new THREE.SphereGeometry(data.size * 1.02, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: data.atmosphereColor,
          transparent: true,
          opacity: 0.15,
          side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
        (planet.userData as PlanetUserData).atmosphere = atmosphere;
      }

      // Add clouds for Earth
      if (key === 'earth') {
        const cloudGeometry = new THREE.SphereGeometry(data.size * 1.015, 64, 64);
        const cloudTexture = createCloudTexture();
        const cloudMaterial = new THREE.MeshStandardMaterial({
          map: cloudTexture,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        planet.add(clouds);
        (planet.userData as PlanetUserData).clouds = clouds;

        // Add Moon
        const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
        const moonTexture = createMoonTexture();
        const moonMaterial = new THREE.MeshStandardMaterial({
          map: moonTexture,
          roughness: 1.0,
          metalness: 0.0,
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(2.5, 0, 0);
        planet.add(moon);
        (planet.userData as PlanetUserData).moon = moon;
      }

      // Add rings for Saturn and Uranus
      if (data.hasRings && data.ringInnerRadius && data.ringOuterRadius) {
        const ringGeometry = new THREE.RingGeometry(
          data.size * data.ringInnerRadius,
          data.size * data.ringOuterRadius,
          128
        );
        
        // Fix ring UV mapping
        const pos = ringGeometry.attributes.position;
        const uv = ringGeometry.attributes.uv;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          const u = (v3.length() - data.size * data.ringInnerRadius) / 
                    (data.size * (data.ringOuterRadius - data.ringInnerRadius));
          uv.setXY(i, u, 1);
        }
        
        const ringTexture = key === 'saturn' ? createRingTexture() : createUranusRingTexture();
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: key === 'saturn' ? 0.9 : 0.4,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.castShadow = true;
        ring.receiveShadow = true;
        planet.add(ring);
      }

      planets.push(planet);
      scene.add(planet);

      // Create orbit path
      const orbitGeometry = new THREE.RingGeometry(data.distance - 0.08, data.distance + 0.08, 256);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.12,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      orbitsGroup.add(orbit);
    });

    planetsRef.current = planets;

    // Create asteroid belt between Mars and Jupiter
    createAsteroidBelt(scene);

    setLoadingProgress(70);
  }, [getTextureForPlanet]);

  // Create asteroid belt
  const createAsteroidBelt = useCallback((scene: THREE.Scene) => {
    const asteroidCount = 1500;
    const asteroidGeometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const sizes: number[] = [];

    const innerRadius = 25;
    const outerRadius = 30;

    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const height = (Math.random() - 0.5) * 2;

      positions.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      sizes.push(Math.random() * 0.3 + 0.1);
    }

    asteroidGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    asteroidGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const asteroidMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const asteroidBelt = new THREE.Points(asteroidGeometry, asteroidMaterial);
    asteroidBelt.name = 'asteroidBelt';
    scene.add(asteroidBelt);
  }, []);

  // Setup lighting
  const setupLighting = useCallback((scene: THREE.Scene) => {
    // Ambient light for base visibility - keeps planets visible in shadow
    const ambientLight = new THREE.AmbientLight(0x222233, 0.4);
    scene.add(ambientLight);

    // Hemisphere light for subtle environmental lighting
    const hemisphereLight = new THREE.HemisphereLight(0x4466cc, 0x332211, 0.3);
    scene.add(hemisphereLight);

    // Front fill light - soft directional light from camera area
    const frontFill = new THREE.DirectionalLight(0x8899bb, 0.3);
    frontFill.position.set(50, 50, 100);
    scene.add(frontFill);

    // Back rim light - subtle light from behind for edge definition
    const rimLight = new THREE.DirectionalLight(0x446688, 0.2);
    rimLight.position.set(-50, 20, -80);
    scene.add(rimLight);

    // Top fill for better visibility from above
    const topFill = new THREE.DirectionalLight(0x6677aa, 0.15);
    topFill.position.set(0, 100, 0);
    scene.add(topFill);

    setLoadingProgress(80);
  }, []);

  // Reset camera view
  const resetView = useCallback(() => {
    if (cameraRef.current) {
      targetCameraPositionRef.current = new THREE.Vector3(0, 40, 75);
      setCameraDistance(75.0);
      setSelectedPlanet(null);
    }
  }, []);

  // Focus on specific planet
  const focusOnPlanet = useCallback((planet: THREE.Mesh) => {
    if (cameraRef.current) {
      const userData = planet.userData as PlanetUserData;
      const distance = userData.size * 8 + 5;
      const offset = new THREE.Vector3(distance, distance * 0.5, distance);
      targetCameraPositionRef.current = planet.position.clone().add(offset);
    }
  }, []);

  // Toggle simulation speed
  const toggleSpeed = useCallback(() => {
    const speeds = [0.5, 1.0, 2.0, 5.0, 10.0];
    const currentIndex = speeds.indexOf(speedMultiplierRef.current);
    const nextIndex = (currentIndex + 1) % speeds.length;
    speedMultiplierRef.current = speeds[nextIndex];
    setSpeedDisplay(speeds[nextIndex].toFixed(1) + 'x');
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Toggle orbit visibility
  const toggleOrbits = useCallback(() => {
    setShowOrbits(prev => {
      if (sceneRef.current) {
        const orbits = sceneRef.current.getObjectByName('orbits');
        if (orbits) orbits.visible = !prev;
      }
      return !prev;
    });
  }, []);

  // Cycle through facts
  const cycleFact = useCallback(() => {
    if (selectedPlanet && selectedPlanet.facts) {
      setCurrentFact(prev => (prev + 1) % selectedPlanet.facts.length);
    }
  }, [selectedPlanet]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000005, 0.0003);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      3000
    );
    camera.position.set(0, 40, 75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Initialize renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6; // Increased exposure for brighter planets
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create scene elements
    createStarfield(scene);
    createSun(scene);
    createPlanets(scene);
    setupLighting(scene);
    setLoadingProgress(100);

    // Event handlers
    const onWindowResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        // Smooth camera rotation
        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.003);
        camera.position.applyQuaternion(rotationQuaternion);

        const axis = new THREE.Vector3();
        axis.crossVectors(camera.up, camera.position).normalize();
        
        // Limit vertical rotation
        const currentAngle = Math.acos(camera.position.clone().normalize().dot(new THREE.Vector3(0, 1, 0)));
        const newDelta = deltaY * 0.003;
        if ((currentAngle > 0.3 || newDelta < 0) && (currentAngle < 2.8 || newDelta > 0)) {
          rotationQuaternion.setFromAxisAngle(axis, newDelta);
          camera.position.applyQuaternion(rotationQuaternion);
        }

        camera.lookAt(0, 0, 0);
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

        setHoveredPlanetName(null);
        hoveredPlanetRef.current = null;
      } else {
        // Raycast for planet hover
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(planetsRef.current);

        if (intersects.length > 0) {
          const planet = intersects[0].object as THREE.Mesh;
          hoveredPlanetRef.current = planet;

          const vector = planet.position.clone();
          vector.project(camera);

          const x = (vector.x * 0.5 + 0.5) * rect.width;
          const y = (vector.y * -0.5 + 0.5) * rect.height;

          setMarkerPosition({ x, y });
          setHoveredPlanetName((planet.userData as PlanetUserData).name);
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredPlanetName(null);
          hoveredPlanetRef.current = null;
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      renderer.domElement.style.cursor = hoveredPlanetRef.current ? 'pointer' : 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const distance = camera.position.length();
      const adaptiveSpeed = 0.02 + distance / 1500;
      const zoomSpeed = Math.min(adaptiveSpeed, 0.06);
      const direction = e.deltaY > 0 ? 1 : -1;
      const zoomFactor = 1 + direction * zoomSpeed;
      const newDistance = distance * zoomFactor;

      const minDistance = 10;
      const maxDistance = 250;

      if (newDistance >= minDistance && newDistance <= maxDistance) {
        camera.position.multiplyScalar(zoomFactor);
      } else if (newDistance < minDistance) {
        camera.position.normalize().multiplyScalar(minDistance);
      } else if (newDistance > maxDistance) {
        camera.position.normalize().multiplyScalar(maxDistance);
      }

      setCameraDistance(camera.position.length());
    };

    const onClick = (e: MouseEvent) => {
      if (!isDraggingRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(planetsRef.current);

        if (intersects.length > 0) {
          const planet = intersects[0].object as THREE.Mesh;
          const userData = planet.userData as PlanetUserData;
          // Validate userData has required properties
          if (userData && userData.name && typeof userData.distance === 'number') {
            setSelectedPlanet({
              name: userData.name,
              size: userData.size,
              distance: userData.distance,
              speed: userData.speed,
              diameter: userData.diameter,
              mass: userData.mass,
              temp: userData.temp,
              dayLength: userData.dayLength,
              yearLength: userData.yearLength,
              moons: userData.moons,
              desc: userData.desc,
              facts: userData.facts,
              roughness: userData.roughness,
              metalness: userData.metalness,
              axialTilt: userData.axialTilt,
            });
            setCurrentFact(0);
            focusOnPlanet(planet);
          }
        }
      }
    };

    // Touch event handlers for mobile
    let lastTouchDistance = 0;
    let lastTouchPosition = { x: 0, y: 0 };
    let isTouchDragging = false;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        isTouchDragging = true;
        lastTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1 && isTouchDragging) {
        const deltaX = e.touches[0].clientX - lastTouchPosition.x;
        const deltaY = e.touches[0].clientY - lastTouchPosition.y;

        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * 0.003);
        camera.position.applyQuaternion(rotationQuaternion);

        const axis = new THREE.Vector3();
        axis.crossVectors(camera.up, camera.position).normalize();
        rotationQuaternion.setFromAxisAngle(axis, deltaY * 0.003);
        camera.position.applyQuaternion(rotationQuaternion);

        camera.lookAt(0, 0, 0);
        lastTouchPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delta = distance - lastTouchDistance;

        const zoomFactor = 1 - delta * 0.003;
        const newDistance = camera.position.length() * zoomFactor;

        if (newDistance >= 10 && newDistance <= 250) {
          camera.position.multiplyScalar(zoomFactor);
          setCameraDistance(camera.position.length());
        }

        lastTouchDistance = distance;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      isTouchDragging = false;
      
      // Detect tap for planet selection
      if (e.changedTouches.length === 1 && containerRef.current) {
        const touch = e.changedTouches[0];
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const intersects = raycasterRef.current.intersectObjects(planetsRef.current);

        if (intersects.length > 0) {
          const planet = intersects[0].object as THREE.Mesh;
          const userData = planet.userData as PlanetUserData;
          // Validate userData has required properties
          if (userData && userData.name && typeof userData.distance === 'number') {
            setSelectedPlanet({
              name: userData.name,
              size: userData.size,
              distance: userData.distance,
              speed: userData.speed,
              diameter: userData.diameter,
              mass: userData.mass,
              temp: userData.temp,
              dayLength: userData.dayLength,
              yearLength: userData.yearLength,
              moons: userData.moons,
              desc: userData.desc,
              facts: userData.facts,
              roughness: userData.roughness,
              metalness: userData.metalness,
              axialTilt: userData.axialTilt,
            });
            setCurrentFact(0);
          }
        }
      }
    };

    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('touchend', onTouchEnd);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      // Rotate sun
      if (sunRef.current) {
        sunRef.current.rotation.y += 0.0003;
      }

      // Animate planets
      if (!isPaused) {
        planetsRef.current.forEach((planet) => {
          const userData = planet.userData as PlanetUserData;
          
          // Orbital motion
          userData.angle += userData.speed * speedMultiplierRef.current * 0.0008;
          planet.position.x = Math.cos(userData.angle) * userData.distance;
          planet.position.z = Math.sin(userData.angle) * userData.distance;
          
          // Rotation
          planet.rotation.y += userData.rotationSpeed * speedMultiplierRef.current;

          // Animate clouds
          if (userData.clouds) {
            userData.clouds.rotation.y += userData.rotationSpeed * 1.3 * speedMultiplierRef.current;
          }

          // Animate moon
          if (userData.moon && userData.moonAngle !== undefined) {
            userData.moonAngle += 0.02 * speedMultiplierRef.current;
            userData.moon.position.x = Math.cos(userData.moonAngle) * 2.5;
            userData.moon.position.z = Math.sin(userData.moonAngle) * 2.5;
            userData.moon.rotation.y += 0.01;
          }
        });

        // Rotate asteroid belt slowly
        const asteroidBelt = scene.getObjectByName('asteroidBelt');
        if (asteroidBelt) {
          asteroidBelt.rotation.y += 0.0001 * speedMultiplierRef.current;
        }
      }

      // Smooth camera transition
      if (targetCameraPositionRef.current) {
        camera.position.lerp(targetCameraPositionRef.current, 0.03);
        camera.lookAt(0, 0, 0);
        
        if (camera.position.distanceTo(targetCameraPositionRef.current) < 0.1) {
          targetCameraPositionRef.current = null;
        }
        setCameraDistance(camera.position.length());
      }

      // Update hovered planet marker position
      if (hoveredPlanetRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vector = hoveredPlanetRef.current.position.clone();
        vector.project(camera);

        const x = (vector.x * 0.5 + 0.5) * rect.width;
        const y = (vector.y * -0.5 + 0.5) * rect.height;

        setMarkerPosition({ x, y });
      }

      renderer.render(scene, camera);
    };

    // Start loading and animation
    setTimeout(() => setIsLoading(false), 2000);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('touchend', onTouchEnd);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [createStarfield, createSun, createPlanets, setupLighting, focusOnPlanet, isPaused]);

  return (
    <div className="relative w-full h-[85vh] min-h-[650px] bg-black rounded-xl overflow-hidden shadow-2xl">
      {/* Loading Screen */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#000510] to-black flex flex-col items-center justify-center z-50">
          <div className="relative w-24 h-24 mb-8">
            {/* Orbital loading animation */}
            <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
            <div className="absolute inset-2 border-2 border-cyan-500/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 border-2 border-cyan-400/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 border-2 border-cyan-300/50 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(255,200,0,0.8)]" />
            </div>
          </div>
          <div className="font-orbitron text-cyan-400 text-lg tracking-[0.3em] uppercase mb-4">
            Initializing Solar System
          </div>
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="mt-2 text-cyan-500/60 text-sm font-orbitron">{loadingProgress}%</div>
        </div>
      )}

      {/* Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan Line */}
        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-scan" />

        {/* Corner Frames */}
        <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-400/50" />
        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-400/50" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-400/50" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-400/50" />

        {/* Grid overlay (subtle) */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(0,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-4 md:px-8 py-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex justify-between items-center pointer-events-auto z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(255,200,0,0.5)] flex items-center justify-center">
            <span className="text-lg">☀️</span>
          </div>
          <div>
            <h1 className="font-orbitron text-lg md:text-xl font-bold tracking-wider text-white">
              Solar System Explorer
            </h1>
            <p className="text-xs text-cyan-400/70 tracking-wide">Interactive 3D Visualization</p>
          </div>
        </div>
        
        <div className="flex gap-2 md:gap-3">
          <button
            onClick={togglePause}
            className="px-3 py-2 text-xs md:text-sm text-white/80 border border-white/20 bg-black/40 backdrop-blur-sm rounded hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-400 transition-all flex items-center gap-2"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            <span>{isPaused ? '▶' : '⏸'}</span>
            <span className="hidden md:inline">{isPaused ? 'Play' : 'Pause'}</span>
          </button>
          <button
            onClick={toggleOrbits}
            className={`px-3 py-2 text-xs md:text-sm border bg-black/40 backdrop-blur-sm rounded transition-all flex items-center gap-2 ${
              showOrbits 
                ? 'text-cyan-400 border-cyan-400/50' 
                : 'text-white/60 border-white/20 hover:text-cyan-400 hover:border-cyan-400/50'
            }`}
            title="Toggle Orbits"
          >
            <span>◯</span>
            <span className="hidden md:inline">Orbits</span>
          </button>
          <button
            onClick={toggleSpeed}
            className="px-3 py-2 text-xs md:text-sm text-white/80 border border-white/20 bg-black/40 backdrop-blur-sm rounded hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all"
          >
            <span className="text-cyan-400 font-orbitron">{speedDisplay}</span>
          </button>
          <button
            onClick={resetView}
            className="px-3 py-2 text-xs md:text-sm text-white/80 border border-white/20 bg-black/40 backdrop-blur-sm rounded hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-400 transition-all"
          >
            <span className="hidden md:inline">Reset</span>
            <span className="md:hidden">↺</span>
          </button>
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute right-4 md:right-8 top-20 w-[calc(100%-2rem)] md:w-[380px] max-w-[380px] bg-gradient-to-br from-[rgba(0,15,30,0.95)] to-[rgba(0,5,15,0.98)] border border-cyan-500/30 rounded-lg overflow-hidden pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_60px_rgba(0,100,150,0.1)] backdrop-blur-md z-20 animate-slideIn">
          {/* Panel Header */}
          <div className="relative bg-gradient-to-r from-cyan-900/50 to-blue-900/50 px-5 py-4 border-b border-cyan-500/30">
            <button
              onClick={() => setSelectedPlanet(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border border-cyan-400/50 bg-black/30 text-cyan-400 text-lg flex items-center justify-center hover:bg-cyan-400/20 hover:scale-110 transition-all"
            >
              ×
            </button>
            <h2 className="font-orbitron text-xl md:text-2xl font-bold text-white tracking-wide">
              {selectedPlanet.name}
            </h2>
            <p className="text-cyan-400/70 text-sm mt-1">
              {selectedPlanet.distance?.toFixed(0) ?? '—'} AU from Sun
            </p>
          </div>

          {/* Panel Content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Diameter</div>
                <div className="text-white font-orbitron text-sm">{selectedPlanet.diameter}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Mass</div>
                <div className="text-white font-orbitron text-sm">{selectedPlanet.mass}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Temperature</div>
                <div className="text-white font-orbitron text-sm">{selectedPlanet.temp}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1">Moons</div>
                <div className="text-white font-orbitron text-sm">{selectedPlanet.moons}</div>
              </div>
            </div>

            {/* Orbital Info */}
            <div className="mb-5">
              <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-cyan-400/50" />
                Orbital Data
                <span className="flex-1 h-px bg-cyan-400/20" />
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Day Length</span>
                  <span className="text-white font-medium">{selectedPlanet.dayLength}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Year Length</span>
                  <span className="text-white font-medium">{selectedPlanet.yearLength}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Axial Tilt</span>
                  <span className="text-white font-medium">{selectedPlanet.axialTilt.toFixed(2)}°</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-cyan-400/50" />
                Overview
                <span className="flex-1 h-px bg-cyan-400/20" />
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">{selectedPlanet.desc}</p>
            </div>

            {/* Fun Facts */}
            {selectedPlanet.facts && selectedPlanet.facts.length > 0 && (
              <div>
                <h3 className="text-cyan-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-4 h-px bg-cyan-400/50" />
                  Did You Know?
                  <span className="flex-1 h-px bg-cyan-400/20" />
                </h3>
                <div 
                  className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-500/20 cursor-pointer hover:border-cyan-400/40 transition-all"
                  onClick={cycleFact}
                >
                  <p className="text-white/90 text-sm italic">
                    &quot;{selectedPlanet.facts[currentFact]}&quot;
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {selectedPlanet.facts.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentFact ? 'bg-cyan-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-cyan-400/60 text-xs">Click for more →</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom HUD */}
      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 py-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-auto z-10">
        {/* Controls Help */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-8 h-8 rounded border border-cyan-400/30 flex items-center justify-center text-cyan-400 bg-black/30">
              <span className="text-base">↻</span>
            </div>
            <span className="hidden sm:inline">Drag to Rotate</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-8 h-8 rounded border border-cyan-400/30 flex items-center justify-center text-cyan-400 bg-black/30">
              <span className="text-base">⊕</span>
            </div>
            <span className="hidden sm:inline">Scroll to Zoom</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-8 h-8 rounded border border-cyan-400/30 flex items-center justify-center text-cyan-400 bg-black/30">
              <span className="text-base">◉</span>
            </div>
            <span className="hidden sm:inline">Click Planet</span>
          </div>
        </div>

        {/* Telemetry */}
        <div className="flex gap-6 md:gap-8">
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 font-orbitron">Distance</div>
            <div className="text-sm md:text-base text-cyan-400 font-semibold font-orbitron">
              {cameraDistance.toFixed(1)} <span className="text-white/40">AU</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 font-orbitron">Objects</div>
            <div className="text-sm md:text-base text-cyan-400 font-semibold font-orbitron">9</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1 font-orbitron">Status</div>
            <div className={`text-sm md:text-base font-semibold font-orbitron ${isPaused ? 'text-yellow-400' : 'text-green-400'}`}>
              {isPaused ? 'PAUSED' : 'ACTIVE'}
            </div>
          </div>
        </div>
      </div>

      {/* Planet Marker */}
      {hoveredPlanetName && !selectedPlanet && (
        <div
          className="absolute pointer-events-none z-30"
          style={{ left: markerPosition.x, top: markerPosition.y, transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute w-16 h-16 border-2 border-cyan-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring opacity-80" />
          <div className="absolute w-16 h-16 border-2 border-cyan-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-ring opacity-60" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-3 h-3 bg-cyan-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-sm px-4 py-2 border border-cyan-400/50 rounded font-orbitron text-sm whitespace-nowrap text-cyan-400 tracking-wider shadow-lg">
            {hoveredPlanetName}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-cyan-400/50 rotate-45" />
          </div>
        </div>
      )}

      {/* Planet Quick Select (Mobile) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 pointer-events-auto z-10">
        {Object.keys(planetDataConfig).map((key) => {
          const data = planetDataConfig[key];
          return (
            <button
              key={key}
              onClick={() => {
                const planet = planetsRef.current.find(p => (p.userData as PlanetUserData).key === key);
                // Use planetDataConfig directly for reliable data
                setSelectedPlanet({
                  name: data.name,
                  size: data.size,
                  distance: data.distance,
                  speed: data.speed,
                  diameter: data.diameter,
                  mass: data.mass,
                  temp: data.temp,
                  dayLength: data.dayLength,
                  yearLength: data.yearLength,
                  moons: data.moons,
                  desc: data.desc,
                  facts: data.facts,
                  roughness: data.roughness,
                  metalness: data.metalness,
                  axialTilt: data.axialTilt,
                });
                setCurrentFact(0);
                if (planet) {
                  focusOnPlanet(planet);
                }
              }}
              className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white/60 text-xs hover:border-cyan-400/50 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all flex items-center justify-center"
              title={data.name}
            >
              {data.name[0]}
            </button>
          );
        })}
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes scan {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .font-orbitron {
          font-family: var(--font-orbitron), 'Orbitron', ui-sans-serif, system-ui, sans-serif;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
