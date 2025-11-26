import { useState } from "react"
import { carBrands, carModels } from "../../lib/car-data"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
            <header className="bg-[#1a1a1a] text-white py-8 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center">
                    <p className="text-4xl font-semibold">MITSUI</p>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="">
                        <h1 className="text-2xl md:text-3xl font-bold text-toyota-dark mb-3 text-balance">
                            Compara cuánto podrías ahorrar con un Toyota híbrido
                        </h1>
                        <p className="text-muted-foreground">Responde estas dos preguntas y descubre tu ahorro en segundos.</p>
                    </div>

                    <div className="space-y-6 bg-card p-6 rounded-xl shadow-sm border">
                        {/* Brand Select */}
                        <div className="space-y-2">
                            <Label htmlFor="brand" className="text-base font-medium">
                                ¿Qué modelo es tu auto o camioneta?
                            </Label>
                            <Select
                                value={brand}
                                onValueChange={(val) => {
                                    setBrand(val)
                                    setModel("")
                                }}
                            >
                                <SelectTrigger id="brand" className="h-12">
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {carBrands.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>


                        {/* Model Select */}
                        <div className="space-y-2">
                            <Select value={model} onValueChange={setModel} disabled={!brand}>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Modelo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableModels.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Monthly Expense Input */}
                        <div className="space-y-2">
                            <Label htmlFor="expense" className="text-base font-medium">
                                ¿Cuánto gastas en gasolina al mes?
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/</span>
                                <Input
                                    id="expense"
                                    type="number"
                                    placeholder="Escribe el monto en soles. Ejemplo: 480"
                                    value={expense}
                                    onChange={(e) => setExpense(e.target.value)}
                                    className="h-12 pl-10"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer Disclaimer */}
            <footer className="py-4 px-4 text-center">
                <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                    * Los modelos de otras marcas se muestran únicamente con fines comparativos. Los cálculos son estimados y
                    tienen carácter referencial. Toyota Perú se reserva el derecho de realizar modificaciones sin previo aviso.
                </p>
            </footer>
        </div>

    )
}

export default StepOne