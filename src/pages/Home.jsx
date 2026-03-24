import React, { useEffect, useState } from 'react';
import { Leaf, CloudRain, BarChart3, TestTube, AlertTriangle, CloudOff, TrendingDown, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'AI Crop Doctor', desc: 'Identify diseases instantly with 95% accuracy using your phone camera.', icon: <Leaf className="h-6 w-6 text-primary" />, path: '/crop-doctor', badge: 'Most Popular' },
  { title: 'Smart Weather Alerts', desc: 'Get village-level forecasts and actionable farming advice.', icon: <CloudRain className="h-6 w-6 text-skyBlue" />, path: '/weather' },
  { title: 'Mandi Price Tracker', desc: 'Check today\'s prices for 200+ crops and AI predictions.', icon: <BarChart3 className="h-6 w-6 text-warning" />, path: '/market' },
  { title: 'Soil & Fertilizer Guide', desc: 'Personalized fertilizer schedules tailored to your land.', icon: <TestTube className="h-6 w-6 text-brown" />, path: '/soil' },
];

const problems = [
  { title: 'Undetected Crop Diseases', desc: 'Late diagnosis destroys entire harvests within days.', icon: <AlertTriangle className="h-8 w-8 text-error mb-4" /> },
  { title: 'Unpredictable Weather', desc: 'Wrong timing of sowing or spraying causes massive loss.', icon: <CloudOff className="h-8 w-8 text-warning mb-4" /> },
  { title: 'Market Price Ignorance', desc: 'Selling at the wrong time means 30-40% less income.', icon: <TrendingDown className="h-8 w-8 text-red-500 mb-4" /> },
];

