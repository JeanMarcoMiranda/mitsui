"use client"

import { useState } from "react"
import StepOne from "./pages/calculator/step-one"
import StepTwo from "./pages/calculator/step-two"
import StepThree from "./pages/calculator/step-three"
import { carModels, FUEL_PRICE_PER_LITER, toyotaHybridModels } from "./lib/car-data"

export interface FormData {
  brand: string
  model: string
  monthlyExpense: number
}

export interface CalculatedData {
  currentCarName: string
  currentFuelEfficiency: number
  monthlyDistance: number
  hybridComparisons: {
    id: string
    name: string
    variant: string
    distance: number
    savings: number
    image: string
  }[]
}

function App() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    model: "",
    monthlyExpense: 0,
  })
  const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(null)
  const [selectedHybrid, setSelectedHybrid] = useState<string>("")

  const calculateData = (data: FormData): CalculatedData => {
    const brandModels = carModels[data.brand] || []
    const selectedModel = brandModels.find((m) => m.id === data.model)
    const currentFuelEfficiency = selectedModel?.fuelEfficiency || 13.0

    // Calcular distancia mensual con el auto actual
    const litersPerMonth = data.monthlyExpense / FUEL_PRICE_PER_LITER
    const monthlyDistance = litersPerMonth * currentFuelEfficiency

    // Calcular comparaciones con híbridos Toyota
    const hybridComparisons = toyotaHybridModels.map((hybrid) => {
      const hybridDistance = litersPerMonth * hybrid.fuelEfficiency
      const savings = data.monthlyExpense - (monthlyDistance / hybrid.fuelEfficiency) * FUEL_PRICE_PER_LITER

      return {
        id: hybrid.id,
        name: hybrid.name,
        variant: hybrid.variant,
        distance: hybridDistance,
        savings: Math.max(0, savings),
        image: hybrid.image,
      }
    })

    const brandName = data.brand.charAt(0).toUpperCase() + data.brand.slice(1)
    const modelName = selectedModel?.name || "Auto"

    return {
      currentCarName: `${brandName} ${modelName}`,
      currentFuelEfficiency,
      monthlyDistance,
      hybridComparisons,
    }
  }

  const handleStepOneSubmit = (data: FormData) => {
    setFormData(data)
    const calculated = calculateData(data)
    setCalculatedData(calculated)
    setStep(2)
  }

  const handleStepTwoSubmit = (hybridId: string) => {
    setSelectedHybrid(hybridId)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setFormData({
      brand: "",
      model: "",
      monthlyExpense: 0,
    })
    setCalculatedData(null)
    setSelectedHybrid("")
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
