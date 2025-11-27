import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormData } from "@/App"
import MitsuiLogo from "@/assets/mitsui_logo.svg"
import Frase from "@/assets/frase.svg"
import { getBrands, getModelsByBrand, type Brand, type Model } from "@/api/services/vehicleService"

interface StepOneProps {
    onSubmit: (data: FormData) => void
}

function StepOne({ onSubmit }: StepOneProps) {
    const [brands, setBrands] = useState<Brand[]>([])
    const [models, setModels] = useState<Model[]>([])
    const [loadingBrands, setLoadingBrands] = useState(true)
    const [loadingModels, setLoadingModels] = useState(false)

    const [selectedBrand, setSelectedBrand] = useState("")
    const [selectedModel, setSelectedModel] = useState("")
    const [expense, setExpense] = useState("")

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await getBrands()
                setBrands(data)
            } catch (error) {
                console.error("Error fetching brands:", error)
            } finally {
                setLoadingBrands(false)
            }
        }
        fetchBrands()
    }, [])

    useEffect(() => {
        if (!selectedBrand) {
            setModels([])
            return
        }

        const fetchModels = async () => {
            setLoadingModels(true)
            setSelectedModel("")
            try {
                const brandId = parseInt(selectedBrand)
                const data = await getModelsByBrand(brandId)
                setModels(data)
            } catch (error) {
                console.error("Error fetching models:", error)
                setModels([])
            } finally {
                setLoadingModels(false)
            }
        }
        fetchModels()
    }, [selectedBrand])

    const handleSubmit = () => {
        if (selectedBrand && selectedModel && expense) {
            const brandName = brands.find(b => b.id.toString() === selectedBrand)?.name || ""
            const modelName = models.find(m => m.id.toString() === selectedModel)?.name || ""

            if (brandName && modelName) {
                onSubmit({
                    brand: brandName,
                    model: modelName,
                    monthlyExpense: Number.parseFloat(expense),
                })
            }
        }
    }

    const isValid = selectedBrand && selectedModel && expense && Number.parseFloat(expense) > 0

    return (
        <div className="min-h-screen flex flex-col bg-[#0a2540]">
            {/* Header */}
            <header className="bg-[#1a3143] text-white py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <img src={MitsuiLogo} alt="Mitsui Logo" className="h-8 w-auto" />
                    </div>
                </div>
            </header>

            {/* Hero Section with Image */}
            <div className="relative w-full">
                <div className="relative h-48 md:h-64 overflow-hidden">
                    {/* Image placeholder - En producción aquí irá tu imagen real */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-[#0a2540]">
                        <img
                            src="https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=1200&q=80"
                            alt="Toyota Hybrid Vehicles"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>

                    {/* Badge "HÍBRIDOS TOYOTA" */}
                    <div className="absolute top-2 md:top-6 left-1/2 -translate-x-1/2 z-10">
                        <img src={Frase} alt="Frase" className="h-20 w-auto" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 px-4 py-8 bg-[#020202]">
                <div className="max-w-md mx-auto">
                    {/* Title Section */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                            Compara cuánto podrías ahorrar con un <span className="text-[#00d4ff]">Toyota híbrido</span>
                        </h1>
                    </div>

                    <div className="bg-[#00385e] p-6 rounded-2xl">
                        <p className="text-white/90 text-sm mb-6">
                            Responde estas dos preguntas y descubre tu ahorro en segundos.
                        </p>
                        {/* Form Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl space-y-5">
                            {/* Brand and Model Section */}
                            <div className="space-y-3">
                                <Label htmlFor="brand" className="text-[#0a2540] text-base font-semibold">
                                    ¿Qué modelo es tu auto o camioneta?
                                </Label>

                                {/* Brand Select */}
                                <Select
                                    value={selectedBrand}
                                    onValueChange={(val) => {
                                        setSelectedBrand(val)
                                        setSelectedModel("")
                                    }}
                                    disabled={loadingBrands}
                                >
                                    <SelectTrigger
                                        id="brand"
                                        className="h-12 bg-[#e5e8f7] border-0 text-[#0a2540] font-medium w-full"
                                    >
                                        <SelectValue placeholder={loadingBrands ? "Cargando marcas..." : "Marca"} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-40">
                                        {brands.map((b) => (
                                            <SelectItem key={b.id} value={b.id.toString()}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Model Select */}
                                <Select
                                    value={selectedModel}
                                    onValueChange={setSelectedModel}
                                    disabled={!selectedBrand || loadingModels}
                                >
                                    <SelectTrigger className="h-12 bg-[#e5e8f7] border-0 text-[#0a2540] font-medium w-full">
                                        <SelectValue placeholder={loadingModels ? "Cargando modelos..." : "Modelo"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {models.map((m) => (
                                            <SelectItem key={m.id} value={m.id.toString()}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Monthly Expense Input */}
                            <div className="space-y-3">
                                <Label htmlFor="expense" className="text-[#0a2540] text-base font-semibold">
                                    ¿Cuánto gastas en gasolina al mes?
                                </Label>
                                <Input
                                    id="expense"
                                    type="number"
                                    placeholder="Escribe el monto en soles. Ejemplo: 480"
                                    value={expense}
                                    onChange={(e) => setExpense(e.target.value)}
                                    className="h-12 bg-[#f0f4f8] border-0 text-[#0a2540] placeholder:text-[#0a2540]/50"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={!isValid}
                                className="h-12 mt-6 px-12 bg-[#00d4ff] hover:bg-[#00bfe6] text-white text-base font-semibold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </Button>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-4 bg-[#020202]">
                <p className="text-xs text-white/70 text-center max-w-2xl mx-auto leading-relaxed">
                    * Los modelos de otras marcas se muestran únicamente con fines comparativos. Los cálculos son estimados y
                    tienen carácter referencial. Toyota Perú se reserva el derecho de realizar modificaciones sin previo aviso.
                </p>
            </footer>
        </div>
    )
}

export default StepOne