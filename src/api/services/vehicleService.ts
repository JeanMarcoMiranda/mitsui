import { supabase } from '../supabaseClient';
import type { Brand, Model, Version, Config } from '../types';

// =================================================================
// 🚗 Funciones para la tabla 'brands' (Marcas)
// =================================================================

/**
 * Obtiene todas las marcas.
 * @returns Una promesa con un array de objetos Brand o null en caso de error.
 */
export const fetchAllBrands = async (): Promise<Brand[] | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name') // Especificamos las columnas a traer
    .returns<Brand[]>(); // Usamos el tipo TypeScript

  if (error) {
    console.error('Error al obtener las marcas:', error.message);
    return null;
  }

  return data;
};

/**
 * Agrega una nueva marca.
 * @param name El nombre de la nueva marca.
 * @returns Una promesa con el objeto Brand creado o null en caso de error.
 */
export const addBrand = async (name: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .insert({ name })
    .select() // Pide que devuelva el registro insertado
    .single(); // Espera un solo registro

  if (error) {
    console.error('Error al agregar la marca:', error.message);
    return null;
  }

  return data as Brand;
};

// =================================================================
// 🚗 Funciones para la tabla 'models' (Modelos)
// =================================================================

/**
 * Obtiene todos los modelos, incluyendo el nombre de la marca (JOIN).
 * @returns Una promesa con un array de modelos extendidos.
 */
export const fetchAllModelsWithBrand = async (): Promise<(Model & { brand_name: string })[] | null> => {
  // Usamos 'select' para hacer un JOIN implícito.
  // brands(name) significa que queremos el 'name' de la tabla 'brands'
  const { data, error } = await supabase
    .from('models')
    .select('id, name, brand_id, brands(name)')
    .returns<Model[]>(); // El tipo de retorno es más complejo debido al JOIN

  if (error) {
    console.error('Error al obtener los modelos:', error.message);
    return null;
  }

  // Mapeamos los datos para aplanar el objeto de la marca
  const modelsWithBrand = data?.map((model: any) => ({
    id: model.id,
    name: model.name,
    brand_id: model.brand_id,
    brand_name: model.brands.name, // Accede al nombre de la marca
  })) || null;

  return modelsWithBrand;
};

/**
 * Obtiene modelos por ID de marca.
 */
export const fetchModelsByBrandId = async (brandId: number): Promise<Model[] | null> => {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('brand_id', brandId) // Filtra donde brand_id es igual al valor
    .returns<Model[]>();

  if (error) {
    console.error(`Error al obtener modelos para la marca ${brandId}:`, error.message);
    return null;
  }

  return data;
};


// =================================================================
// 🚗 Funciones para la tabla 'versions' (Versiones)
// =================================================================

/**
 * Obtiene todas las versiones de coches con su modelo y marca. (Deep JOIN)
 * @returns Una promesa con un array de versiones extendidas.
 */
export const fetchAllVersionsDetailed = async (): Promise<any[] | null> => {
  // Usamos 'select' para hacer un JOIN múltiple (Deep JOIN):
  // models(name, brands(name)) -> Trae name de models, y dentro de models, trae name de brands
  const { data, error } = await supabase
    .from('versions')
    .select(`
            id,
            specific_version,
            km_per_gallon,
            is_hybrid,
            image_url,
            models (
                id,
                name,
                brands (
                    name
                )
            )
        `);
  // Nota: Para Deep JOINs, el tipado con .returns<T> puede ser complicado. 
  // Se recomienda tipar el resultado después de la consulta (lo manejamos con 'any' temporalmente).

  if (error) {
    console.error('Error al obtener las versiones detalladas:', error.message);
    return null;
  }

  return data;
};

// =================================================================
// 🚗 Funciones para la tabla 'config' (Configuración)
// =================================================================

/**
 * Obtiene el valor de una clave de configuración específica.
 * @param key La clave de configuración.
 * @returns Una promesa con el objeto Config o null.
 */
export const fetchConfigByKey = async (key: string): Promise<Config | null> => {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('key', key)
    .returns<Config>()
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found" (no se encontraron filas)
    console.error(`Error al obtener la configuración ${key}:`, error.message);
    return null;
  }

  return data;
};


export const fetchHybridVersionsDetailed = async (): Promise<any[] | null> => {
  // Usamos 'select' para el Deep JOIN como en la función anterior,
  // pero agregamos el filtro usando .eq()
  const { data, error } = await supabase
    .from('versions')
    .select(`
            id,
            specific_version,
            km_per_gallon,
            is_hybrid,
            image_url,
            models (
                id,
                name,
                brands (
                    name
                )
            )
        `)
    .eq('is_hybrid', true); // <-- FILTRO CLAVE: donde is_hybrid sea TRUE

  if (error) {
    console.error('Error al obtener las versiones híbridas detalladas:', error.message);
    return null;
  }

  return data;
};

export const fetchMaxFuelEfficiencyByModelId = async (modelId: number): Promise<number | null> => {
    // Usamos la función de agregación 'max' de PostgREST
    const { data, error } = await supabase
        .from('versions')
        .select('km_per_gallon') // Solo necesitamos esta columna
        .eq('model_id', modelId) // Filtramos por el modelo seleccionado por el usuario
        .order('km_per_gallon', { ascending: false }) // Ordenamos de mayor a menor
        .limit(1) // Solo traemos el primer (el mayor) resultado
        .single(); // Esperamos un solo resultado (el máximo)

    if (error && error.code !== 'PGRST116') { // PGRST116 es "no rows found"
        console.error(`Error al obtener el rendimiento máximo para el modelo ${modelId}:`, error.message);
        return null;
    }
    
    // El resultado viene en un objeto { km_per_gallon: value }
    if (data && data.km_per_gallon) {
        return Number(data.km_per_gallon);
    }

    // Si no se encontraron versiones o el rendimiento es nulo
    return null;
};

export const fetchGasPrice = async (): Promise<number | null> => {
    // Reutilizamos la función fetchConfigByKey, asumiendo una clave estándar.
    const configData = await fetchConfigByKey('FUEL_PRICE_PER_LITER');

    if (configData && configData.value) {
        // Aseguramos que el valor es un número para los cálculos.
        return Number(configData.value); 
    }
    
    console.warn("La clave 'price_per_liter' no se encontró o no tiene un valor válido en la tabla 'config'.");
    return null;
};

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