export interface Unit {
  unitId: number;
  nameOfUnit: string;
  unitSetId: number;
  unitSetName?: string; 
  unitFactor: number;
  isBaseUnit: boolean;
  description?: string;
  remarks?: string;
  isActive: boolean;
}