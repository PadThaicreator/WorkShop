'use client'

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { config } from "@/app/config";
import axios from "axios";

export default function Page() {
  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalRepair, setTotalRepair] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.apiUrl}/sell/dashboard`);
      setTotalIncome(res.data.totalIncome);
      setTotalRepair(res.data.totalRepair);
      setTotalSale(res.data.totalSale);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      // Use proper error handling with a toast notification or alert system
      alert("Error: " + (error.message || "Failed to fetch dashboard data"));
    }
  };

  useEffect(() => {
    renderChart();
    fetchData();
  }, []);

  const renderChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datas = months.map((m, index) => ({
      key: index,
      name: m,
      income: Math.floor(Math.random() * 10000)
    }));
    setData(datas);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('th-TH', { maximumFractionDigits: 0 });
  };

  const StatCard = ({ color, bgColor, iconText, title, value }) => {
    return (
      <div className={`flex flex-1 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}>
        <div className={`${bgColor} w-2 flex-shrink-0`}></div>
        <div className="flex flex-col flex-1 p-5 bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className={`${color} text-sm font-medium uppercase tracking-wider`}>{title}</span>
            <div className={`p-2 ${color.replace('text', 'bg')}-100 rounded-lg flex items-center justify-center w-8 h-8`}>
              {iconText}
            </div>
          </div>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard
          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-600 mt-2 rounded-full"></div>
        </h1>
        <button 
          onClick={() => {fetchData(); renderChart();}}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-200"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh Data
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              color="text-purple-700" 
              bgColor="bg-purple-600" 
              iconText="฿"
              title="Total Income" 
              value={`${formatCurrency(totalIncome)} ฿`} 
            />
            <StatCard 
              color="text-orange-700" 
              bgColor="bg-orange-600" 
              iconText="⚙️"
              title="Total Repair" 
              value={`${formatCurrency(totalRepair)} Services`} 
            />
            <StatCard 
              color="text-blue-700" 
              bgColor="bg-blue-600" 
              iconText="📦"
              title="Total Sales" 
              value={`${formatCurrency(totalSale)} Items`} 
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Income Overview
            </h2>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#718096" />
                  <YAxis stroke="#718096" />
                  <Tooltip 
                    formatter={(value) => [`${formatCurrency(value)} ฿`, "Income"]}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none' }}
                    labelStyle={{ fontWeight: 'bold', color: '#4a5568' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="income" 
                    name="Monthly Income" 
                    radius={[8, 8, 0, 0]}
                    fill="url(#colorGradient)" 
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-green-500 rounded-r-lg bg-green-50">
                <p className="text-green-800 font-medium">New sale completed: 3,500 ฿</p>
                <p className="text-green-600 text-sm">Today at 14:35</p>
              </div>
              <div className="p-4 border-l-4 border-blue-500 rounded-r-lg bg-blue-50">
                <p className="text-blue-800 font-medium">Repair service completed: #1234</p>
                <p className="text-blue-600 text-sm">Today at 11:20</p>
              </div>
              <div className="p-4 border-l-4 border-purple-500 rounded-r-lg bg-purple-50">
                <p className="text-purple-800 font-medium">Inventory updated: +15 items</p>
                <p className="text-purple-600 text-sm">Yesterday at 16:45</p>
              </div>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}