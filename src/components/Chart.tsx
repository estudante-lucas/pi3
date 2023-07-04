import { ChartType } from "chart.js";
import Chart, { ChartData, ChartOptions } from "chart.js/auto";
import React, { useEffect, useRef } from "react";

interface ChartComponentProps {
	data: ChartData;
	options?: ChartOptions;
	type?: ChartType;
	width?: string;
	height?: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, options, type = "bar", width = "100%", height = "100%" }) => {
	const chartRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		if (chartRef.current) {
			const ctx = chartRef.current.getContext("2d");
			if (ctx) {
				const chartInstance = new Chart(ctx, {
					type,
					data,
					options,
				});
				return () => {
					chartInstance.destroy();
				};
			}
		}
	}, [data, options, type]);

	return <canvas ref={(ref) => (chartRef.current = ref)} style={{ width, height }} />;
};

export default ChartComponent;