function CountUp({ end, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
        {count}{end > 100 ? '+' : ''}{end === 95 ? '%' : ''}
      </div>
      <div className="text-sm font-medium text-cream/90 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-darkGreen/70 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" 
          alt="Wheat field" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 text-center px-4 w-full max-w-5xl mx-auto py-12 md:py-20 my-auto mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-cream text-sm font-medium mb-8 border border-white/30">
            <span>🌱</span>
            <span>Trusted by 10,000+ Farmers Across India</span>
          </div>
          
          <h1 className="text-red pb-4">
            <span className="text-white drop-shadow-lg block">Farm Smarter.</span>
            <span className="text-lightGreen drop-shadow-lg block mt-2">Grow Better.</span>
          </h1>
          
          <p className="mt-6 text-xl text-cream max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            AI-powered tools to detect crop diseases instantly, predict hyperlocal weather, 
            track live mandi prices, and get expert farming advice 24/7 — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/crop-doctor" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-green-700 text-white font-semibold rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              🔍 Diagnose My Crop
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold rounded-full text-lg transition-all backdrop-blur-sm">
              🤖 Chat with AgriBot
            </button>
          </div>
          
          <p className="mt-6 text-sm text-cream/80 flex items-center justify-center gap-2">
            No signup required • <span className="w-1 h-1 bg-cream rounded-full"></span> 
            Free to use • <span className="w-1 h-1 bg-cream rounded-full"></span> 
            Works in 12 languages
          </p>

          {/* Floating Stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['🌡️ 28°C Nashik', '🌿 Leaf Blight Detected', '💰 Tomato ₹24/kg'].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white font-medium shadow-xl hover:-translate-y-2 transition-transform duration-300">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-darkGreen py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          <CountUp end={10000} label="Farmers Helped" />
          <CountUp end={50} label="Crops Supported" />
          <CountUp end={95} label="AI Accuracy" />
          <CountUp end={12} label="Languages" />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-darkGreen mb-4">Every Year, Farmers Lose Billions Due To...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((prob, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-error">
                {prob.icon}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{prob.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 text-lg text-primary font-medium italic">
            "AgriSmart solves all three — instantly, accurately, and for free."
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-darkGreen mb-4">Everything a Smart Farmer Needs</h2>
            <p className="text-xl text-gray-600">One platform. All your farming problems solved.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-cream/30 border border-green-100 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-lightGreen transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                {feature.badge && (
                  <span className="absolute top-4 right-4 bg-warning/20 text-warning text-xs font-bold px-3 py-1 rounded-full">
                    {feature.badge}
                  </span>
                )}
                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-darkGreen mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{feature.desc}</p>
                <Link to={feature.path} className="inline-flex items-center text-primary font-semibold hover:text-darkGreen transition-colors group/link text-sm">
                  Try Now <ArrowRight className="ml-1 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-cream/50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-darkGreen">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-green-200 border-t-2 border-dashed border-primary/30 z-0"></div>
            
            {[
              { title: 'Click or Upload', desc: 'Take a photo of your crop, field, or soil from your phone.', icon: '📸' },
              { title: 'AI Analyzes', desc: 'Our AI identifies the problem and generates an expert recommendation.', icon: '🤖' },
              { title: 'Get Advice', desc: 'Receive treatment plans and guidance in your language.', icon: '✅' },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-cream mb-6">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-darkGreen mb-3">{step.title}</h3>
                <p className="text-gray-600 px-4">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center mt-16 text-gray-500 font-medium">
            📱 Works on any smartphone — no app download needed
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-darkGreen">What Farmers Are Saying</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ramesh Patil', loc: 'Nashik, Maharashtra', crop: '🍅 Tomato', quote: "AgriSmart diagnosed my tomato leaf blight in 10 seconds. I saved my entire 3-acre crop. Earlier I would lose ₹80,000 every season." },
              { name: 'Priya Devi', loc: 'Ludhiana, Punjab', crop: '🌾 Wheat', quote: "The weather alerts saved me twice this season. AgriBot told me to delay my wheat spray — the next day it rained heavily." },
              { name: 'Suresh Kumar', loc: 'Guntur, Andhra Pradesh', crop: '🌶️ Chilli', quote: "Market price predictions are incredibly accurate. I held my chilli stock for 4 extra days and sold at ₹180/kg instead of ₹140/kg." }
            ].map((t, i) => (
              <div key={i} className="bg-cream/40 p-8 rounded-3xl border border-green-50 shadow-sm relative">
                <div className="flex text-yellow-400 mb-4">{'⭐'.repeat(5)}</div>
                <p className="text-gray-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center mt-auto">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} className="w-12 h-12 rounded-full bg-white border border-gray-200 p-1 mr-4" />
                  <div>
                    <h4 className="font-bold text-darkGreen">{t.name}</h4>
                    <p className="text-xs text-gray-500">📍 {t.loc} • {t.crop}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-darkGreen py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-1.66 1.66-.83-.83.83-.83zm-5.81 0l.83.83-1.66 1.66-.83-.83.83-.83zm-5.81 0l.83.83-1.66 1.66-.83-.83.83-.83zM0 54.627l.83.83-1.66 1.66-.83-.83.83-.83zm0-5.81l.83.83-1.66 1.66-.83-.83.83-.83zm0-5.81l.83.83-1.66 1.66-.83-.83.83-.83z\' fill=\'%23ffffff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
            <h2 className="text-4xl font-bold text-white mb-6">Take AgriSmart to Your Field 📱</h2>
            <p className="text-cream/90 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Download our app — works offline, uses just 8MB of space, and functions perfectly on 2G networks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center justify-center space-x-2 bg-white text-darkGreen px-6 py-3 rounded-xl font-bold hover:bg-cream transition-colors shadow-lg">
                <Download className="h-5 w-5" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-normal uppercase">Get it on</div>
                  <div>Google Play</div>
                </div>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Mockup */}
            <div className="w-64 h-[500px] bg-white rounded-[3rem] p-2 shadow-2xl border-4 border-gray-800 relative">
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl w-1/2 mx-auto"></div>
              <div className="w-full h-full bg-cream rounded-[2.5rem] overflow-hidden flex items-center justify-center border border-gray-100 relative">
                  <div className="absolute inset-x-0 top-0 h-32 bg-primary"></div>
                  <div className="z-10 text-center p-6 mt-10">
                    <Leaf className="h-12 w-12 text-white mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-12">AgriSmart</h3>
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-left mb-4">
                      <div className="flex items-center space-x-2 text-warning font-bold text-sm mb-2"><AlertTriangle className="h-4 w-4"/><span>Weather Alert</span></div>
                      <p className="text-xs text-gray-600">Heavy rain expected in 2 hours. Delay spraying.</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
