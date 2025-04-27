'use client';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from "tsparticles-engine";

export default function NoiseBackground() {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 200,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.1,
            random: true,
          },
          size: {
            value: 1,
            random: true,
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: 'none',
            random: true,
            out_mode: 'out',
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-0"
    />
  );
}