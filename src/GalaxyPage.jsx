// import React, { useState, useEffect, useRef } from 'react';
// import { X, User, MapPin, Briefcase, Heart, Star, Home } from 'lucide-react';

// const GalaxyPage = ({ members, properties, onClose }) => {
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [hoveredMember, setHoveredMember] = useState(null);
//   const canvasRef = useRef(null);
//   const starsRef = useRef([]);

//   // Create realistic starfield background
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     // Generate background stars if not already generated
//     if (starsRef.current.length === 0) {
//       for (let i = 0; i < 800; i++) {
//         starsRef.current.push({
//           x: Math.random() * canvas.width,
//           y: Math.random() * canvas.height,
//           size: Math.random() * 2,
//           brightness: Math.random(),
//           twinkleSpeed: Math.random() * 0.05
//         });
//       }
//     }

//     let animationId;
//     let time = 0;

//     const animate = () => {
//       time += 0.01;

//       // Deep space black background
//       ctx.fillStyle = '#000000';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Draw background stars with twinkling effect
//       starsRef.current.forEach(star => {
//         const twinkle = Math.sin(time * star.twinkleSpeed + star.brightness * 10) * 0.5 + 0.5;
//         const alpha = star.brightness * twinkle;
        
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
//         ctx.fill();

//         // Add glow for larger stars
//         if (star.size > 1.2) {
//           ctx.beginPath();
//           ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
//           ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
//           ctx.fill();
//         }
//       });

//       // Draw subtle nebula effect
//       const gradient = ctx.createRadialGradient(
//         canvas.width / 2, 
//         canvas.height / 2, 
//         0, 
//         canvas.width / 2, 
//         canvas.height / 2, 
//         canvas.width / 2
//       );
//       gradient.addColorStop(0, 'rgba(20, 30, 60, 0.1)');
//       gradient.addColorStop(0.5, 'rgba(10, 15, 35, 0.05)');
//       gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       animationId = requestAnimationFrame(animate);
//     };

//     animate();

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//       // Regenerate stars on resize
//       starsRef.current = [];
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   // Calculate positions for member stars
//   const getMemberPosition = (member, index, total) => {
//     if (member.x !== undefined && member.y !== undefined) {
//       return { x: member.x, y: member.y };
//     }

//     // Create a more natural constellation-like spread
//     const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle for natural distribution
//     const angle = index * goldenAngle;
//     const radius = Math.sqrt(index / total) * 40; // Spiral outward from center
    
//     const x = 50 + Math.cos(angle) * radius;
//     const y = 50 + Math.sin(angle) * radius;

//     return { x, y };
//   };

//   const getProperty = (propertyId) => {
//     return properties.find(p => p.id === propertyId);
//   };

//   // Calculate distance between two members
//   const getDistance = (pos1, pos2) => {
//     const dx = pos2.x - pos1.x;
//     const dy = pos2.y - pos1.y;
//     return Math.sqrt(dx * dx + dy * dy);
//   };

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Animated Canvas Background */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0"
//         style={{ background: '#000000' }}
//       />

//       {/* Content Overlay */}
//       <div className="relative z-10 h-full w-full">
//         {/* Header with astronomical theme */}
//         <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-b from-black via-black/50 to-transparent">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={onClose}
//               className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/10 transition border border-white/10 flex items-center space-x-2"
//             >
//               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               <span className="text-white text-sm">Back</span>
//             </button>
//             <div>
//               <h1 className="text-4xl font-light text-white mb-1 tracking-wide" style={{ fontFamily: 'system-ui' }}>
//                 The Community
//               </h1>
//               <p className="text-gray-400 text-sm tracking-wider">STAR MAPS</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="bg-white/5 backdrop-blur-sm p-3 rounded-full hover:bg-white/10 transition border border-white/10"
//           >
//             <X className="w-6 h-6 text-white" />
//           </button>
//         </div>

//         {/* Members as Stars with Constellation Lines */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="relative w-full h-full">
//             {/* Draw constellation lines first (behind stars) */}
//             <svg className="absolute inset-0 w-full h-full pointer-events-none">
//               <defs>
//                 <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" stopColor="rgba(100, 150, 200, 0)" />
//                   <stop offset="50%" stopColor="rgba(100, 150, 200, 0.3)" />
//                   <stop offset="100%" stopColor="rgba(100, 150, 200, 0)" />
//                 </linearGradient>
//               </defs>
              
