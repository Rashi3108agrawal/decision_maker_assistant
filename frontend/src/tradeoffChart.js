import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function TradeoffChart({ metrics, isHovered = false }) {
  const data = {
    labels: ["Cost Efficiency", "Scalability", "Operational Effort"],
    datasets: [
      {
        label: metrics.name,
        data: [metrics.cost, metrics.scalability, metrics.ops],
        backgroundColor: isHovered ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)",
        borderColor: isHovered ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)",
        borderWidth: isHovered ? 3 : 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2
        }
      }
    }
  };

  return (
    <div style={{ width: '150px', height: '150px' }}>
      <Radar data={data} options={options} />
    </div>
  );
}
