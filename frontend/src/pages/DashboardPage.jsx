import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        const res = await fetch('http://localhost:5000/api/report');
        const data = await res.json();
        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);
        
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Symptom Frequency',
                    data: counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Public Health Report</h1>
            <div className="bg-white p-6 rounded shadow-md">
                <Bar data={chartData} />
            </div>
        </div>
    );
};

export default DashboardPage;