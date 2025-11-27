import type { CalculatedData } from "@/App"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface StepTwoProps {
    calculatedData: CalculatedData
    onSubmit: (hybridId: string) => void
    onBack: () => void
}

function StepTwo({ calculatedData, onSubmit, onBack }: StepTwoProps) {
    const [selectedHybrid, setSelectedHybrid] = useState("")

      const handleSubmit = () => {
    if (selectedHybrid) {
      onSubmit(selectedHybrid)
    }
  }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-[#1a1a1a] text-white py-8 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center">
                    <p className="text-4xl font-semibold">MITSUI</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Distance Result */}
                    <div className="text-center mb-8">
                        <p className="text-muted-foreground mb-2">El recorrido mensual con tu</p>
                        <p className="text-xl font-semibold text-toyota-dark mb-2">{calculatedData.currentCarName} es de</p>
                        <p className="text-4xl md:text-5xl font-bold text-primary">
                            {calculatedData.monthlyDistance.toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}{" "}
                            Km.
                        </p>
                    </div>

                    {/* Comparison Section */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-center mb-2">Comparado con los modelos híbridos Toyota:</h2>
                        <p className="text-center text-muted-foreground mb-6">
                            ¿Con qué Toyota te gustaría quedarte? Selecciona uno de los modelos de la lista.
                        </p>

                        {/* Hybrid Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {calculatedData.hybridComparisons.map((hybrid) => (
                                <Card
                                    key={hybrid.id}
                                    onClick={() => setSelectedHybrid(hybrid.id)}
                                    className={cn(
                                        "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg relative",
                                        selectedHybrid === hybrid.id ? "ring-2 ring-primary bg-primary/5" : "hover:border-primary/50",
                                    )}
                                >
                                    {selectedHybrid === hybrid.id && (
                                        <CheckCircle2 className="absolute top-3 right-3 h-6 w-6 text-primary" />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <img
                                            src={hybrid.image || "/placeholder.svg"}
                                            alt={hybrid.name}
                                            className="w-28 h-20 object-contain"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-toyota-dark">{hybrid.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">{hybrid.variant}</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {hybrid.distance.toLocaleString("es-PE", {
                                                    minimumFractionDigits: 1,
                                                    maximumFractionDigits: 1,
                                                })}{" "}
                                                km
                                            </p>
                                            <p className="text-xs text-muted-foreground">Con el mismo gasto mensual.</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 justify-center mt-8">
                        <Button variant="outline" onClick={onBack} className="h-12 px-8 bg-transparent">
                            Atrás
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedHybrid}
                            className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer Disclaimer */}
            <footer className="py-4 px-4 text-center">
                <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                    * Los resultados son estimados en base a consumos promedio. Las cifras pueden variar según condiciones de
                    manejo, terreno y mantenimiento. El uso de otras marcas es únicamente con fines comparativos e informativos.
                </p>
            </footer>
        </div>
    )
}

export default StepTwo