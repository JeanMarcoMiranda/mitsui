export interface Brand {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  brand_id: number;
  name: string;
}

export interface Version {
  id: number;
  model_id: number;
  specific_version: string;
  km_per_gallon: number; 
  is_hybrid: boolean;
  image_url: string | null; 
}

export interface Config {
  key: string;
  value: number;
  description: string | null;
}