import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(7.5);
  const [term, setTerm] = useState(36); // months

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    // Standard Amortization Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
    const principal = amount;
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term;

    if (rate === 0) {
      setMonthlyPayment(principal / numberOfPayments);
      setTotalInterest(0);
    } else {
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const monthly = (principal * x * monthlyRate) / (x - 1);
      setMonthlyPayment(monthly);
      setTotalInterest((monthly * numberOfPayments) - principal);
    }
  }, [amount, rate, term]);

  const data = [
    { name: 'Principal', value: amount },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['#3b82f6', '#94a3b8']; // Blue-500, Slate-400

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Quick Estimator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Loan Amount: ${amount.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Interest Rate: {rate}%
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Term: {term} months ({term/12} years)
            </label>
            <input
              type="range"
              min="12"
              max="84"
              step="12"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-500">Estimated Monthly Payment</p>
            <p className="text-4xl font-bold text-blue-600">${Math.round(monthlyPayment).toLocaleString()}</p>
          </div>
          
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