//               {members.map((member, index) => {
//                 const pos1 = getMemberPosition(member, index, members.length);
                
//                 // Draw lines to nearby members (within certain distance)
//                 return members.slice(index + 1).map((otherMember, otherIndex) => {
//                   const pos2 = getMemberPosition(otherMember, index + otherIndex + 1, members.length);
//                   const distance = getDistance(pos1, pos2);
                  
//                   // Only connect stars that are close enough (creates constellation patterns)
//                   if (distance < 15) {
//                     return (
//                       <line
//                         key={`${member.id}-${otherMember.id}`}
//                         x1={`${pos1.x}%`}
//                         y1={`${pos1.y}%`}
//                         x2={`${pos2.x}%`}
//                         y2={`${pos2.y}%`}
//                         stroke="url(#lineGradient)"
//                         strokeWidth="1"
//                         opacity="0.4"
//                       />
//                     );
//                   }
//                   return null;
//                 });
//               })}
//             </svg>

//             {/* Member stars */}
//             {members.map((member, index) => {
//               const pos = getMemberPosition(member, index, members.length);
//               const property = getProperty(member.propertyId);
//               const isHovered = hoveredMember === member.id;

//               // Random star size for visual variety (but consistent per member)
//               const starSize = 2 + (String(member.id).charCodeAt(0) % 3);

//               return (
//                 <div
//                   key={member.id}
//                   className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group"
//                   style={{
//                     left: `${pos.x}%`,
//                     top: `${pos.y}%`,
//                     zIndex: isHovered ? 100 : 10
//                   }}
//                   onMouseEnter={() => setHoveredMember(member.id)}
//                   onMouseLeave={() => setHoveredMember(null)}
//                   onClick={() => setSelectedMember(member)}
//                 >
//                   {/* Star with realistic glow */}
//                   <div className="relative">
//                     {/* Outer glow rings */}
//                     <div 
//                       className={`absolute inset-0 transition-all duration-500 ${
//                         isHovered ? 'opacity-100 scale-[3]' : 'opacity-60'
//                       }`}
//                       style={{
//                         width: `${starSize * 8}px`,
//                         height: `${starSize * 8}px`,
//                         transform: 'translate(-50%, -50%)',
//                         left: '50%',
//                         top: '50%'
//                       }}
//                     >
//                       <div 
//                         className="w-full h-full rounded-full"
//                         style={{
//                           background: `radial-gradient(circle, rgba(200, 220, 255, ${isHovered ? 0.4 : 0.2}) 0%, transparent 70%)`,
//                         }}
//                       />
//                     </div>

//                     {/* Middle glow */}
//                     <div 
//                       className={`absolute inset-0 transition-all duration-300 ${
//                         isHovered ? 'opacity-100 scale-[2]' : 'opacity-80'
//                       }`}
//                       style={{
//                         width: `${starSize * 4}px`,
//                         height: `${starSize * 4}px`,
//                         transform: 'translate(-50%, -50%)',
//                         left: '50%',
//                         top: '50%'
//                       }}
//                     >
//                       <div 
//                         className="w-full h-full rounded-full"
//                         style={{
//                           background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 60%)',
//                         }}
//                       />
//                     </div>

//                     {/* Core star */}
//                     <div 
//                       className={`relative rounded-full transition-all duration-300 ${
//                         isHovered ? 'scale-150' : ''
//                       }`}
//                       style={{
//                         width: `${starSize * 2}px`,
//                         height: `${starSize * 2}px`,
//                         background: 'radial-gradient(circle, #ffffff 0%, #e8f4ff 50%, #b8d4ff 100%)',
//                         boxShadow: isHovered 
//                           ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(200, 220, 255, 0.4)' 
//                           : '0 0 10px rgba(255, 255, 255, 0.5)',
//                       }}
//                     >
//                       {/* Verified indicator */}
//                       {member.verified && (
//                         <div 
//                           className="absolute rounded-full border"
//                           style={{
//                             top: '-2px',
//                             right: '-2px',
//                             width: '6px',
//                             height: '6px',
//                             background: 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
//                             borderColor: 'rgba(0, 0, 0, 0.5)',
//                             boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
//                           }}
//                         />
//                       )}
//                     </div>

