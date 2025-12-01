import type { CalculatedData } from "@/App"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useState } from "react"
import MitsuiLogo from "@/assets/mitsui_logo.svg"

interface StepTwoProps {
    calculatedData: CalculatedData
    onSubmit: (hybridId: number) => void
}

/**
 * Segundo paso de la calculadora.
 * Muestra la distancia mensual actual del usuario y presenta las tarjetas
 * de comparación con los modelos híbridos Toyota. Permite al usuario seleccionar un híbrido.
 */
function StepTwo({ calculatedData, onSubmit }: StepTwoProps) {
    const [selectedHybrid, setSelectedHybrid] = useState<number | null>(null)

    const handleSubmit = () => {
        // La validación se realiza en el atributo 'disabled' del botón.
        if (selectedHybrid !== null) {
            onSubmit(selectedHybrid)
        }
    }

    /**
     * Formatea un número para usar separadores de miles y dos decimales.
     * @param distance - Número a formatear (kilómetros o dinero).
     * @returns Cadena de texto formateada (e.g., "1.234,56").
     */
    const formatDistance = (distance: number) => {
        return distance.toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
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

            {/* Main Content: Muestra resultados clave y la lista de comparaciones. */}
            <main className="flex-1 px-4 py-10 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto">
                    {/* Sección de resultado de la distancia mensual actual del usuario. */}
                    <div className="text-center mb-10">
                        <p className="text-gray-500 text-base md:text-lg font-medium mb-2">
                            El recorrido mensual con tu {calculatedData.currentCarName} es de
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-gray-800">
                            {formatDistance(calculatedData.monthlyDistance)} Km
                        </p>
                    </div>

                    {/* Sección de comparación con híbridos Toyota. */}
                    <div className="mb-8">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-700 text-center mb-6">
                            Comparado con los modelos híbridos Toyota:
                        </h2>

                        {/* Grid de Tarjetas Híbridas (selección de modelo). */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {calculatedData.hybridComparisons.map((hybrid) => {
                                const modelName = hybrid.models.name
                                const brandName = hybrid.models.brands.name
                                const variantName = hybrid.specific_version
                                // Usamos un placeholder si la URL de la imagen es nula.
                                const imageUrl = hybrid.image_url || "/hybrid-car.jpg"
                                const hybridId = hybrid.id

                                return (
                                    <Card
                                        key={hybridId}
                                        onClick={() => setSelectedHybrid(hybridId)}
                                        className={cn(
                                            "p-5 cursor-pointer transition-all duration-200 border-2",
                                            // Resalta la tarjeta si está seleccionada.
                                            selectedHybrid === hybridId
                                                ? "border-[#00bcd4] bg-[#00bcd4]/5 shadow-md"
                                                : "border-gray-200 hover:border-[#00bcd4]/40 hover:shadow-md",
                                        )}
                                    >
                                        <div className="flex flex-col items-center text-center">
                                            {/* Contenedor de la imagen del coche */}
                                            <div className="w-full h-28 flex items-center justify-center mb-3">
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={`${brandName} ${modelName}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>

                                            {/* Nombre del modelo */}
                                            <h3 className="font-bold text-gray-800 text-base mb-0.5">
                                                {brandName} {modelName}
                                            </h3>

                                            {/* Versión específica */}
                                            <p className="text-xs text-gray-500 mb-3">{variantName}</p>

                                            {/* Distancia que recorre el híbrido con el mismo gasto */}
                                            <p className="text-2xl md:text-3xl font-bold text-[#00bcd4] mb-0.5">
                                                {formatDistance(hybrid.distance)} km
                                            </p>

                                            {/* Subtítulo descriptivo del dato */}
                                            <p className="text-xs text-gray-500">Con el mismo gasto mensual</p>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Indicación para la selección y botón de navegación. */}
                        <p className="text-center text-gray-600 text-sm md:text-base mb-6">
                            ¿Con qué Toyota te gustaría quedarte? Selecciona uno de los modelos.
                        </p>

                        {/* Botón de envío, habilitado solo si un híbrido ha sido seleccionado. */}
                        <div className="flex justify-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedHybrid === null}
                                className="h-12 px-12 bg-[#00bcd4] hover:bg-[#00a3b8] text-white text-base font-semibold rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer: Descargo de responsabilidad legal. */}
            <footer className="py-4 px-4 bg-white border-t border-gray-100">
                <p className="text-[11px] text-gray-500 text-center max-w-3xl mx-auto leading-relaxed">
                    * Los resultados son estimados en base a consumos promedio. Las cifras pueden variar según condiciones de
                    manejo, terreno y mantenimiento. El uso de otras marcas es únicamente con fines comparativos e informativos.
                </p>
            </footer>
        </div>
    )
}

export default StepTwo