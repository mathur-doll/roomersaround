import Globe from 'react-globe.gl';
import { useRef, useEffect, useState } from 'react';

function EarthGlobe() {
  const globeEl = useRef();
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
  }, []);

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      
      // Country polygons
      polygonsData={countries.features}
      polygonAltitude={0.01}
      polygonCapColor={() => 'rgba(0, 150, 255, 0.3)'}
      polygonSideColor={() => 'rgba(0, 100, 255, 0.15)'}
      polygonStrokeColor={() => '#00d4ff'}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b>
      `}
      
      // Styling for that blueprint look
      atmosphereColor="#00d4ff"
      atmosphereAltitude={0.2}
    />
  );
}

export default EarthGlobe;