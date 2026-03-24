import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, Bell, LineChart as ChartIcon, Sparkles } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const cropsData = [
  { name: 'Tomato', price: '₹24.50', yesterday: '₹22.00', change: 11.3, market: 'Lasalgaon Mandi', updated: '2 hrs ago' },
  { name: 'Wheat', price: '₹29.00', yesterday: '₹29.50', change: -1.7, market: 'Khanna Mandi', updated: '5 hrs ago' },
  { name: 'Onion', price: '₹18.20', yesterday: '₹18.00', change: 1.1, market: 'Pimpalgaon', updated: '1 hr ago' },
  { name: 'Cotton (Kapas)', price: '₹7,100', yesterday: '₹6,950', change: 2.1, market: 'Adilabad', updated: 'Just now' },
  { name: 'Soyabean', price: '₹4,800', yesterday: '₹4,950', change: -3.0, market: 'Indore Mandi', updated: '4 hrs ago' },
];

export default function Market() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const chartData = {
    labels: ['1 Mar', '5 Mar', '10 Mar', '15 Mar', '20 Mar', '24 Mar'],
    datasets: [
      {
        fill: true,
        label: 'Tomato Price per Kg (₹)',
        data: [15, 18, 17, 21, 23, 24.5],
        borderColor: '#2D6A4F',
        backgroundColor: 'rgba(45, 106, 79, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: '#f3f4f6' }
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-darkGreen mb-4 flex items-center justify-center md:justify-start">
              💰 Live Mandi Prices
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">Track real-time prices for 200+ crops and use AI to predict tomorrow's trends.</p>
          </div>
          
          <div className="mt-6 md:mt-0 relative w-full md:w-80 group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors h-5 w-5" />
             <input 
              type="text" 
              placeholder="Search crop name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-2 sm:p-6 shadow-md border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-green-100">
                  <th className="p-4 text-darkGreen font-bold text-sm uppercase tracking-wider">Crop</th>
                  <th className="p-4 text-darkGreen font-bold text-sm uppercase tracking-wider">Today</th>
                  <th className="p-4 text-darkGreen font-bold text-sm uppercase tracking-wider">Change</th>
                  <th className="p-4 text-darkGreen font-bold text-sm uppercase tracking-wider hidden sm:table-cell">Market</th>
                  <th className="p-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cropsData.map((crop, i) => (
                  <tr key={i} className="hover:bg-green-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{crop.name}</div>
                      <div className="text-xs text-gray-400 hidden sm:block">Updated {crop.updated}</div>
                    </td>
                    <td className="p-4 font-extrabold text-lg text-darkGreen">{crop.price}</td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        crop.change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {crop.change > 0 ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
                        {Math.abs(crop.change)}%
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium hidden sm:table-cell">
                      {crop.market}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-green-100" title="Set Alert">
                        <Bell className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column - AI Prediction & Chart */}
          <div className="space-y-8">
            {/* AI Prediction Box */}
            <div className="bg-gradient-to-br from-green-50 to-primary/10 rounded-3xl p-6 border border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-darkGreen mb-4 flex items-center relative z-10">
                <Sparkles className="w-5 h-5 mr-2 text-warning" /> AI Price Prediction
              </h3>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white relative z-10 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-800">Tomato</span>
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Rising ⬆</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Based on seasonal trends and current supply disruptions, tomato prices are likely to <strong className="text-darkGreen">rise by 15-20%</strong> in the next 7 days. It is recommended to hold your harvest if storage permits.
                </p>
              </div>
            </div>

            {/* 30 Day Trend */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md">
              <h3 className="text-lg font-bold text-darkGreen mb-6 flex items-center">
                <ChartIcon className="w-5 h-5 mr-2 text-primary" /> 30-Day Trend (Tomato)
              </h3>
              <div className="h-64 w-full">
                <Line options={options} data={chartData} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
