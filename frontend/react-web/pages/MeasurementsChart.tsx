import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import type { IMeasurementDTO } from "@project/shared";
//uses charts
//colors for each data type
const palette: Record<string, string> = {
    moisture: "#378ADD",
    soil:     "#1D9E75",
    temp:     "#D85A30",
};
//chart component for measurements
export default function MeasurementsChart({ measurements }: { measurements: IMeasurementDTO[] }) {
    //stores reference to canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        //stops if canvas is not ready, or no data exists
        if (!canvasRef.current || measurements.length === 0) return;
        //x axis labels: transforms timestamps into readable labels
        const labels = measurements.map(m =>
            new Date(m.timestamp).toLocaleString("sl-SI", {
                month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit"
            })
        );
        //for eah measurement type, creates a dataset with values and styling
        //removes duplicates - flexible chart
        const keys = [...new Set(measurements.flatMap(m => Object.keys(m.values)))];
        //each key becomes a line in the chart
        const datasets = keys.map((key) => ({
            label: key,
            data: measurements.map(m => m.values[key] ?? null),
            borderColor: palette[key] ?? "#888",
            backgroundColor: (palette[key] ?? "#888") + "22",
            yAxisID: key === "moisture" ? "yLeft" : "yRight",
            //smorth curves with tension, and points for better visibility
            tension: 0.4,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2,
            fill: key === "moisture",
        }));
        //overrides legend size calculations
        const legendSpacingPlugin = {
            id: "legendSpacing",
            beforeInit(chart: any) {
                //stores original legend fit function
                const originalFit = chart.legend.fit;
                //increses height, adds extra spacing below legend
                chart.legend.fit = function () {
                    originalFit.call(this);
                    this.height += 20;
                };
            }
        };

        const chart = new Chart(canvasRef.current, {
            type: "line",
            data: { labels, datasets },
            plugins: [legendSpacingPlugin],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                color: "#ffffff",
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: {
                        position: "top",
                        labels: { usePointStyle: true, padding: 40, color: "#ffffff" }
                    },
                    tooltip: { mode: "index", intersect: false }
                },
                scales: {
                    yLeft: {
                        type: "linear",
                        position: "left",
                        title: { display: true, text: "moisture (%)", color: "#ffffff" },
                        ticks: { color: "#ffffff" },
                        grid: { drawOnChartArea: true, color: "rgba(255,255,255,0.1)" },
                    },
                    yRight: {
                        type: "linear",
                        position: "right",
                        title: { display: true, text: "soil / temp", color: "#ffffff" },
                        ticks: { color: "#ffffff" },
                        grid: { drawOnChartArea: false },
                    },
                    x: {
                        ticks: { maxRotation: 30, color: "#ffffff" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [measurements]);

    return (
        <div style={{ position: "relative", height: "320px" }}>
            <canvas ref={canvasRef} />
        </div>
    );
}