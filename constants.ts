import { Category, Experiment } from './types';
import { 
  Atom, 
  Zap, 
  Eye, 
  Thermometer, 
  Activity, 
  Move, 
  Wind,
  Circle,
  Scale,
  Clock,
  Waves,
  Triangle,
  Sun,
  Flame
} from 'lucide-react';

export const CATEGORY_ICONS = {
  [Category.MECHANICS]: Move,
  [Category.ELECTRICITY]: Zap,
  [Category.OPTICS]: Eye,
  [Category.THERMODYNAMICS]: Thermometer,
};

export const EXPERIMENTS: Experiment[] = [
  // --- MECHANICS ---
  {
    id: 'mech-projectile',
    title: 'Projectile Motion',
    category: Category.MECHANICS,
    description: 'Simulate parabolic trajectories under gravity with adjustable velocity and angle.',
    tags: ['Kinematics', 'Gravity', '2D Motion']
  },
  {
    id: 'mech-newton',
    title: 'Newton\'s Laws',
    category: Category.MECHANICS,
    description: 'Explore forces, mass, and acceleration relationships.',
    tags: ['Dynamics', 'Forces']
  },
  {
    id: 'mech-circular',
    title: 'Circular Motion',
    category: Category.MECHANICS,
    description: 'Centripetal force, acceleration, and angular velocity.',
    tags: ['Rotation', 'Centripetal Force']
  },
  {
    id: 'mech-pendulum',
    title: 'Simple Pendulum',
    category: Category.MECHANICS,
    description: 'Study simple harmonic motion, period, and frequency.',
    tags: ['Oscillations', 'Energy']
  },
  {
    id: 'mech-spring',
    title: 'Spring Oscillator',
    category: Category.MECHANICS,
    description: 'Hooke\'s Law, Damping, and Simple Harmonic Motion.',
    tags: ['Elasticity', 'SHM']
  },
  {
    id: 'mech-torque',
    title: 'Torque & Rotation',
    category: Category.MECHANICS,
    description: 'Balance forces and moments on a lever arm.',
    tags: ['Statics', 'Rotation']
  },
  {
    id: 'mech-collisions',
    title: 'Elastic Collisions',
    category: Category.MECHANICS,
    description: 'Conservation of momentum and kinetic energy in collisions.',
    tags: ['Momentum', 'Energy']
  },
  {
    id: 'mech-fluid',
    title: 'Archimedes Principle',
    category: Category.MECHANICS,
    description: 'Buoyancy and fluid dynamics simulation.',
    tags: ['Fluids', 'Pressure']
  },
  {
    id: 'mech-relativity',
    title: 'Special Relativity',
    category: Category.MECHANICS,
    description: 'Time dilation and length contraction at speeds near light.',
    tags: ['Modern Physics', 'Einstein']
  },

  // --- ELECTRICITY ---
  {
    id: 'elec-coulomb',
    title: 'Coulomb\'s Law',
    category: Category.ELECTRICITY,
    description: 'Visualize electric force and fields between point charges.',
    tags: ['Electrostatics', 'Fields']
  },
  {
    id: 'elec-field',
    title: 'Electric Fields',
    category: Category.ELECTRICITY,
    description: 'Map electric field lines and equipotential surfaces.',
    tags: ['Potentials', 'Fields']
  },
  {
    id: 'elec-ohm',
    title: 'Ohm\'s Law Circuit',
    category: Category.ELECTRICITY,
    description: 'Relationship between Voltage, Current, and Resistance.',
    tags: ['DC Circuits', 'Current']
  },
  {
    id: 'elec-ac',
    title: 'AC RLC Circuits',
    category: Category.ELECTRICITY,
    description: 'Alternating current, phase shifts, and resonance.',
    tags: ['AC Circuits', 'Impedance']
  },

  // --- OPTICS ---
  {
    id: 'opt-refraction',
    title: 'Refraction & Snell\'s Law',
    category: Category.OPTICS,
    description: 'Light bending through different mediums.',
    tags: ['Geometric Optics', 'Light']
  },
  {
    id: 'opt-prism',
    title: 'Prism Dispersion',
    category: Category.OPTICS,
    description: 'Separation of white light into spectral colors.',
    tags: ['Dispersion', 'Spectrum']
  },
  {
    id: 'opt-lenses',
    title: 'Lenses & Mirrors',
    category: Category.OPTICS,
    description: 'Ray tracing for convex and concave lenses.',
    tags: ['Geometric Optics', 'Imaging']
  },
  {
    id: 'opt-interference',
    title: 'Wave Interference',
    category: Category.OPTICS,
    description: 'Double slit experiment and wave superposition.',
    tags: ['Wave Optics', 'Quantum']
  },
  {
    id: 'opt-photoelectric',
    title: 'Photoelectric Effect',
    category: Category.OPTICS,
    description: 'Quantum nature of light and electron emission.',
    tags: ['Quantum', 'Photons']
  },

  // --- THERMODYNAMICS ---
  {
    id: 'therm-gas',
    title: 'Ideal Gas Law',
    category: Category.THERMODYNAMICS,
    description: 'Kinetic theory of gases: Pressure, Volume, Temperature.',
    tags: ['Gas Laws', 'Kinetic Theory']
  },
  {
    id: 'therm-calorimetry',
    title: 'Calorimetry',
    category: Category.THERMODYNAMICS,
    description: 'Heat transfer and thermal equilibrium mixing.',
    tags: ['Heat', 'Energy Transfer']
  },
  {
    id: 'therm-carnot',
    title: 'Heat Engines',
    category: Category.THERMODYNAMICS,
    description: 'Carnot cycle and efficiency calculations.',
    tags: ['Thermodynamics', 'Entropy']
  },
];