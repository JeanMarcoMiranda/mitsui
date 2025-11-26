"use client"

import { useState } from "react"
import StepOne from "./pages/calculator/step-one"
import StepTwo from "./pages/calculator/step-two"
import StepThree from "./pages/calculator/step-three"

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

  const handleStepOneSubmit = () => {
    setStep(2)
  }

  const handleStepTwoSubmit = () => {
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
  }

  return (
    <>
      {step === 1 && <StepOne onSubmit={handleStepOneSubmit}/>}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
    </>
  )
}

export default App
