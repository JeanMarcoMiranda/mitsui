import { supabase } from '../supabaseClient';
import type { Brand, Model, Version, Config } from '../types';

/**
 * Obtiene todas las marcas de vehículos disponibles, ordenadas alfabéticamente.
 * @returns Lista de marcas o null si hay un error.
 */
export const fetchAllBrands = async (): Promise<Brand[] | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name')
    .order('name', { ascending: true })
    .returns<Brand[]>();

  if (error) {
    console.error('Error al obtener las marcas:', error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene el nombre completo de una marca por su ID.
 * @param brandId ID de la marca.
 * @returns Nombre de la marca o null si no se encuentra.
 */
export const fetchBrandNameById = async (brandId: number): Promise<string | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('name')
    .eq('id', brandId)
    .single();

  // Ignoramos el error PGRST116 (No se encontraron filas)
  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el nombre de la marca ${brandId}:`, error.message);
    return null;
  }

  return data?.name || null;
};

/**
 * Obtiene modelos asociados a un ID de marca, ordenados alfabéticamente.
 * @param brandId ID de la marca.
 * @returns Lista de modelos o null si hay un error.
 */
export const fetchModelsByBrandId = async (brandId: number): Promise<Model[] | null> => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('brand_id', brandId)
    .order('name', { ascending: true })
    .returns<Model[]>();

  if (error) {
    console.error(`Error al obtener modelos para la marca ${brandId}:`, error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene el nombre completo de un modelo por su ID.
 * @param modelId ID del modelo.
 * @returns Nombre del modelo o null si no se encuentra.
 */
export const fetchModelNameById = async (modelId: number): Promise<string | null> => {
  const { data, error } = await supabase
    .from('models')
    .select('name')
    .eq('id', modelId)
    .single();

  // Ignoramos el error PGRST116 (No se encontraron filas)
  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el nombre del modelo ${modelId}:`, error.message);
    return null;
  }

  return data?.name || null;
};

/**
 * Obtiene el mejor rendimiento de combustible (km/galón) registrado para un modelo.
 * Se utiliza para calcular el consumo del vehículo actual del usuario.
 * @param modelId ID del modelo.
 * @returns Rendimiento máximo en km/galón o null.
 */
export const fetchMaxFuelEfficiencyByModelId = async (modelId: number): Promise<number | null> => {
  const { data, error } = await supabase
    .from('versions')
    .select('km_per_gallon')
    .eq('model_id', modelId)
    .order('km_per_gallon', { ascending: false })
    .limit(1)
    .single();

  // Ignoramos el error PGRST116 (No se encontraron filas)
  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el rendimiento máximo para el modelo ${modelId}:`, error.message);
    return null;
  }

  return data?.km_per_gallon ? Number(data.km_per_gallon) : null;
};

/**
 * Obtiene todas las versiones híbridas de Toyota con datos anidados (modelo y marca).
 * Esta información es clave para mostrar las opciones de comparación en la interfaz.
 * @returns Lista de versiones híbridas o null si hay un error.
 */
export const fetchToyotaHybridVersions = async (): Promise<any[] | null> => {
  const { data, error } = await supabase
    .from('versions')
    .select(`
      id,
      specific_version,
      km_per_gallon,
      is_hybrid,
      image_url,
      models!inner (
        id,
        name,
        brands!inner (
          id,
          name
        )
      )
    `)
    .eq('is_hybrid', true)
    .eq('models.brands.name', 'TOYOTA') // Filtra solo los vehículos de la marca Toyota.
    .order('km_per_gallon', { ascending: false }); // Prioriza los de mejor rendimiento.

  if (error) {
    console.error('Error al obtener las versiones híbridas de Toyota:', error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene el valor de una clave de configuración específica de la tabla 'config'.
 * @param key Clave de configuración (e.g., 'FUEL_PRICE_PER_LITER').
 * @returns Objeto de configuración o null si no se encuentra.
 */
export const fetchConfigByKey = async (key: string): Promise<Config | null> => {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('key', key)
    .single();

  // Ignoramos el error PGRST116 (No se encontraron filas)
  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener la configuración ${key}:`, error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene el precio de la gasolina por litro desde la configuración de la base de datos.
 * Esta función es esencial para todos los cálculos de ahorro.
 * @returns Precio de la gasolina por litro o null si no se pudo obtener.
 */
export const fetchGasPrice = async (): Promise<number | null> => {
  const configData = await fetchConfigByKey('FUEL_PRICE_PER_LITER');

  if (configData?.value) {
    return Number(configData.value);
  }

  console.warn("La clave 'FUEL_PRICE_PER_LITER' no se encontró en la tabla 'config'.");
  return null;
};

/**
 * Calcula los kilómetros mensuales que recorre el usuario basándose en su gasto.
 * @param monthlySpending Gasto mensual en soles.
 * @param pricePerLiter Precio por litro de gasolina.
 * @param kmPerGallon Rendimiento del vehículo (km/galón).
 * @returns Kilómetros mensuales recorridos.
 */
export const calculateMonthlyKm = (
  monthlySpending: number,
  pricePerLiter: number,
  kmPerGallon: number
): number => {
  const LITERS_PER_GALLON = 3.78541;
  const pricePerGallon = pricePerLiter * LITERS_PER_GALLON;
  const gallonsPerMonth = monthlySpending / pricePerGallon;
  return gallonsPerMonth * kmPerGallon;
};

/**
 * Calcula la distancia total que un vehículo híbrido puede recorrer con el mismo gasto mensual del usuario.
 * (Esta es una simple envoltura de `calculateMonthlyKm` con nombres de parámetros específicos).
 * @param monthlySpending Gasto mensual en soles.
 * @param pricePerLiter Precio por litro de gasolina.
 * @param hybridKmPerGallon Rendimiento del híbrido (km/galón).
 * @returns Kilómetros que recorrería el híbrido con el mismo gasto.
 */
export const calculateHybridKm = (
  monthlySpending: number,
  pricePerLiter: number,
  hybridKmPerGallon: number
): number => {
  return calculateMonthlyKm(monthlySpending, pricePerLiter, hybridKmPerGallon);
};

/**
 * Calcula el nuevo gasto mensual si el usuario recorre los mismos kilómetros con el vehículo híbrido.
 * @param userMonthlyKm Kilómetros mensuales del usuario.
 * @param pricePerLiter Precio por litro de gasolina.
 * @param hybridKmPerGallon Rendimiento del híbrido (km/galón).
 * @returns Gasto mensual estimado con el híbrido (en soles).
 */
export const calculateHybridMonthlySpending = (
  userMonthlyKm: number,
  pricePerLiter: number,
  hybridKmPerGallon: number
): number => {
  const LITERS_PER_GALLON = 3.78541;
  const pricePerGallon = pricePerLiter * LITERS_PER_GALLON;
  const gallonsNeeded = userMonthlyKm / hybridKmPerGallon;
  return gallonsNeeded * pricePerGallon;
};

/**
 * Calcula la diferencia entre el gasto actual del usuario y el gasto proyectado con el híbrido.
 * @param userMonthlySpending Gasto mensual actual del usuario.
 * @param hybridMonthlySpending Gasto mensual proyectado con el híbrido.
 * @returns Ahorro mensual en soles.
 */
export const calculateMonthlySavings = (
  userMonthlySpending: number,
  hybridMonthlySpending: number
): number => {
  return userMonthlySpending - hybridMonthlySpending;
};