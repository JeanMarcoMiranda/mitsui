import { useState } from "react"
import { carModels } from "../../lib/car-data"

interface StepOneProps {
    onSubmit: () => void
}

function StepOne({ onSubmit }: StepOneProps) {
    const [brand, setBrand] = useState("")
    const [model, setModel] = useState("")
    const [expense, setExpense] = useState("")

    const availableModels = brand ? carModels[brand] || [] : []

    const handleSubmit = () => {
        onSubmit()
    }

    const isValid = brand && model && expense && Number.parseFloat(expense) > 0

    return (
        <div className="min-h-screen flex flex-col">

        </div>
    )
}

export default StepOne