import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../context/FinanceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

function Analysis() {
  const { state } = useFinance();

  // Filter out zero values and prepare data for chart
  const assetData = Object.entries(state.investments)
    .filter(([_, value]) => value > 0)
    .reduce((acc, [key, value]) => {
      acc.labels.push(key.replace(/([A-Z])/g, ' $1').trim());
      acc.values.push(value);
      return acc;
    }, { labels: [], values: [] });

  const data = {
    labels: assetData.labels,
    datasets: [
      {
        data: assetData.values,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="analysis">
      <h1>Asset Allocation Analysis</h1>
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default Analysis;
