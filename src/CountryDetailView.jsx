// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { X, Users, MapPin, Mail, Phone, Home, Instagram } from 'lucide-react';

// const CountryDetailView = ({ country, members, properties, onClose }) => {
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const frameIdRef = useRef(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userLocations, setUserLocations] = useState([]);

//   useEffect(() => {
//     if (!containerRef.current || !country) return;

//     const countryName = country.properties.ADMIN || 'Italy';
//     console.log('🌍 Country Detail View:', {
//       country: countryName,
//       totalMembers: members.length,
//       totalProperties: properties?.length || 0
//     });

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0a1628);
//     sceneRef.current = scene;

//     // Camera setup
//     const camera = new THREE.PerspectiveCamera(
//       45,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 0, 10);

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({ 
//       antialias: true,
//       alpha: true
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     containerRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     // Filter members by country
//     const filterMembersByCountry = () => {
//       if (!members || members.length === 0) {
//         console.log('⚠️ No members data available');
//         return [];
//       }

//       // Filter members based on country name
//       const countryKeywords = {
//         'Italy': ['Rome', 'Milan', 'Florence', 'Venice', 'Bologna', 'Naples', 'Turin', 'Genoa', 'Palermo', 'Bari'],
//         'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'],
//         'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
//         'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
//         'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Liverpool'],
//         'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'],
//         'Portugal': ['Lisbon', 'Porto', 'Faro'],
//         'Switzerland': ['Zurich', 'Geneva', 'Bern', 'Basel'],
//         'Austria': ['Vienna', 'Salzburg', 'Innsbruck'],
//         'Belgium': ['Brussels', 'Antwerp', 'Bruges', 'Ghent'],
//         'Greece': ['Athens', 'Thessaloniki', 'Santorini'],
//         'Poland': ['Warsaw', 'Krakow', 'Gdansk'],
//         'Czech Republic': ['Prague', 'Brno'],
//         'Ireland': ['Dublin', 'Cork', 'Galway'],
//         'Sweden': ['Stockholm', 'Gothenburg', 'Malmö'],
//         'Denmark': ['Copenhagen', 'Aarhus'],
//         'Norway': ['Oslo', 'Bergen'],
//         'Finland': ['Helsinki', 'Espoo']
//       };

//       const keywords = countryKeywords[countryName] || [countryName];
      
//       const filteredMembers = members.filter(member => {
//         // Find the member's property
//         const memberProperty = properties?.find(p => p.id === member.propertyId);
//         if (!memberProperty) return false;

//         // Check if property location matches any country keyword
//         const location = memberProperty.location || '';
//         return keywords.some(keyword => 
//           location.toLowerCase().includes(keyword.toLowerCase())
//         );
//       });

//       console.log(`✅ Found ${filteredMembers.length} members in ${countryName}`);
//       return filteredMembers;
//     };

//     // Generate user locations for the country
//     const generateUserLocations = () => {
//       // Get country bounds
//       let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      
//       const processCoords = (coords) => {
//         coords.forEach(coord => {
//           const [lng, lat] = coord;
//           minLat = Math.min(minLat, lat);
//           maxLat = Math.max(maxLat, lat);
//           minLng = Math.min(minLng, lng);
//           maxLng = Math.max(maxLng, lng);
//         });
//       };

//       if (country.geometry.type === 'Polygon') {
//         processCoords(country.geometry.coordinates[0]);
//       } else if (country.geometry.type === 'MultiPolygon') {
//         country.geometry.coordinates.forEach(polygon => {
//           processCoords(polygon[0]);
//         });
//       }

//       // Get filtered members for this country
//       const filteredMembers = filterMembersByCountry();
      
//       if (filteredMembers.length === 0) {
//         console.log('⚠️ No members found in this country, using demo data');
//         // Demo data as fallback
//         const demoMembers = [
//           { id: 'demo1', name: 'Marco Rossi', profession: 'Software Engineer', bio: 'Tech enthusiast', age: 28, interests: ['Tech', 'Travel', 'Food'] },
//           { id: 'demo2', name: 'Sofia Bianchi', profession: 'Designer', bio: 'Creative mind', age: 26, interests: ['Art', 'Design', 'Music'] }
//         ];
        
//         const locations = demoMembers.map((member, index) => {
//           const lat = minLat + (maxLat - minLat) * Math.random();
//           const lng = minLng + (maxLng - minLng) * Math.random();
//           return {
//             ...member,
//             lat,
//             lng,
//             x: ((lng - minLng) / (maxLng - minLng) - 0.5) * 8,
//             y: ((lat - minLat) / (maxLat - minLat) - 0.5) * 8,
//             isDemo: true
//           };
//         });
        
//         setUserLocations(locations);
//         return { minLat, maxLat, minLng, maxLng };
//       }

//       // Use real members data
//       const locations = filteredMembers.map((member, index) => {
//         // Distribute members across the country bounds
//         // Create clusters based on major cities
//         const lat = minLat + (maxLat - minLat) * Math.random();
//         const lng = minLng + (maxLng - minLng) * Math.random();
        
//         return {
//           ...member,
//           lat,
//           lng,
//           x: ((lng - minLng) / (maxLng - minLng) - 0.5) * 8,
//           y: ((lat - minLat) / (maxLat - minLat) - 0.5) * 8,
//           isDemo: false
//         };
//       });

//       setUserLocations(locations);
//       return { minLat, maxLat, minLng, maxLng };
//     };

//     const bounds = generateUserLocations();

//     // Draw country borders with transparency
//     const drawCountryBorders = () => {
//       const material = new THREE.LineBasicMaterial({
//         color: 0x6366f1,
//         linewidth: 3,
//         transparent: true,
//         opacity: 0.7,
//       });

//       const processCoordinates = (coords) => {
//         return coords.map(coord => {
//           const [lng, lat] = coord;
//           const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng) - 0.5) * 8;
//           const y = ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat) - 0.5) * 8;
//           return new THREE.Vector3(x, y, 0);
//         });
//       };

//       if (country.geometry.type === 'Polygon') {
//         const points = processCoordinates(country.geometry.coordinates[0]);
//         const geometry = new THREE.BufferGeometry().setFromPoints(points);
//         const line = new THREE.Line(geometry, material);
//         scene.add(line);

//         // Add fill
//         const fillMaterial = new THREE.MeshBasicMaterial({
//           color: 0x1e3a8a,
//           transparent: true,
//           opacity: 0.15,
//           side: THREE.DoubleSide,
//         });
//         const shape = new THREE.Shape();
//         points.forEach((point, index) => {
//           if (index === 0) shape.moveTo(point.x, point.y);
//           else shape.lineTo(point.x, point.y);
//         });
//         const fillGeometry = new THREE.ShapeGeometry(shape);
//         const fill = new THREE.Mesh(fillGeometry, fillMaterial);
//         fill.position.z = -0.2;
//         scene.add(fill);
//       } else if (country.geometry.type === 'MultiPolygon') {
//         country.geometry.coordinates.forEach(polygon => {
//           const points = processCoordinates(polygon[0]);
//           const geometry = new THREE.BufferGeometry().setFromPoints(points);
//           const line = new THREE.Line(geometry, material);
//           scene.add(line);
//         });
//       }
//     };

//     drawCountryBorders();

//     // Create user location markers (stars)
//     userLocations.forEach((user, index) => {
//       // Star geometry
//       const starShape = new THREE.Shape();
//       const outerRadius = 0.15;
//       const innerRadius = 0.06;
//       const points = 5;

//       for (let i = 0; i < points * 2; i++) {
//         const radius = i % 2 === 0 ? outerRadius : innerRadius;
//         const angle = (Math.PI * i) / points;
//         const x = Math.cos(angle - Math.PI / 2) * radius;
//         const y = Math.sin(angle - Math.PI / 2) * radius;
//         if (i === 0) {
//           starShape.moveTo(x, y);
//         } else {
//           starShape.lineTo(x, y);
//         }
//       }
//       starShape.closePath();

//       const starGeometry = new THREE.ShapeGeometry(starShape);
//       const starMaterial = new THREE.MeshBasicMaterial({
//         color: user.isDemo ? 0xfbbf24 : 0x10b981, // Yellow for demo, green for real
//         transparent: true,
//         opacity: 0.9,
//       });

//       const star = new THREE.Mesh(starGeometry, starMaterial);
//       star.position.set(user.x, user.y, 0);
//       star.userData = { user, isStar: true };
//       scene.add(star);

//       // Add glow effect
//       const glowGeometry = new THREE.CircleGeometry(0.2, 32);
//       const glowMaterial = new THREE.MeshBasicMaterial({
//         color: user.isDemo ? 0xfbbf24 : 0x10b981,
//         transparent: true,
//         opacity: 0.3,
//       });
//       const glow = new THREE.Mesh(glowGeometry, glowMaterial);
//       glow.position.set(user.x, user.y, -0.1);
//       scene.add(glow);

//       // Add connecting lines between nearby members
//       if (index < userLocations.length - 1 && index % 3 === 0) {
//         const nextUser = userLocations[index + 1];
//         const lineGeometry = new THREE.BufferGeometry().setFromPoints([
//           new THREE.Vector3(user.x, user.y, 0),
//           new THREE.Vector3(nextUser.x, nextUser.y, 0)
//         ]);
//         const lineMaterial = new THREE.LineBasicMaterial({
//           color: 0x6366f1,
//           transparent: true,
//           opacity: 0.3,
//         });
//         const line = new THREE.Line(lineGeometry, lineMaterial);
//         scene.add(line);
//       }
//     });

//     // Add grid dots for satellite/galaxy view effect
//     for (let i = 0; i < 200; i++) {
//       const dotGeometry = new THREE.CircleGeometry(0.02, 8);
//       const dotMaterial = new THREE.MeshBasicMaterial({
//         color: 0x6366f1,
//         transparent: true,
//         opacity: 0.2,
//       });
//       const dot = new THREE.Mesh(dotGeometry, dotMaterial);
//       dot.position.set(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         -0.5
//       );
//       scene.add(dot);
//     }

//     // Mouse interaction
//     const raycaster = new THREE.Raycaster();
//     const mouse = new THREE.Vector2();

//     const handleClick = (event) => {
//       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//       mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children);

//       if (intersects.length > 0) {
//         const obj = intersects[0].object;
//         if (obj.userData.isStar) {
//           setSelectedUser(obj.userData.user);
//         }
//       }
//     };

//     renderer.domElement.addEventListener('click', handleClick);

//     // Animation
//     const animate = () => {
//       frameIdRef.current = requestAnimationFrame(animate);

//       // Animate glows
//       scene.children.forEach((child, index) => {
//         if (child.geometry instanceof THREE.CircleGeometry && child.material.opacity < 0.5) {
//           const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.1;
//           child.scale.set(scale, scale, 1);
//         }
//       });

//       renderer.render(scene, camera);
//     };
//     animate();

//     // Resize handler
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       renderer.domElement.removeEventListener('click', handleClick);
      
//       if (frameIdRef.current) {
//         cancelAnimationFrame(frameIdRef.current);
//       }
      
//       if (containerRef.current && renderer.domElement) {
//         try {
//           containerRef.current.removeChild(renderer.domElement);
//         } catch (e) {
//           console.warn('Renderer cleanup warning:', e);
//         }
//       }
      
//       renderer.dispose();
//     };
//   }, [country, members, properties]);

//   const hasRealData = userLocations.length > 0 && !userLocations[0].isDemo;

//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] z-50">
//       <div ref={containerRef} className="w-full h-full" />

//       {/* Header */}
//       <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between">
//         <div className="text-white">
//           <h1 className="text-3xl font-light mb-2">
//             {country?.properties.ADMIN || 'Country'} Network
//           </h1>
//           <p className="text-indigo-300 text-sm">
//             {userLocations.length} community member{userLocations.length !== 1 ? 's' : ''} in this region
//             {!hasRealData && (
//               <span className="text-yellow-400 ml-2">(Demo Data - Enable Members)</span>
//             )}
//             {hasRealData && (
//               <span className="text-green-400 ml-2">✓ Real Data</span>
//             )}
//           </p>
//         </div>
//         <button
//           onClick={onClose}
//           className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/20 transition border border-white/20 flex items-center space-x-2"
//         >
//           <X className="w-4 h-4" />
//           <span>Back to Globe</span>
//         </button>
//       </div>

//       {/* Legend */}
//       <div className="absolute top-24 right-6 z-50 bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white text-sm space-y-3">
//         <div className="font-medium mb-3 text-indigo-400">Legend</div>
//         <div className="flex items-center space-x-2">
//           <div className="w-4 h-4 text-green-400">⭐</div>
//           <span>Community Members</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <div className="w-4 h-4 border-2 border-indigo-400 rounded-sm"></div>
//           <span>Country Border</span>
//         </div>
//         <div className="flex items-center space-x-2">
//           <div className="w-4 h-4 bg-indigo-400/30 rounded-sm"></div>
//           <span>Connection Lines</span>
//         </div>
//       </div>

//       {/* User locations list */}
//       <div className="absolute bottom-6 left-6 z-50 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-md max-h-96 overflow-y-auto">
//         <h3 className="text-white font-medium mb-4 flex items-center justify-between">
//           <span className="flex items-center">
//             <Users className="w-5 h-5 mr-2 text-indigo-400" />
//             Community Members
//           </span>
//           <span className="text-sm text-gray-400">{userLocations.length}</span>
//         </h3>
//         {userLocations.length === 0 ? (
//           <p className="text-gray-400 text-sm">No members found in this region</p>
//         ) : (
//           <div className="space-y-3">
//             {userLocations.map((user, index) => (
//               <button
//                 key={user.id || index}
//                 onClick={() => setSelectedUser(user)}
//                 className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition"
//               >
//                 <div className="flex items-start space-x-3">
//                   {user.avatar ? (
//                     <img 
//                       src={user.avatar} 
//                       alt={user.name}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
//                       {user.name.charAt(0)}
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <div className="text-white font-medium truncate">{user.name}</div>
//                     <div className="text-gray-400 text-xs truncate">{user.profession}</div>
//                     {user.nationality && (
//                       <div className="text-indigo-300 text-xs mt-1">{user.nationality}</div>
//                     )}
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Selected User Modal */}
//       {selectedUser && (
//         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
//           <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
//             <div className="p-6">
//               {/* Header */}
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-start space-x-4">
//                   {selectedUser.avatar ? (
//                     <img 
//                       src={selectedUser.avatar}
//                       alt={selectedUser.name}
//                       className="w-16 h-16 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
//                       {selectedUser.name.charAt(0)}
//                     </div>
//                   )}
//                   <div>
//                     <h3 className="text-white text-xl font-medium">{selectedUser.name}</h3>
//                     <p className="text-indigo-300">{selectedUser.profession}</p>
//                     {selectedUser.age && (
//                       <p className="text-gray-400 text-sm mt-1">Age: {selectedUser.age}</p>
//                     )}
//                     {selectedUser.nationality && (
//                       <p className="text-gray-400 text-sm">From: {selectedUser.nationality}</p>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedUser(null)}
//                   className="text-gray-400 hover:text-white transition"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Bio */}
//               <div className="mb-6">
//                 <h4 className="text-gray-400 text-sm mb-2">About</h4>
//                 <p className="text-gray-300 leading-relaxed">
//                   {selectedUser.fullBio || selectedUser.bio || 'No bio available'}
//                 </p>
//               </div>

//               {/* Interests */}
//               {selectedUser.interests && selectedUser.interests.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="text-gray-400 text-sm mb-2">Interests</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {(Array.isArray(selectedUser.interests) ? selectedUser.interests : selectedUser.interests.split(',')).map((interest, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-indigo-500/30 rounded-full text-xs text-white"
//                       >
//                         {typeof interest === 'string' ? interest.trim() : interest}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Contact */}
//               {selectedUser.contact && (
//                 <div className="mb-6 space-y-2">
//                   <h4 className="text-gray-400 text-sm mb-2">Contact</h4>
//                   {selectedUser.contact.email && (
//                     <div className="flex items-center space-x-2 text-gray-300 text-sm">
//                       <Mail className="w-4 h-4" />
//                       <span>{selectedUser.contact.email}</span>
//                     </div>
//                   )}
//                   {selectedUser.contact.phone && (
//                     <div className="flex items-center space-x-2 text-gray-300 text-sm">
//                       <Phone className="w-4 h-4" />
//                       <span>{selectedUser.contact.phone}</span>
//                     </div>
//                   )}
//                   {selectedUser.contact.instagram && (
//                     <div className="flex items-center space-x-2 text-gray-300 text-sm">
//                       <Instagram className="w-4 h-4" />
//                       <span>{selectedUser.contact.instagram}</span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-3">
//                 <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition flex items-center justify-center space-x-2">
//                   <Mail className="w-4 h-4" />
//                   <span>Message</span>
//                 </button>
//                 <button 
//                   onClick={() => setSelectedUser(null)}
//                   className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Instructions */}
//       <div className="absolute bottom-6 right-6 z-50 bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10 text-white text-sm space-y-2">
//         <div className="font-medium mb-3 text-indigo-400">Instructions</div>
//         <div>⭐ Click stars to view profiles</div>
//         <div>👥 Click list to jump to member</div>
//         <div>🔙 Click "Back" to return</div>
//       </div>
//     </div>
//   );
// };

// export default CountryDetailView;
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Users, Mail, Phone, Instagram } from 'lucide-react';

