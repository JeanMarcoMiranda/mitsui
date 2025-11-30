import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FormData } from "@/App"
import MitsuiLogo from "@/assets/mitsui_logo.svg"
import BannerToyota from "@/assets/banner_toyota_2.jpg";
import Frase from "@/assets/frase.svg"
import { fetchAllBrands, fetchModelsByBrandId } from "@/api/services/vehicleService"
import type { Brand, Model } from "@/api/types"

interface StepOneProps {
    onSubmit: (data: FormData) => void
}

/**
 * Primer paso de la calculadora: recopila la marca, el modelo actual del usuario
 * y su gasto mensual en combustible.
 */
function StepOne({ onSubmit }: StepOneProps) {
    const [brands, setBrands] = useState<Brand[]>([])
    const [models, setModels] = useState<Model[]>([])
    const [loadingBrands, setLoadingBrands] = useState(true)
    const [loadingModels, setLoadingModels] = useState(false)

    const [selectedBrand, setSelectedBrand] = useState("")
    const [selectedModel, setSelectedModel] = useState("")
    const [expense, setExpense] = useState("")

    /**
     * Efecto para cargar todas las marcas al montar el componente.
     */
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const data = await fetchAllBrands()
                if (data) {
                    setBrands(data)
                }
            } catch (error) {
                console.error("Error fetching brands:", error)
            } finally {
                setLoadingBrands(false)
            }
        }
        fetchBrands()
    }, [])

    /**
     * Efecto para cargar los modelos asociados cuando se selecciona una nueva marca.
     */
    useEffect(() => {
        if (!selectedBrand) {
            setModels([])
            return
        }

        const fetchModels = async () => {
            setLoadingModels(true)
            setSelectedModel("") // Limpiar el modelo seleccionado al cambiar de marca
            try {
                const brandId = parseInt(selectedBrand)
                const data = await fetchModelsByBrandId(brandId)
                if (data) {
                    setModels(data)
                }
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
        const brandId = parseInt(selectedBrand)
        const modelId = parseInt(selectedModel)
        const monthlyExpense = Number.parseFloat(expense)

        // Validar que todos los campos sean números válidos y el gasto sea positivo.
        if (
            !isNaN(brandId) &&
            !isNaN(modelId) &&
            !isNaN(monthlyExpense) &&
            monthlyExpense > 0
        ) {
            onSubmit({
                brandId: brandId,
                modelId: modelId,
                monthlyExpense: monthlyExpense,
            })
        } else {
            console.error("Datos de formulario inválidos o incompletos.")
        }
    }

    const isValid = selectedBrand && selectedModel && expense && Number.parseFloat(expense) > 0

    return (
        <div className="min-h-screen flex flex-col bg-[#0a2540]">
            {/* Header: Contiene el logo de la marca. */}
            <header className="bg-[#1e3a52] text-white py-5 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <div className="h-8 px-4 rounded flex items-center justify-center">
                            <img src={MitsuiLogo} alt="Mitsui Logo" className="h-8 w-auto" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section: Imagen de fondo y frase promocional. */}
            <div className="relative w-full">
                {/* Hero como background */}
                <div
                    className="relative h-64 md:h-96 lg:h-[580px] w-full bg-cover bg-no-repeat bg-center"
                    style={{ backgroundImage: `url(${BannerToyota})`, backgroundPosition: "center bottom" }}
                >
                    {/* Gradiente pequeño en la parte baja */}
                    <div className="absolute bottom-0 left-0 w-full h-[20%] bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    {/* Logo frase */}
                    <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2">
                        <img src={Frase} alt="Frase" className="h-20 w-auto" />
                    </div>
                </div>
            </div>

            {/* Main Content: Título y formulario. */}
            <main className="font-sans flex-1 px-4 py-8 bg-[#020202]">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="font-bold text-2xl md:text-3xl text-white mb-3">
                            Compara cuánto podrías ahorrar con un <span className="text-[#00d4ff]">Toyota híbrido</span>
                        </h1>
                    </div>
                    <div className="bg-[#00385e] p-6 rounded-2xl">
                        <p className="text-white/90 text-sm mb-6">
                            Responde estas dos preguntas y descubre tu ahorro en segundos.
                        </p>
                        {/* Form Card: Contiene los campos de selección e ingreso. */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl space-y-5">
                            <div className="space-y-3">
                                <Label htmlFor="brand" className="text-[#0a2540] text-base font-semibold">
                                    ¿Qué modelo es tu auto o camioneta?
                                </Label>

                                {/* Select de Marca */}
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

                                {/* Select de Modelo (dependiente de la marca) */}
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

                            {/* Campo de Gasto Mensual */}
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
                            {/* Botón de envío (habilitado solo si los datos son válidos) */}
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

            {/* Footer: Disclaimer legal. */}
            <footer className="font-sans py-6 px-4 bg-[#020202]">
                <p className="text-xs text-white/70 text-center max-w-2xl mx-auto leading-relaxed">
                    * Los modelos de otras marcas se muestran únicamente con fines comparativos. Los cálculos son estimados y
                    tienen carácter referencial. Toyota Perú se reserva el derecho de realizar modificaciones sin previo aviso.
                </p>
            </footer>
        </div>
    )
}

export default StepOne