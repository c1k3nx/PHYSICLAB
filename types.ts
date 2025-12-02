export enum Category {
  MECHANICS = 'Mechanics',
  ELECTRICITY = 'Electricity',
  OPTICS = 'Optics',
  THERMODYNAMICS = 'Thermodynamics',
}

export interface Experiment {
  id: string;
  title: string;
  category: Category;
  description: string;
  tags: string[];
}

export interface SimulationProps {
  isActive: boolean;
}