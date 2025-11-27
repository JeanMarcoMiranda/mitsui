
import { supabase } from '../supabaseClient';
import type { Brand, Model, Version, Config } from '../types';

// =================================================================
// 🚗 BRANDS - Funciones para la tabla 'brands'
// =================================================================

/**
 * Obtiene todas las marcas ordenadas alfabéticamente.
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
 * Obtiene el nombre de una marca por su ID.
 */
export const fetchBrandNameById = async (brandId: number): Promise<string | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('name')
    .eq('id', brandId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el nombre de la marca ${brandId}:`, error.message);
    return null;
  }

  return data?.name || null;
};

// =================================================================
// 🚗 MODELS - Funciones para la tabla 'models'
// =================================================================

/**
 * Obtiene modelos por ID de marca, ordenados alfabéticamente.
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
 * Obtiene el nombre de un modelo por su ID.
 */
export const fetchModelNameById = async (modelId: number): Promise<string | null> => {
  const { data, error } = await supabase
    .from('models')
    .select('name')
    .eq('id', modelId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el nombre del modelo ${modelId}:`, error.message);
    return null;
  }

  return data?.name || null;
};

// =================================================================
// 🚗 VERSIONS - Funciones para la tabla 'versions'
// =================================================================

/**
 * Obtiene el rendimiento máximo (km/galón) para un modelo específico.
 * Útil para calcular el consumo del vehículo del usuario.
 */
export const fetchMaxFuelEfficiencyByModelId = async (modelId: number): Promise<number | null> => {
  const { data, error } = await supabase
    .from('versions')
    .select('km_per_gallon')
    .eq('model_id', modelId)
    .order('km_per_gallon', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener el rendimiento máximo para el modelo ${modelId}:`, error.message);
    return null;
  }

  return data?.km_per_gallon ? Number(data.km_per_gallon) : null;
};

/**
 * Obtiene todas las versiones híbridas de Toyota con detalles completos.
 * Incluye: marca, modelo, rendimiento e imagen.
 * CLAVE para mostrar las 4 opciones híbridas en la pantalla 2.
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
    .eq('models.brands.name', 'Toyota') // Filtro adicional para solo Toyota
    .order('km_per_gallon', { ascending: false }); // Mejor rendimiento primero

  if (error) {
    console.error('Error al obtener las versiones híbridas de Toyota:', error.message);
    return null;
  }

  return data;
};

// =================================================================
// 🚗 CONFIG - Funciones para la tabla 'config'
// =================================================================

/**
 * Obtiene el valor de una clave de configuración específica.
 */
export const fetchConfigByKey = async (key: string): Promise<Config | null> => {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error al obtener la configuración ${key}:`, error.message);
    return null;
  }

  return data;
};

/**
 * Obtiene el precio de la gasolina por litro desde la configuración.
 * CLAVE para todos los cálculos de ahorro.
 */
export const fetchGasPrice = async (): Promise<number | null> => {
  const configData = await fetchConfigByKey('FUEL_PRICE_PER_LITER');

  if (configData?.value) {
    return Number(configData.value);
  }

  console.warn("La clave 'FUEL_PRICE_PER_LITER' no se encontró en la tabla 'config'.");
  return null;
};

// =================================================================
// 🧮 CÁLCULOS - Funciones de negocio para el comparador
// =================================================================

/**
 * Calcula los kilómetros mensuales que recorre el usuario.
 * @param monthlySpending Gasto mensual en soles
 * @param pricePerLiter Precio por litro de gasolina
 * @param kmPerGallon Rendimiento del vehículo (km/galón)
 * @returns Kilómetros mensuales
 */
export const calculateMonthlyKm = (
  monthlySpending: number,
  pricePerLiter: number,
  kmPerGallon: number
): number => {
  const LITERS_PER_GALLON = 3.78541; // Conversión estándar
  const pricePerGallon = pricePerLiter * LITERS_PER_GALLON;
  const gallonsPerMonth = monthlySpending / pricePerGallon;
  return gallonsPerMonth * kmPerGallon;
};

/**
 * Calcula cuántos km puede recorrer un híbrido con el mismo gasto.
 * @param monthlySpending Gasto mensual en soles
 * @param pricePerLiter Precio por litro de gasolina
 * @param hybridKmPerGallon Rendimiento del híbrido (km/galón)
 * @returns Kilómetros que recorrería el híbrido
 */
export const calculateHybridKm = (
  monthlySpending: number,
  pricePerLiter: number,
  hybridKmPerGallon: number
): number => {
  return calculateMonthlyKm(monthlySpending, pricePerLiter, hybridKmPerGallon);
};

/**
 * Calcula el gasto mensual del híbrido para recorrer los mismos km del usuario.
 * @param userMonthlyKm Kilómetros mensuales del usuario
 * @param pricePerLiter Precio por litro de gasolina
 * @param hybridKmPerGallon Rendimiento del híbrido (km/galón)
 * @returns Gasto mensual en soles
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
 * Calcula el ahorro mensual al cambiar a un híbrido.
 * @param userMonthlySpending Gasto mensual actual del usuario
 * @param hybridMonthlySpending Gasto mensual con el híbrido
 * @returns Ahorro mensual en soles
 */
export const calculateMonthlySavings = (
  userMonthlySpending: number,
  hybridMonthlySpending: number
): number => {
  return userMonthlySpending - hybridMonthlySpending;
};