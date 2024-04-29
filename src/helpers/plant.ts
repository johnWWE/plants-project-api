import { PlantTypeEn, PlantTypeEs } from '../ts/interfaces';

export const isValidPlantType = (type: string): boolean => {
  if (Object.values(PlantTypeEn).includes(type as PlantTypeEn)) {
    return true;
  }
  if (Object.values(PlantTypeEs).includes(type as PlantTypeEs)) {
    return true;
  }
  return false;
};
