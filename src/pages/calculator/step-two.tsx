import type { CalculatedData } from "@/App"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import MitsuiLogo from "@/assets/mitsui_logo.svg"

interface StepTwoProps {
    calculatedData: CalculatedData
    onSubmit: (hybridId: string) => void
    onBack: () => void
}

function StepTwo({ calculatedData, onSubmit, onBack }: StepTwoProps) {
    // El ID del híbrido seleccionado es el ID de la versión
    const [selectedHybrid, setSelectedHybrid] = useState<string>("")

    const handleSubmit = () => {
        // El ID es de tipo 'number' en la DB, pero se maneja como string en el state
        if (selectedHybrid) {
            onSubmit(selectedHybrid)
        }
    }

    // Para formatear números grandes con comas y dos decimales
    const formatDistance = (distance: number) => {
        return distance.toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="bg-[#1e3a52] text-white py-6 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <img src={MitsuiLogo} alt="Mitsui Logo" className="h-8 w-auto" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-5xl mx-auto">
                    {/* Distance Result */}
                    <div className="text-center mb-10">
                        <p className="text-gray-500 text-2xl font-semibold mb-1">
                            El recorrido mensual con tu {calculatedData.currentCarName} es de
                        </p>
                        <p className="text-5xl md:text-3xl font-bold text-gray-800 mb-8">
                            {formatDistance(calculatedData.monthlyDistance)} Km.
                        </p>
                    </div>

                    {/* Comparison Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">
                            Comparado con los modelos híbridos Toyota:
                        </h2>

                        {/* Hybrid Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                            {calculatedData.hybridComparisons.map((hybrid) => {
                                // 🔑 ADAPTACIÓN CLAVE: Acceder a los datos del Deep JOIN
                                const modelName = hybrid.models.name || "Modelo Desconocido";
                                const brandName = hybrid.models.brands.name || "Marca Desconocida";
                                // Usamos specific_version como la variante
                                const variantName = hybrid.specific_version;
                                // Usamos image_url de la tabla versions
                                const imageUrl = hybrid.image_url || "/placeholder.svg";

                                // El ID de la versión se usa para la selección
                                const hybridId = hybrid.id.toString();

                                return (
                                    <Card
                                        key={hybridId}
                                        onClick={() => setSelectedHybrid(hybridId)}
                                        className={cn(
                                            "p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border-2",
                                            selectedHybrid === hybridId
                                                ? "border-[#00bcd4] bg-[#00bcd4]/5 shadow-lg"
                                                : "border-gray-200 hover:border-[#00bcd4]/50"
                                        )}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            {/* Car Image */}
                                            <div className="w-full h-32 flex items-center justify-center mb-4">
                                                <img
                                                    src={imageUrl} // 🔑 Adaptado a image_url
                                                    alt={`${brandName} ${modelName}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>

                                            {/* Car Name (Marca + Modelo) */}
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">
                                                {brandName} {modelName}
                                            </h3>

                                            {/* Variant */}
                                            <p className="text-sm text-gray-600 mb-4">
                                                {variantName} {/* 🔑 Adaptado a specific_version */}
                                            </p>

                                            {/* Distance */}
                                            <p className="text-3xl font-bold text-[#00bcd4] mb-1">
                                                {formatDistance(hybrid.distance)} km
                                            </p>

                                            {/* Subtitle */}
                                            <p className="text-sm text-gray-600">
                                                Con el mismo gasto mensual.
                                            </p>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Selection Text */}
                        <p className="text-center text-gray-700 text-base mb-8">
                            ¿Con qué Toyota te gustaría quedarte? Selecciona uno de los modelos de la lista.
                        </p>

                        {/* Submit Button - Centered */}
                        <div className="flex justify-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedHybrid}
                                className="h-14 px-16 bg-[#00bcd4] hover:bg-[#00a3b8] text-white text-lg font-bold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Disclaimer */}
            <footer className="py-6 px-4 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
                    * Los resultados son estimados en base a consumos promedio. Las cifras pueden variar según condiciones de
                    manejo, terreno y mantenimiento. El uso de otras marcas es únicamente con fines comparativos e informativos.
                </p>
            </footer>
        </div>
    )
}

export default StepTwo