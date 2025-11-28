"use client"

import { useState } from "react"
import {
  fetchGasPrice,
  fetchToyotaHybridVersions,
  fetchMaxFuelEfficiencyByModelId,
  fetchBrandNameById,
  fetchModelNameById,
  calculateMonthlyKm,
  calculateHybridKm,
  calculateHybridMonthlySpending,
  calculateMonthlySavings
} from "./api/services/vehicleService"

import StepOne from "./pages/calculator/step-one"
import StepTwo from "./pages/calculator/step-two"
import StepThree from "./pages/calculator/step-three"

// Documentación de las estructuras de datos (Interfaces)
// Estas interfaces definen la forma de los datos utilizados en el estado del componente.

/**
 * Datos del formulario de entrada del usuario.
 */
export interface FormData {
  brandId: number
  modelId: number
  monthlyExpense: number
}

/**
 * Estructura de un vehículo híbrido con los cálculos de ahorro adjuntos.
 */
export interface HybridComparison {
  id: number
  specific_version: string
  km_per_gallon: number
  image_url: string | null
  models: {
    id: number
    name: string
    brands: {
      id: number
      name: string
    }
  }
  distance: number // Km que recorre el híbrido con el mismo gasto mensual del usuario.
  monthlySpending: number // Gasto del híbrido para recorrer la misma distancia mensual del usuario.
  savings: number // Ahorro mensual estimado.
}

/**
 * Resultados consolidados del cálculo de ahorro.
 */
export interface CalculatedData {
  currentCarName: string
  currentFuelEfficiency: number
  monthlyDistance: number
  monthlyExpense: number
  
  hybridComparisons: HybridComparison[]
  
  gasPricePerLiter: number
}

/**
 * Datos del híbrido seleccionado para la vista final de resultados.
 */
export interface SelectedHybridData extends HybridComparison {
  annualSavings: number // Ahorro proyectado para un año (savings × 12).
}

function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    brandId: 0,
    modelId: 0,
    monthlyExpense: 0,
  })
  const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(null)
  const [selectedHybrid, setSelectedHybrid] = useState<SelectedHybridData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Ejecuta la lógica principal de cálculo: obtiene datos, valida y calcula las comparaciones.
   * @param data - Datos de entrada del formulario.
   * @returns Los datos de comparación consolidados o null en caso de error.
   */
  const calculateData = async (data: FormData): Promise<CalculatedData | null> => {
    try {
      setLoading(true)
      setError(null)

      // Ejecutar todas las llamadas a la API de forma concurrente.
      const [
        currentFuelEfficiency,
        hybridVersionsRaw,
        gasPrice,
        brandName,
        modelName
      ] = await Promise.all([
        fetchMaxFuelEfficiencyByModelId(data.modelId),
        fetchToyotaHybridVersions(),
        fetchGasPrice(),
        fetchBrandNameById(data.brandId),
        fetchModelNameById(data.modelId)
      ])

      // Validación de datos críticos obtenidos
      if (!currentFuelEfficiency || currentFuelEfficiency <= 0) {
        throw new Error("No se encontró información de rendimiento para este modelo.")
      }

      if (!hybridVersionsRaw || hybridVersionsRaw.length === 0) {
        throw new Error("No se encontraron versiones híbridas de Toyota disponibles.")
      }

      if (!gasPrice || gasPrice <= 0) {
        throw new Error("No se pudo obtener el precio de la gasolina.")
      }

      if (!brandName || !modelName) {
        throw new Error("No se pudo obtener información del vehículo seleccionado.")
      }

      // Calcular la distancia que el usuario recorre actualmente con su gasto.
      const monthlyDistance = calculateMonthlyKm(
        data.monthlyExpense,
        gasPrice,
        currentFuelEfficiency
      )

      // Mapear y calcular los ahorros para cada versión híbrida.
      const hybridComparisons: HybridComparison[] = hybridVersionsRaw.map((hybrid: any) => {
        const hybridFuelEfficiency = Number(hybrid.km_per_gallon)

        // Distancia que recorre el híbrido con el MISMO gasto mensual del usuario.
        const distance = calculateHybridKm(
          data.monthlyExpense,
          gasPrice,
          hybridFuelEfficiency
        )

        // Gasto del híbrido para recorrer los MISMOS km que el usuario.
        const monthlySpending = calculateHybridMonthlySpending(
          monthlyDistance,
          gasPrice,
          hybridFuelEfficiency
        )

        const savings = calculateMonthlySavings(
          data.monthlyExpense,
          monthlySpending
        )

        return {
          id: hybrid.id,
          specific_version: hybrid.specific_version,
          km_per_gallon: hybridFuelEfficiency,
          image_url: hybrid.image_url,
          models: hybrid.models,
          // Redondear a 2 decimales y asegurar que el ahorro no sea negativo.
          distance: Math.round(distance * 100) / 100,
          monthlySpending: Math.round(monthlySpending * 100) / 100,
          savings: Math.max(0, Math.round(savings * 100) / 100)
        }
      })

      // Ordenar las comparaciones para mostrar primero los que generan mayor ahorro.
      hybridComparisons.sort((a, b) => b.savings - a.savings)

      const currentCarName = `${brandName} ${modelName}`

      return {
        currentCarName,
        currentFuelEfficiency,
        monthlyDistance: Math.round(monthlyDistance * 100) / 100,
        monthlyExpense: data.monthlyExpense,
        hybridComparisons,
        gasPricePerLiter: gasPrice,
      }

    } catch (err) {
      // Manejo y registro de errores
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al calcular"
      setError(errorMessage)
      console.error("Error en calculateData:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleStepOneSubmit = async (data: FormData) => {
    setFormData(data)
    const calculated = await calculateData(data)

    if (calculated) {
      setCalculatedData(calculated)
      setStep(2)
    }
  }

  const handleStepTwoSubmit = (hybridId: number) => {
    if (!calculatedData) return

    // Buscar el híbrido seleccionado por su ID
    const hybrid = calculatedData.hybridComparisons.find(h => h.id === hybridId)
    
    if (!hybrid) {
      setError("No se encontró el híbrido seleccionado")
      return
    }

    // Calcular el ahorro anual para mostrarlo en el paso final.
    setSelectedHybrid({
      ...hybrid,
      annualSavings: hybrid.savings * 12
    })
    
    setStep(3)
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setCalculatedData(null)
    } else if (step === 3) {
      setStep(2)
      setSelectedHybrid(null)
    }
  }

  const handleReset = () => {
    setStep(1)
    setFormData({
      brandId: 0,
      modelId: 0,
      monthlyExpense: 0,
    })
    setCalculatedData(null)
    setSelectedHybrid(null)
    setError(null)
  }

  // Pantalla de error (se muestra si hay algún mensaje en el estado `error`)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Ocurrió un error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleReset}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // Pantalla de carga (se muestra mientras `loading` es true)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Calculando tu ahorro...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {step === 1 && (
        <StepOne onSubmit={handleStepOneSubmit} />
      )}
      
      {step === 2 && calculatedData && (
        <StepTwo
          calculatedData={calculatedData}
          onSubmit={handleStepTwoSubmit}
          onBack={handleBack}
        />
      )}
      
      {step === 3 && calculatedData && selectedHybrid && (
        <StepThree
          calculatedData={calculatedData}
          selectedHybrid={selectedHybrid}
          onReset={handleReset}
          onBack={handleBack}
        />
      )}
    </>
  )
}

export default App