//                     {/* Star cross effect (astronomical notation) */}
//                     {isHovered && (
//                       <div className="absolute inset-0 pointer-events-none"
//                         style={{
//                           width: `${starSize * 12}px`,
//                           height: `${starSize * 12}px`,
//                           transform: 'translate(-50%, -50%)',
//                           left: '50%',
//                           top: '50%'
//                         }}
//                       >
//                         <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white to-transparent top-1/2 opacity-40" />
//                         <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-white to-transparent left-1/2 opacity-40" />
//                       </div>
//                     )}

//                     {/* Name label on hover */}
//                     {isHovered && (
//                       <div 
//                         className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 animate-fadeIn"
//                         style={{ whiteSpace: 'nowrap' }}
//                       >
//                         <div className="bg-black/90 backdrop-blur-sm px-3 py-2 rounded border border-white/20">
//                           <div className="text-white text-sm font-light mb-1">{member.name}</div>
//                           <div className="text-gray-400 text-xs">{member.profession}</div>
//                           {property && (
//                             <div className="text-blue-400 text-xs mt-1 flex items-center">
//                               <MapPin className="w-3 h-3 mr-1" />
//                               {property.location}
//                             </div>
//                           )}
//                         </div>
//                         {/* Connecting line to star */}
//                         <div className="absolute bottom-full left-1/2 w-px h-3 bg-gradient-to-t from-white/50 to-transparent" />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Selected Member Modal */}
//         {selectedMember && (
//           <div
//             className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
//             onClick={() => setSelectedMember(null)}
//           >
//             <div
//               className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//               style={{ 
//                 boxShadow: '0 0 60px rgba(100, 150, 200, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5)'
//               }}
//             >
//               <div className="flex items-start justify-between mb-6">
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={selectedMember.avatar}
//                     alt={selectedMember.name}
//                     className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
//                     style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
//                   />
//                   <div>
//                     <h2 className="text-3xl font-light text-white">{selectedMember.name}</h2>
//                     <p className="text-blue-300">{selectedMember.profession}</p>
//                     <p className="text-gray-400 text-sm">{selectedMember.age} years old</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedMember(null)}
//                   className="text-gray-400 hover:text-white transition"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-white font-medium mb-2">About</h3>
//                   <p className="text-gray-300 leading-relaxed">{selectedMember.fullBio}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-white font-medium mb-3">Interests</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedMember.interests.map((interest, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
//                       >
//                         {interest}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {getProperty(selectedMember.propertyId) && (
//                   <div>
//                     <h3 className="text-white font-medium mb-3">Current Residence</h3>
//                     <div className="bg-black/30 rounded-xl p-4 border border-white/10">
//                       <div className="flex items-start space-x-4">
//                         <img
//                           src={getProperty(selectedMember.propertyId).image}
//                           alt={getProperty(selectedMember.propertyId).name}
//                           className="w-24 h-24 rounded-lg object-cover"
//                         />
//                         <div className="flex-1">
//                           <h4 className="text-white font-medium">{getProperty(selectedMember.propertyId).name}</h4>
//                           <p className="text-gray-400 text-sm flex items-center mt-1">
//                             <MapPin className="w-3 h-3 mr-1" />
//                             {getProperty(selectedMember.propertyId).location}
//                           </p>
//                           <p className="text-blue-400 font-medium mt-2">
//                             €{getProperty(selectedMember.propertyId).price}/month
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {selectedMember.contact && (
//                   <div>
//                     <h3 className="text-white font-medium mb-3">Contact</h3>
//                     <div className="space-y-2">
//                       {selectedMember.contact.email && (
//                         <p className="text-gray-300 text-sm">📧 {selectedMember.contact.email}</p>
//                       )}
//                       {selectedMember.contact.phone && (
//                         <p className="text-gray-300 text-sm">📱 {selectedMember.contact.phone}</p>
//                       )}
//                       {selectedMember.contact.instagram && (
//                         <p className="text-gray-300 text-sm">📸 {selectedMember.contact.instagram}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex space-x-3 pt-4 border-t border-white/10">
//                   <button className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition border border-white/10">
//                     Send Message
//                   </button>
//                   <button className="flex-1 bg-white/5 text-white py-3 rounded-lg hover:bg-white/10 transition flex items-center justify-center border border-white/10">
//                     <Heart className="w-5 h-5 mr-2" />
//                     Connect
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Legend with astronomical theme */}
//         <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10">
//           <div className="text-gray-400 text-xs mb-3 pb-2 border-b border-white/10">
//             Legend
//           </div>
//           <div className="space-y-2 text-xs text-gray-300">
//             <div className="flex items-center">
//               <div className="w-3 h-3 rounded-full mr-3" 
//                 style={{
//                   background: 'radial-gradient(circle, #ffffff 0%, #b8d4ff 100%)',
//                   boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
//                 }}
//               />
//               Member
//             </div>
//             <div className="flex items-center">
//               <div className="w-2 h-2 rounded-full mr-3" 
//                 style={{
//                   background: 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
//                   boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)'
//                 }}
//               />
//               Verified
//             </div>
//             <div className="flex items-center">
//               <div className="w-8 h-px mr-3" 
//                 style={{ 
//                   background: 'linear-gradient(to right, transparent, rgba(100, 150, 200, 0.5), transparent)'
//                 }}
//               />
//               Connection
//             </div>
//           </div>
//         </div>

//         {/* Stats panel */}
//         <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10">
//           <div className="text-gray-400 text-xs mb-2 pb-2 border-b border-white/10">
//             Community
//           </div>
//           <div className="space-y-1 text-xs">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-400">Members:</span>
//               <span className="text-white ml-4 font-medium">{members.length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-400">Verified:</span>
//               <span className="text-green-400 ml-4 font-medium">{members.filter(m => m.verified).length}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-400">Active:</span>
//               <span className="text-green-400 ml-4">●</span>
//             </div>
//           </div>
//         </div>

//         {/* Compass overlay (astronomical style) */}
//         <div className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-20 pointer-events-none">
//           <div className="relative w-24 h-24">
//             <div className="absolute inset-0 border border-white/30 rounded-full" />
//             <div className="absolute inset-2 border border-white/20 rounded-full" />
//             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white/50 text-xs">N</div>
//             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white/30 text-xs">S</div>
//             <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/30 text-xs">W</div>
//             <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/50 text-xs">E</div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GalaxyPage;
import React, { useState, useEffect, useRef } from 'react';
import { X, User, MapPin, Briefcase, Heart, Star, Home } from 'lucide-react';

const GalaxyPage = ({ members, properties, onClose }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  // Create realistic starfield background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate background stars if not already generated
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 800; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          brightness: Math.random(),
          twinkleSpeed: Math.random() * 0.05
        });
      }
    }

    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.01;

      // Deep space black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background stars with twinkling effect
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.brightness * 10) * 0.5 + 0.5;
        const alpha = star.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Add glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
          ctx.fill();
        }
      });

      // Draw subtle nebula effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, 
        canvas.height / 2, 
        0, 
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(20, 30, 60, 0.1)');
      gradient.addColorStop(0.5, 'rgba(10, 15, 35, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Regenerate stars on resize
      starsRef.current = [];
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate positions for member stars
  const getMemberPosition = (member, index, total) => {
    if (member.x !== undefined && member.y !== undefined) {
      return { x: member.x, y: member.y };
    }

    // Create a more natural constellation-like spread
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle for natural distribution
    const angle = index * goldenAngle;
    const radius = Math.sqrt(index / total) * 40; // Spiral outward from center
    
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;

    return { x, y };
  };

  const getProperty = (propertyId) => {
    return properties.find(p => p.id === propertyId);
  };

  // Calculate distance between two members
  const getDistance = (pos1, pos2) => {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: '#000000' }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-full w-full">
        {/* Header with astronomical theme - ONLY FIX: Added onClick={onClose} */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-b from-black via-black/50 to-transparent">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/10 transition border border-white/10 flex items-center space-x-2"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-white text-sm">Back</span>
            </button>
            <div>
              <h1 className="text-4xl font-light text-white mb-1 tracking-wide" style={{ fontFamily: 'system-ui' }}>
                The Community
              </h1>
              <p className="text-gray-400 text-sm tracking-wider">STAR MAPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/5 backdrop-blur-sm p-3 rounded-full hover:bg-white/10 transition border border-white/10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Members as Stars with Constellation Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Draw constellation lines first (behind stars) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(100, 150, 200, 0)" />
                  <stop offset="50%" stopColor="rgba(100, 150, 200, 0.3)" />
                  <stop offset="100%" stopColor="rgba(100, 150, 200, 0)" />
                </linearGradient>
              </defs>
              
              {members.map((member, index) => {
                const pos1 = getMemberPosition(member, index, members.length);
                
                // Draw lines to nearby members (within certain distance)
                return members.slice(index + 1).map((otherMember, otherIndex) => {
                  const pos2 = getMemberPosition(otherMember, index + otherIndex + 1, members.length);
                  const distance = getDistance(pos1, pos2);
                  
                  // Only connect stars that are close enough (creates constellation patterns)
                  if (distance < 15) {
                    return (
                      <line
                        key={`${member.id}-${otherMember.id}`}
                        x1={`${pos1.x}%`}
                        y1={`${pos1.y}%`}
                        x2={`${pos2.x}%`}
                        y2={`${pos2.y}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                    );
                  }
                  return null;
                });
              })}
            </svg>

            {/* Member stars */}
            {members.map((member, index) => {
              const pos = getMemberPosition(member, index, members.length);
              const property = getProperty(member.propertyId);
              const isHovered = hoveredMember === member.id;

              // Random star size for visual variety (but consistent per member)
              const starSize = 2 + (String(member.id).charCodeAt(0) % 3);

              return (
                <div
                  key={member.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    zIndex: isHovered ? 100 : 10
                  }}
                  onMouseEnter={() => setHoveredMember(member.id)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Star with realistic glow */}
                  <div className="relative">
                    {/* Outer glow rings */}
                    <div 
                      className={`absolute inset-0 transition-all duration-500 ${
                        isHovered ? 'opacity-100 scale-[3]' : 'opacity-60'
                      }`}
                      style={{
                        width: `${starSize * 8}px`,
                        height: `${starSize * 8}px`,
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%'
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: `radial-gradient(circle, rgba(200, 220, 255, ${isHovered ? 0.4 : 0.2}) 0%, transparent 70%)`,
                        }}
                      />
                    </div>

                    {/* Middle glow */}
                    <div 
                      className={`absolute inset-0 transition-all duration-300 ${
                        isHovered ? 'opacity-100 scale-[2]' : 'opacity-80'
                      }`}
                      style={{
                        width: `${starSize * 4}px`,
                        height: `${starSize * 4}px`,
                        transform: 'translate(-50%, -50%)',
                        left: '50%',
                        top: '50%'
                      }}
                    >
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 60%)',
                        }}
                      />
                    </div>

                    {/* Core star */}
                    <div 
                      className={`relative rounded-full transition-all duration-300 ${
                        isHovered ? 'scale-150' : ''
                      }`}
                      style={{
                        width: `${starSize * 2}px`,
                        height: `${starSize * 2}px`,
                        background: 'radial-gradient(circle, #ffffff 0%, #e8f4ff 50%, #b8d4ff 100%)',
                        boxShadow: isHovered 
                          ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(200, 220, 255, 0.4)' 
                          : '0 0 10px rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {/* Verified indicator */}
                      {member.verified && (
                        <div 
                          className="absolute rounded-full border"
                          style={{
                            top: '-2px',
                            right: '-2px',
                            width: '6px',
                            height: '6px',
                            background: 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
                            borderColor: 'rgba(0, 0, 0, 0.5)',
                            boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
                          }}
                        />
                      )}
                    </div>

                    {/* Star cross effect (astronomical notation) */}
                    {isHovered && (
                      <div className="absolute inset-0 pointer-events-none"
                        style={{
                          width: `${starSize * 12}px`,
                          height: `${starSize * 12}px`,
                          transform: 'translate(-50%, -50%)',
                          left: '50%',
                          top: '50%'
                        }}
                      >
                        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white to-transparent top-1/2 opacity-40" />
                        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-white to-transparent left-1/2 opacity-40" />
                      </div>
                    )}

                    {/* Name label on hover */}
                    {isHovered && (
                      <div 
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 animate-fadeIn"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <div className="bg-black/90 backdrop-blur-sm px-3 py-2 rounded border border-white/20">
                          <div className="text-white text-sm font-light mb-1">{member.name}</div>
                          <div className="text-gray-400 text-xs">{member.profession}</div>
                          {property && (
                            <div className="text-blue-400 text-xs mt-1 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {property.location}
                            </div>
                          )}
                        </div>
                        {/* Connecting line to star */}
                        <div className="absolute bottom-full left-1/2 w-px h-3 bg-gradient-to-t from-white/50 to-transparent" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Member Modal */}
        {selectedMember && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                boxShadow: '0 0 60px rgba(100, 150, 200, 0.1), 0 20px 40px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                    style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
                  />
                  <div>
                    <h2 className="text-3xl font-light text-white">{selectedMember.name}</h2>
                    <p className="text-blue-300">{selectedMember.profession}</p>
                    <p className="text-gray-400 text-sm">{selectedMember.age} years old</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-2">About</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedMember.fullBio}</p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {getProperty(selectedMember.propertyId) && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Current Residence</h3>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                      <div className="flex items-start space-x-4">
                        <img
                          src={getProperty(selectedMember.propertyId).image}
                          alt={getProperty(selectedMember.propertyId).name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{getProperty(selectedMember.propertyId).name}</h4>
                          <p className="text-gray-400 text-sm flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {getProperty(selectedMember.propertyId).location}
                          </p>
                          <p className="text-blue-400 font-medium mt-2">
                            €{getProperty(selectedMember.propertyId).price}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMember.contact && (
                  <div>
                    <h3 className="text-white font-medium mb-3">Contact</h3>
                    <div className="space-y-2">
                      {selectedMember.contact.email && (
                        <p className="text-gray-300 text-sm">📧 {selectedMember.contact.email}</p>
                      )}
                      {selectedMember.contact.phone && (
                        <p className="text-gray-300 text-sm">📱 {selectedMember.contact.phone}</p>
                      )}
                      {selectedMember.contact.instagram && (
                        <p className="text-gray-300 text-sm">📸 {selectedMember.contact.instagram}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t border-white/10">
                  <button className="flex-1 bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition border border-white/10">
                    Send Message
                  </button>
                  <button className="flex-1 bg-white/5 text-white py-3 rounded-lg hover:bg-white/10 transition flex items-center justify-center border border-white/10">
                    <Heart className="w-5 h-5 mr-2" />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend with astronomical theme */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10">
          <div className="text-gray-400 text-xs mb-3 pb-2 border-b border-white/10">
            Legend
          </div>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" 
                style={{
                  background: 'radial-gradient(circle, #ffffff 0%, #b8d4ff 100%)',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                }}
              />
              Member
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-3" 
                style={{
                  background: 'radial-gradient(circle, #4ade80 0%, #22c55e 100%)',
                  boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)'
                }}
              />
              Verified
            </div>
            <div className="flex items-center">
              <div className="w-8 h-px mr-3" 
                style={{ 
                  background: 'linear-gradient(to right, transparent, rgba(100, 150, 200, 0.5), transparent)'
                }}
              />
              Connection
            </div>
          </div>
        </div>

        {/* Stats panel */}
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10">
          <div className="text-gray-400 text-xs mb-2 pb-2 border-b border-white/10">
            Community
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Members:</span>
              <span className="text-white ml-4 font-medium">{members.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Verified:</span>
              <span className="text-green-400 ml-4 font-medium">{members.filter(m => m.verified).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400 ml-4">●</span>
            </div>
          </div>
        </div>

        {/* Compass overlay (astronomical style) */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-20 pointer-events-none">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border border-white/30 rounded-full" />
            <div className="absolute inset-2 border border-white/20 rounded-full" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-white/50 text-xs">N</div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white/30 text-xs">S</div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white/30 text-xs">W</div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/50 text-xs">E</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GalaxyPage;