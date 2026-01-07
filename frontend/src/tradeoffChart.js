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

export default function TradeoffChart({ metrics }) {
  const data = {
    labels: ["Cost Efficiency", "Scalability", "Operational Ease"],
    datasets: [
      {
        label: metrics.name,
        data: [metrics.cost, metrics.scalability, metrics.ops],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)"
      }
    ]
  };

  return <Radar data={data} />;
}
