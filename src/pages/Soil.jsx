import React, { useState } from 'react';
import { TestTube, Map, Droplets, CheckCircle, ChevronRight, Activity, ArrowRight } from 'lucide-react';

export default function Soil() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center md:text-left flex flex-col items-center">
          <h1 className="text-4xl font-bold text-darkGreen mb-4 flex items-center justify-center">
            🧪 Soil Health Analyzer
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl text-center">Enter your soil details to generate a personalized crop rotation advice and precise fertilizer schedule.</p>
        </div>

        {!result ? (
          <div className="bg-white rounded-3xl p-8 max-w-3xl mx-auto shadow-xl border border-gray-100">
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-10 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              {[1, 2, 3].map((s) => (
                <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-colors ${
                  step >= s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5"/> : s}
                </div>
              ))}
            </div>

            <div className="min-h-[300px]">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-darkGreen mb-6 flex items-center"><Map className="w-6 h-6 mr-2 text-primary"/> Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                      <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option>Maharashtra</option>
                        <option>Punjab</option>
                        <option>Gujarat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
                      <input type="text" placeholder="e.g. Nashik" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Land Size (Acres)</label>
                      <input type="number" placeholder="2.5" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Water Source</label>
                      <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option>Rain-fed</option>
                        <option>Canal</option>
                        <option>Borewell</option>
                        <option>Drip</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-darkGreen mb-6 flex items-center"><TestTube className="w-6 h-6 mr-2 text-primary"/> Soil Details</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Soil Color</label>
                      <div className="grid grid-cols-5 gap-3">
                        {['Black', 'Red', 'Sandy', 'Loamy', 'Clay'].map(c => (
                          <div key={c} className="flex flex-col items-center cursor-pointer group">
                             <div className={`w-12 h-12 rounded-full shadow-sm border-2 border-transparent group-hover:border-primary transition-all mb-2 ${
                               c === 'Black' ? 'bg-[#2B2B28]' : c === 'Red' ? 'bg-[#8B4513]' : c === 'Sandy' ? 'bg-[#F4A460]' : c === 'Loamy' ? 'bg-[#D2B48C]' : 'bg-[#A0522D]'
                             }`}></div>
                             <span className="text-xs font-bold text-gray-600">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Crop Grown</label>
                        <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none">
                          <option>Soybean</option>
                          <option>Cotton</option>
                          <option>Wheat</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Fertilizer Used</label>
                        <input type="text" placeholder="e.g. Urea, DAP" className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-bold text-darkGreen mb-6 flex items-center"><Activity className="w-6 h-6 mr-2 text-primary"/> Current Season</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Month</label>
                      <input type="text" value="March (Pre-monsoon prep)" disabled className="w-full bg-gray-100 border border-gray-200 text-gray-500 rounded-xl px-4 py-3 opacity-80" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Crop Type</label>
                      <select className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option>Vegetables</option>
                        <option>Grains</option>
                        <option>Fruits</option>
                        <option>Cash Crops</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-between border-t border-gray-100 pt-6">
              <button 
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`py-3 px-6 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors ${step === 1 ? 'invisible' : ''}`}
              >
                Back
              </button>
              
              {step < 3 ? (
                <button 
                  onClick={() => setStep(s => Math.min(3, s + 1))}
                  className="bg-primary hover:bg-darkGreen text-white py-3 px-6 rounded-xl font-bold shadow-md transition-all flex items-center"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1"/>
                </button>
              ) : (
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-warning hover:bg-orange-500 text-white disabled:bg-gray-300 py-3 px-8 rounded-xl font-bold shadow-md transition-all flex items-center justify-center w-full md:w-auto"
                >
                   {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>🔍 Analyze My Soil</>}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border-t-8 border-primary animate-in fade-in zoom-in-95 duration-500">
             <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
               <div>
                  <h2 className="text-3xl font-black text-darkGreen mb-2">Your Soil Intelligence Report</h2>
                  <p className="text-gray-500 font-medium">For Black Soil in Maharashtra • Drip Irrigation • 2.5 Acres</p>
               </div>
               <div className="bg-green-100 text-green-800 p-3 rounded-2xl flex items-center justify-center shadow-inner">
                 <span className="font-bold">Score: 82/100</span>
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div>
                 <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center max-w-max border-b-2 border-primary pb-1">Top Crop Recommendations</h3>
                 <ul className="space-y-4">
                   {[
                     { name: 'Red Onion', profit: '₹1.2L/acre', risk: 'Low Risk', pop: 'Best Suited' },
                     { name: 'Tomato', profit: '₹1.5L/acre', risk: 'Med Risk', pop: 'High Market Demand' },
                     { name: 'Chilli', profit: '₹1.8L/acre', risk: 'High Risk', pop: 'Good soil match' }
                   ].map(c => (
                     <li key={c.name} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex justify-between items-center group hover:bg-green-50/50 transition-colors cursor-pointer">
                        <div>
                          <h4 className="font-bold text-darkGreen">{c.name} <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full ml-1">{c.pop}</span></h4>
                          <span className="text-xs font-bold text-gray-500 uppercase">{c.risk}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-primary text-lg">{c.profit}</div>
                          <span className="text-xs text-gray-400">Expected Profit</span>
                        </div>
                     </li>
                   ))}
                 </ul>
               </div>

               <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><TestTube className="w-5 h-5 text-brown mr-2"/> Exact Fertilizer Schedule</h3>
                    <div className="bg-cream/40 p-5 rounded-2xl border border-brown/20 text-sm">
                      <p className="font-medium text-gray-700 mb-3"><strong className="text-brown">Basal Dose (at sowing):</strong> 50 kg DAP + 20 kg MOP per acre.</p>
                      <p className="font-medium text-gray-700 mb-3"><strong className="text-brown">Top Dressing (Day 30):</strong> 30 kg Urea per acre.</p>
                      <p className="font-medium text-gray-700"><strong className="text-brown">Micronutrients:</strong> Soil shows minor Zinc deficiency. Apply 5kg Zinc Sulphate.</p>
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Droplets className="w-5 h-5 text-skyBlue mr-2"/> Irrigation Schedule</h3>
                     <div className="bg-skyBlue/10 p-5 rounded-2xl border border-skyBlue/20 text-sm">
                       <p className="text-gray-700 leading-relaxed font-medium">
                         Since you use <strong>Drip Irrigation</strong> on Black Cotton Soil, water retention is high. Irrigate for <strong>1.5 hours every 3 days</strong> during the vegetative stage. Avoid daily watering to prevent root rot.
                       </p>
                     </div>
                  </div>
               </div>
             </div>
             
             <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
               <button className="text-primary font-bold hover:underline" onClick={() => setResult(null)}>← Start New Analysis</button>
               <button className="bg-primary hover:bg-darkGreen text-white px-6 py-3 rounded-xl font-bold shadow-md">Download PDF Report</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
