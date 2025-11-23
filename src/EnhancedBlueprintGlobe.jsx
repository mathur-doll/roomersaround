import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Search, MapPin, Users, Home, Clock, ZoomIn } from 'lucide-react';
import CountryDetailView from './CountryDetailView';

const EnhancedBlueprintGlobe = ({ onClose, properties = [], members = [] }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const earthRef = useRef(null);
  const frameIdRef = useRef(null);
  const markersRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [showDayNight, setShowDayNight] = useState(true);
  const [showCountryDetail, setShowCountryDetail] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Calculate property and user locations
  const cityData = [
    { name: 'Rome', lat: 41.9028, lng: 12.4964, type: 'main', properties: properties.length, users: members.length },
    { name: 'New York', lat: 40.7128, lng: -74.0060, type: 'city', properties: 0, users: 0 },
    { name: 'London', lat: 51.5074, lng: -0.1278, type: 'city', properties: 0, users: 0 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, type: 'city', properties: 0, users: 0 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522, type: 'city', properties: 0, users: 0 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093, type: 'city', properties: 0, users: 0 },
  ];

  // Convert lat/lng to 3D coordinates
  const latLngToVector3 = (lat, lng, radius = 2.02) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Create marker geometry
  const createMarker = (city, scene) => {
    const position = latLngToVector3(city.lat, city.lng);
    
    // Different styles for different types
    let geometry, material;
    
    if (city.type === 'main') {
      // Main location (Rome) - larger glowing marker
      geometry = new THREE.SphereGeometry(0.08, 16, 16);
      material = new THREE.MeshBasicMaterial({
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.9,
      });
    } else {
      // Other cities - smaller markers
      geometry = new THREE.SphereGeometry(0.05, 16, 16);
      material = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8,
      });
    }
    
    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    marker.userData = { city, isMarker: true };
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(
      city.type === 'main' ? 0.12 : 0.08,
      16,
      16
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: city.type === 'main' ? 0xff6b6b : 0x00d4ff,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(position);
    
    scene.add(marker);
    scene.add(glow);
    
    return { marker, glow, city };
  };

  // Create property pins for Rome
  const createPropertyPins = (scene) => {
    properties.slice(0, 10).forEach((property, index) => {
      // Distribute properties around Rome
      const offsetLat = 41.9028 + (Math.random() - 0.5) * 0.5;
      const offsetLng = 12.4964 + (Math.random() - 0.5) * 0.5;
      
      const position = latLngToVector3(offsetLat, offsetLng, 2.03);
      
      // Create pin (cone shape)
      const pinGeometry = new THREE.ConeGeometry(0.03, 0.1, 8);
      const pinMaterial = new THREE.MeshBasicMaterial({
        color: property.available ? 0x00ff88 : 0xff9900,
        transparent: true,
        opacity: 0.8,
      });
      
      const pin = new THREE.Mesh(pinGeometry, pinMaterial);
      pin.position.copy(position);
      
      // Point cone toward center of Earth
      const direction = position.clone().normalize();
      pin.lookAt(direction.multiplyScalar(-1));
      pin.rotateX(Math.PI);
      
      pin.userData = { property, isProperty: true };
      
      scene.add(pin);
      markersRef.current.push(pin);
    });
  };

  // Search and focus on country
  const focusOnCountry = (countryName) => {
    const country = countries.find(c => 
      c.properties.ADMIN.toLowerCase().includes(countryName.toLowerCase())
    );
    
    if (country && cameraRef.current) {
      setSelectedCountry(country);
      
      // Get country center
      const bounds = country.geometry.coordinates[0];
      let sumLat = 0, sumLng = 0, count = 0;
      
      bounds[0].forEach(coord => {
        sumLng += coord[0];
        sumLat += coord[1];
        count++;
      });
      
      const centerLat = sumLat / count;
      const centerLng = sumLng / count;
      
      const position = latLngToVector3(centerLat, centerLng, 5);
      
      // Animate camera
      const startPos = cameraRef.current.position.clone();
      const endPos = position;
      let progress = 0;
      
      const animateCamera = () => {
        progress += 0.02;
        if (progress >= 1) {
          cameraRef.current.position.copy(endPos);
          return;
        }
        
        cameraRef.current.position.lerpVectors(startPos, endPos, progress);
        cameraRef.current.lookAt(0, 0, 0);
        requestAnimationFrame(animateCamera);
      };
      
      animateCamera();
      setHoveredCountry(country.properties.ADMIN);
    }
  };

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

    // Create Earth with day/night texture
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    // Load both day and night textures
    Promise.all([
      new Promise((resolve) => textureLoader.load(
        'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue.jpg',
        resolve
      )),
      new Promise((resolve) => textureLoader.load(
        'https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg',
        resolve
      ))
    ]).then(([dayTexture, nightTexture]) => {
      // Custom shader for day/night
      const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
          dayTexture: { value: dayTexture },
          nightTexture: { value: nightTexture },
          sunDirection: { value: new THREE.Vector3(1, 0, 0) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform vec3 sunDirection;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;
            
            vec3 normal = normalize(vNormal);
            float intensity = dot(normal, normalize(sunDirection));
            
            // Smooth transition between day and night
            float mixValue = smoothstep(-0.1, 0.1, intensity);
            
            vec3 color = mix(nightColor, dayColor, mixValue);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      });

      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earthRef.current = earth;
      scene.add(earth);
    }).catch(() => {
      // Fallback
      const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x1e40af });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earthRef.current = earth;
      scene.add(earth);
    });

    // Load countries and create borders
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(data => {
        setCountries(data.features);
        
        data.features.forEach((feature) => {
          const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6,
          });

          const processCoordinates = (coords) => {
            return coords.map(coord => {
              const [lng, lat] = coord;
              const phi = (90 - lat) * (Math.PI / 180);
              const theta = (lng + 180) * (Math.PI / 180);
              const x = -2.01 * Math.sin(phi) * Math.cos(theta);
              const y = 2.01 * Math.cos(phi);
              const z = 2.01 * Math.sin(phi) * Math.sin(theta);
              return new THREE.Vector3(x, y, z);
            });
          };

          if (feature.geometry.type === 'Polygon') {
            const points = processCoordinates(feature.geometry.coordinates[0]);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            line.userData = { country: feature.properties.ADMIN };
            scene.add(line);
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach(polygon => {
              const points = processCoordinates(polygon[0]);
              const geometry = new THREE.BufferGeometry().setFromPoints(points);
              const line = new THREE.Line(geometry, material);
              line.userData = { country: feature.properties.ADMIN };
              scene.add(line);
            });
          }
        });
      });

    // Add city markers
    cityData.forEach(city => {
      const markerData = createMarker(city, scene);
      markersRef.current.push(markerData);
    });

    // Add property pins
    createPropertyPins(scene);

    // Add connection arcs
    const rome = latLngToVector3(cityData[0].lat, cityData[0].lng);
    cityData.slice(1).forEach(city => {
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

    // Atmosphere
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
      // Update mouse position for raycasting
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

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

    const handleClick = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(
        markersRef.current.map(m => m.marker || m).filter(Boolean)
      );

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.city) {
          setSelectedMarker(obj.userData.city);
        } else if (obj.userData.property) {
          setSelectedMarker(obj.userData.property);
        }
      }
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(3, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Auto-rotate
      rotation.y += 0.001;

      // Apply rotation
      scene.rotation.y = rotation.y;
      scene.rotation.x = rotation.x;

      // Animate marker pulses
      markersRef.current.forEach((markerData) => {
        if (markerData.glow) {
          const scale = 1 + Math.sin(Date.now() * 0.003) * 0.1;
          markerData.glow.scale.set(scale, scale, scale);
        }
      });

      // Update sun direction for day/night
      if (earthRef.current && earthRef.current.material.uniforms) {
        const time = Date.now() * 0.0001;
        earthRef.current.material.uniforms.sunDirection.value.set(
          Math.cos(time),
          0.5,
          Math.sin(time)
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
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
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [properties, members]);

  return (
    <>
      {showCountryDetail && selectedCountry ? (
<CountryDetailView
  country={selectedCountry}
  members={members}
  properties={properties}  // ← Add this line!
  onClose={() => {
    setShowCountryDetail(false);
    setSelectedCountry(null);
  }}
/>
      ) : (
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
        <h1 className="text-3xl font-light mb-2">RoomersAround Global Network</h1>
        <p className="text-blue-300 text-sm">Connecting communities worldwide</p>
      </div>

      {/* Search Bar */}
      <div className="absolute top-24 left-6 z-50 w-80">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                focusOnCountry(searchQuery);
              }
            }}
            placeholder="Search countries..."
            className="w-full bg-white/10 backdrop-blur-md text-white pl-12 pr-4 py-3 rounded-full border border-white/20 focus:border-blue-400 outline-none placeholder-gray-400"
          />
        </div>
        {searchQuery && (
          <div className="mt-2 space-y-2">
            <button
              onClick={() => focusOnCountry(searchQuery)}
              className="w-full bg-blue-500/80 backdrop-blur-md text-white py-2 rounded-full hover:bg-blue-600/80 transition text-sm"
            >
              Focus on "{searchQuery}"
            </button>
            {selectedCountry && (
              <button
                onClick={() => setShowCountryDetail(true)}
                className="w-full bg-indigo-500/80 backdrop-blur-md text-white py-2 rounded-full hover:bg-indigo-600/80 transition text-sm flex items-center justify-center space-x-2"
              >
                <ZoomIn className="w-4 h-4" />
                <span>View {selectedCountry.properties.ADMIN} Network</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute top-24 right-6 z-50 bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white text-sm space-y-3">
        <div className="font-medium mb-3 text-blue-400">Legend</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span>Main Hub (Rome)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span>City Hotspots</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span>Available Properties</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-400"></div>
          <span>Occupied Properties</span>
        </div>
      </div>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white max-w-md">
          <button
            onClick={() => setSelectedMarker(null)}
            className="absolute top-2 right-2 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          {selectedMarker.name ? (
            // City info
            <>
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-light">{selectedMarker.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Properties:</span>
                  <span className="text-blue-400 font-medium">{selectedMarker.properties}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Community Members:</span>
                  <span className="text-blue-400 font-medium">{selectedMarker.users}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Type:</span>
                  <span className="text-blue-400 font-medium capitalize">{selectedMarker.type}</span>
                </div>
              </div>
            </>
          ) : (
            // Property info
            <>
              <div className="flex items-center space-x-3 mb-4">
                <Home className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-light">{selectedMarker.name || 'Property'}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Price:</span>
                  <span className="text-green-400 font-medium">€{selectedMarker.price}/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-medium ${selectedMarker.available ? 'text-green-400' : 'text-orange-400'}`}>
                    {selectedMarker.available ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Location:</span>
                  <span className="text-blue-400 font-medium">{selectedMarker.location}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm">
                View Details
              </button>
            </>
          )}
        </div>
      )}

      {/* Stats Panel */}
      <div className="absolute bottom-6 left-6 right-6 z-50 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Home className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-3xl font-light text-blue-400">{properties.length}</div>
            </div>
            <div className="text-sm text-gray-300">Total Properties</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-3xl font-light text-blue-400">{members.length}</div>
            </div>
            <div className="text-sm text-gray-300">Community Members</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-3xl font-light text-blue-400">6</div>
            </div>
            <div className="text-sm text-gray-300">Global Cities</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-3xl font-light text-blue-400">
                {showDayNight ? 'Live' : 'Static'}
              </div>
            </div>
            <div className="text-sm text-gray-300">Day/Night Cycle</div>
          </div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-50 bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white text-sm space-y-2 max-w-xs">
        <div className="font-medium mb-3 text-blue-400">Controls</div>
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>🔍 Search countries</div>
        <div>👆 Click markers for info</div>
        <div>🌍 Day/Night cycle active</div>
      </div>
    </div>
      )}
    </>
  );
};

export default EnhancedBlueprintGlobe;