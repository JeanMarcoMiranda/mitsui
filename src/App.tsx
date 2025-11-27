"use client"

import { useState } from "react"

import {
  fetchGasPrice,
  fetchHybridVersionsDetailed,
  fetchMaxFuelEfficiencyByModelId,
  fetchBrandNameById,
  fetchModelNameById
} from "./api/services/vehicleService"
import type { Version } from "./api/types"

import StepOne from "./pages/calculator/step-one"
import StepTwo from "./pages/calculator/step-two"
import StepThree from "./pages/calculator/step-three"

export interface FormData {
  brandId: number // ID de la marca seleccionada
  modelId: number // ID del modelo seleccionado
  monthlyExpense: number // Gasto mensual en Soles
}

interface HybridComparison extends Version {
  // Usamos 'any' o un tipo específico, ya que viene de un deep join
  models: {
    id: number;
    name: string; // Nombre del modelo
    brands: {
      name: string; // Nombre de la marca
    }
  }
  distance: number;
  savings: number;
}

export interface CalculatedData {
  currentCarName: string // Nombre de la marca y modelo del usuario
  currentFuelEfficiency: number // Rendimiento (km/galón) del auto del usuario
  monthlyDistance: number // Distancia mensual recorrida por el auto actual
  hybridComparisons: HybridComparison[]
  gasPricePerLiter: number // Precio de la gasolina (necesario para la UI)
}

function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    brandId: 0,
    modelId: 0,
    monthlyExpense: 0,
  })
  const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(null)
  const [selectedHybrid, setSelectedHybrid] = useState<string>("")
  const [error, setError] = useState<string | null>(null) // Para manejar errores

  // 🔄 La función de cálculo ahora es asíncrona
  const calculateData = async (data: FormData): Promise<CalculatedData | null> => {
    // 1. Obtener datos clave de la DB
    const [
      maxCurrentFuelEfficiency, // 👈 Ahora obtenemos el valor máximo directamente
      hybridVersionsRaw,
      gasPrice,
      brandName,
      modelName
    ] = await Promise.all([
      // 🔑 CAMBIO CLAVE: Usamos la nueva función con modelId
      fetchMaxFuelEfficiencyByModelId(data.modelId),
      fetchHybridVersionsDetailed(),
      fetchGasPrice(),
      fetchBrandNameById(data.brandId),
      fetchModelNameById(data.modelId)
    ]);

    // Manejo de datos insuficientes
    // Verificamos que el rendimiento del auto del usuario sea un valor positivo
    if (!maxCurrentFuelEfficiency || !hybridVersionsRaw || !gasPrice || maxCurrentFuelEfficiency <= 0) {
      setError("Faltan datos clave (rendimiento, híbridos o precio de gasolina) de la base de datos, o el rendimiento del auto del usuario es inválido.")
      return null;
    }

    // Convertir el rendimiento máximo a número (aunque la función ya lo hace, es una buena práctica)
    const currentFuelEfficiency = Number(maxCurrentFuelEfficiency);

    // 2. Cálculo de la distancia mensual con el auto actual (en Km)
    // Fórmula: Litros = Gasto / PrecioLitro; Distancia = Litros * Rendimiento(Km/Litro)
    const litersPerMonth = data.monthlyExpense / gasPrice
    const monthlyDistance = litersPerMonth * currentFuelEfficiency

    // 3. Cálculo de las comparaciones con híbridos
    const hybridComparisons = hybridVersionsRaw.map((hybrid: any) => {
      const hybridFuelEfficiency = Number(hybrid.km_per_gallon);

      // ... (El resto de la lógica de comparación se mantiene igual) ...
      // Distancia que el híbrido recorre con el MISMO GASTO mensual
      const hybridDistance = litersPerMonth * hybridFuelEfficiency;

      // Gasto Equivalente: Gasto del híbrido para recorrer la 'monthlyDistance' del auto actual
      // GastoEquiv = (Distancia / RendimientoHíbrido) * PrecioLitro
      const equivalentHybridExpense = (monthlyDistance / hybridFuelEfficiency) * gasPrice;

      // Ahorro: Gasto Actual - Gasto Equivalente del Híbrido
      const savings = data.monthlyExpense - equivalentHybridExpense;

      return {
        ...hybrid,
        distance: hybridDistance,
        savings: Math.max(0, savings), // Asegura que el ahorro no sea negativo
      } as HybridComparison;
    });

    const currentCarName = `${brandName} ${modelName}`;

    return {
      currentCarName,
      currentFuelEfficiency,
      monthlyDistance,
      hybridComparisons,
      gasPricePerLiter: gasPrice,
    }
  }

  const handleStepOneSubmit = async (data: FormData) => {
    setError(null)
    setFormData(data)

    const calculated = await calculateData(data)

    if (calculated) {
      setCalculatedData(calculated)
      setStep(2)
    } else {
      // El error ya fue registrado en setError dentro de calculateData
      console.error("No se pudo completar el cálculo.")
    }
  }

  const handleStepTwoSubmit = (hybridId: string) => {
    setSelectedHybrid(hybridId)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setFormData({
      brandId: 0,
      modelId: 0,
      monthlyExpense: 0,
    })
    setCalculatedData(null)
    setSelectedHybrid("")
    setError(null)
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-100 text-red-800">
        <p>Ocurrió un error crítico:</p>
        <p className="font-mono">{error}</p>
        <button onClick={handleReset} className="mt-4 p-2 bg-red-500 text-white rounded">Reiniciar</button>
      </div>
    )
  }

  return (
    <>
      {step === 1 && <StepOne onSubmit={handleStepOneSubmit} />}
      {step === 2 && calculatedData && (
        <StepTwo calculatedData={calculatedData} onSubmit={handleStepTwoSubmit} onBack={() => setStep(1)} />
      )}
      {step === 3 && <StepThree />}
    </>
  )
}

export default App
