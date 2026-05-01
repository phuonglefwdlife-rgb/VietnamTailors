export interface BodyMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  armLength: number;
  inseam: number;
}

export type Gender = 'Man' | 'Woman';
export type ClothingCategory = 'Blazer' | 'Pants' | 'Skirt' | 'Shirt' | 'Dress' | 'Shorts' | 'Maxi dress' | 'Evening dress';

export interface StyleOption {
  id: string;
  name: string;
  image: string;
  category: ClothingCategory;
  gender: Gender | 'Unisex';
}

export interface MaterialOption {
  id: string;
  name: string;
  color: string;
  texture: string;
}

export interface CustomizationState {
  measurements: BodyMeasurements;
  selectedGender: Gender;
  selectedCategory: ClothingCategory;
  selectedMaterial: string;
  customMaterial?: string;
  selectedColor: string;
  customColor?: string;
  selectedButton: string;
  customButton?: string;
  inspirationImages: string[];
  whatsapp?: string;
  location?: string;
}