const CountryDetailView = ({ country, members, properties, onClose }) => {
  const containerRef = useRef(null);
  const frameIdRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLocations, setUserLocations] = useState([]);

  useEffect(() => {
    if (!containerRef.current || !country) return;

    const countryName = country.properties.ADMIN;
    console.log('🌍 Rendering Country:', countryName, {
      members: members?.length || 0,
      properties: properties?.length || 0
    });

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Get country bounds
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    
    const processCoords = (coords) => {
      coords.forEach(coord => {
        const [lng, lat] = coord;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    };

    if (country.geometry.type === 'Polygon') {
      processCoords(country.geometry.coordinates[0]);
    } else if (country.geometry.type === 'MultiPolygon') {
      country.geometry.coordinates.forEach(polygon => {
        processCoords(polygon[0]);
      });
    }

    // Filter and position members
    const cityKeywords = {
      'Italy': ['Rome', 'Milan', 'Florence', 'Venice', 'Bologna', 'Naples', 'Turin'],
      'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
      'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
      'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
      'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham']
    };

    const keywords = cityKeywords[countryName] || [countryName];
    
    const filteredMembers = (members || []).filter(member => {
      const property = properties?.find(p => p.id === member.propertyId);
      if (!property) return false;
      return keywords.some(kw => property.location?.toLowerCase().includes(kw.toLowerCase()));
    });

    console.log('✅ Filtered members:', filteredMembers.length);

    // Position members on map
    const locations = filteredMembers.map((member, index) => {
      // Distribute evenly across country
      const lat = minLat + (maxLat - minLat) * (0.2 + Math.random() * 0.6);
      const lng = minLng + (maxLng - minLng) * (0.2 + Math.random() * 0.6);
      
      return {
        ...member,
        lat,
        lng,
        x: ((lng - minLng) / (maxLng - minLng) - 0.5) * 8,
        y: ((lat - minLat) / (maxLat - minLat) - 0.5) * 8
      };
    });

    setUserLocations(locations);

    // Draw country border
    const drawBorder = () => {
      const material = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        linewidth: 2,
        transparent: true,
        opacity: 0.8,
      });

      const processCoordinates = (coords) => {
        return coords.map(coord => {
          const [lng, lat] = coord;
          return new THREE.Vector3(
            ((lng - minLng) / (maxLng - minLng) - 0.5) * 8,
            ((lat - minLat) / (maxLat - minLat) - 0.5) * 8,
            0
          );
        });
      };

      if (country.geometry.type === 'Polygon') {
        const points = processCoordinates(country.geometry.coordinates[0]);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        scene.add(new THREE.Line(geometry, material));
      } else if (country.geometry.type === 'MultiPolygon') {
        country.geometry.coordinates.forEach(polygon => {
          const points = processCoordinates(polygon[0]);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          scene.add(new THREE.Line(geometry, material));
        });
      }
    };

    drawBorder();

    // CREATE VISIBLE STARS - CRITICAL FIX
    locations.forEach((user) => {
      // Large star shape
      const starShape = new THREE.Shape();
      const outerRadius = 0.2;  // Increased size
      const innerRadius = 0.08;
      const points = 5;

      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * i) / points;
        const x = Math.cos(angle - Math.PI / 2) * radius;
        const y = Math.sin(angle - Math.PI / 2) * radius;
        if (i === 0) starShape.moveTo(x, y);
        else starShape.lineTo(x, y);
      }
      starShape.closePath();

      const starGeometry = new THREE.ShapeGeometry(starShape);
      const starMaterial = new THREE.MeshBasicMaterial({
        color: 0x10b981,  // Bright green
        transparent: true,
        opacity: 1.0,  // Fully opaque
        side: THREE.DoubleSide
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(user.x, user.y, 0.5);  // Moved forward in Z
      star.userData = { user, isStar: true };
      scene.add(star);

      // Bright glow
      const glowGeometry = new THREE.CircleGeometry(0.25, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.5,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.set(user.x, user.y, 0.4);
      scene.add(glow);

      console.log('⭐ Created star at', user.x, user.y, 'for', user.name);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.isStar) {
          setSelectedUser(obj.userData.user);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      scene.children.forEach((child, index) => {
        if (child.geometry instanceof THREE.CircleGeometry) {
          const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.15;
          child.scale.set(scale, scale, 1);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (containerRef.current && renderer.domElement) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
      
      scene.clear();
      renderer.dispose();
    };
  }, [country, members, properties]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d1b2a] to-[#0a1628] z-50">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between">
        <div className="text-white">
          <h1 className="text-3xl font-light mb-2">
            {country?.properties.ADMIN} Network
          </h1>
          <p className="text-indigo-300 text-sm">
            {userLocations.length} community members ✓ Real Data
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/20 transition border border-white/20 flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Back to Globe</span>
        </button>
      </div>

      {/* Member List */}
      <div className="absolute bottom-6 left-6 z-50 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-md max-h-96 overflow-y-auto">
        <h3 className="text-white font-medium mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-indigo-400" />
            Community Members
          </span>
          <span className="text-sm text-gray-400">{userLocations.length}</span>
        </h3>
        <div className="space-y-3">
          {userLocations.map((user, index) => (
            <button
              key={user.id || index}
              onClick={() => setSelectedUser(user)}
              className="w-full text-left bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition"
            >
              <div className="flex items-start space-x-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-white font-medium">{user.name}</div>
                  <div className="text-gray-400 text-xs">{user.profession}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected User Modal */}
      {selectedUser && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-white text-xl font-medium">{selectedUser.name}</h3>
                    <p className="text-indigo-300">{selectedUser.profession}</p>
                    {selectedUser.nationality && (
                      <p className="text-gray-400 text-sm">{selectedUser.nationality}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {selectedUser.fullBio || selectedUser.bio}
                </p>
              </div>

              {selectedUser.interests && (
                <div className="mb-6">
                  <h4 className="text-gray-400 text-sm mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedUser.interests) ? selectedUser.interests : selectedUser.interests.split(',')).map((interest, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/30 rounded-full text-xs text-white">
                        {typeof interest === 'string' ? interest.trim() : interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.contact && (
                <div className="space-y-2 mb-6">
                  {selectedUser.contact.email && (
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{selectedUser.contact.email}</span>
                    </div>
                  )}
                  {selectedUser.contact.phone && (
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{selectedUser.contact.phone}</span>
                    </div>
                  )}
                  {selectedUser.contact.instagram && (
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <Instagram className="w-4 h-4" />
                      <span>{selectedUser.contact.instagram}</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDetailView;