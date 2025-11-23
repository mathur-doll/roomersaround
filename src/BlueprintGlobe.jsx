import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { X } from 'lucide-react';

const BlueprintGlobe = ({ onClose }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const earthRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue.jpg',
      (texture) => {
        const earthMaterial = new THREE.MeshStandardMaterial({
          map: texture,
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earthRef.current = earth;
        scene.add(earth);
      },
      undefined,
      (error) => {
        console.error('Texture loading error:', error);
        // Fallback to blue sphere
        const earthMaterial = new THREE.MeshStandardMaterial({
          color: 0x1e40af,
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earthRef.current = earth;
        scene.add(earth);
      }
    );

    // Add country borders
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        data.features.forEach(feature => {
          const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6,
          });

          const processCoordinates = (coords) => {
            const points = coords.map(coord => {
              const [lng, lat] = coord;
              const phi = (90 - lat) * (Math.PI / 180);
              const theta = (lng + 180) * (Math.PI / 180);
              const x = -2.01 * Math.sin(phi) * Math.cos(theta);
              const y = 2.01 * Math.cos(phi);
              const z = 2.01 * Math.sin(phi) * Math.sin(theta);
              return new THREE.Vector3(x, y, z);
            });
            return points;
          };

          if (feature.geometry.type === 'Polygon') {
            const points = processCoordinates(feature.geometry.coordinates[0]);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
              const points = processCoordinates(polygon[0]);
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.Line(geometry, material);
              scene.add(line);
            });
          }
        });
      })
      .catch(error => console.error('Border loading error:', error));

    // Add connection arcs
    const cities = [
      { name: 'Rome', lat: 41.9028, lng: 12.4964 },
      { name: 'New York', lat: 40.7128, lng: -74.0060 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    ];

    const latLngToVector3 = (lat, lng, radius = 2.02) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const createArc = (start, end, segments = 50) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const point = new THREE.Vector3().lerpVectors(start, end, t);
        const altitude = Math.sin(t * Math.PI) * 0.5;
        point.normalize().multiplyScalar(2.02 + altitude);
        points.push(point);
      }
      return points;
    };

    const rome = latLngToVector3(cities[0].lat, cities[0].lng);
    cities.slice(1).forEach(city => {
      const points = createArc(rome, latLngToVector3(city.lat, city.lng));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.4,
      });
      const arc = new THREE.Line(geometry, material);
      scene.add(arc);
    });

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.15, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotation.y += deltaX * 0.005;
      rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Auto-rotate
      rotation.y += 0.001;

      // Apply rotation to scene
      scene.rotation.y = rotation.y;
      scene.rotation.x = rotation.x;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] z-50">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/20 transition border border-white/20 flex items-center space-x-2"
      >
        <X className="w-4 h-4" />
        <span>Close</span>
      </button>

      {/* Title */}
      <div className="absolute top-6 left-6 z-50 text-white">
        <h1 className="text-3xl font-light mb-2">RoomersAround Global</h1>
        <p className="text-blue-300 text-sm">Connecting communities worldwide</p>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-6 left-6 right-6 z-50 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="text-3xl font-light text-blue-400 mb-2">195+</div>
            <div className="text-sm text-gray-300">Countries Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-blue-400 mb-2">12K+</div>
            <div className="text-sm text-gray-300">Active Community</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-blue-400 mb-2">Rome</div>
            <div className="text-sm text-gray-300">Currently Viewing</div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-50 bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white text-sm space-y-2">
        <div className="font-medium mb-3 text-blue-400">Controls</div>
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>🔄 Auto-rotating</div>
      </div>
    </div>
  );
};

export default BlueprintGlobe;