import React from 'react';
import { Landmark, ArrowRight, ShieldCheck, BadgeIndianRupee, Sprout, Droplets, BookOpen, HandCoins } from 'lucide-react';

const schemes = [
  { id: 1, title: 'PM-KISAN Samman Nidhi', benefit: '₹6,000/year direct transfer', icon: <BadgeIndianRupee className="w-10 h-10 text-primary" />, desc: 'Provides minimum income support to all small and marginal farmers via 3 equal installments.' },
  { id: 2, title: 'PM Fasal Bima Yojana', benefit: 'Comprehensive Crop Insurance', icon: <ShieldCheck className="w-10 h-10 text-skyBlue" />, desc: 'Protection against crop loss due to non-preventable natural risks from pre-sowing to post-harvest.' },
  { id: 3, title: 'Soil Health Card Scheme', benefit: 'Free Soil Testing & Report', icon: <Sprout className="w-10 h-10 text-brown" />, desc: 'Helps farmers understand their soil quality and recommends appropriate dosages of nutrients.' },
  { id: 4, title: 'PM Krishi Sinchayee Yojana', benefit: 'Up to 55% Drip Subsidy', icon: <Droplets className="w-10 h-10 text-blue-500" />, desc: '"Per Drop More Crop". Subsidies for installing drip and sprinkler irrigation systems.' },
  { id: 5, title: 'Paramparagat Krishi Vikas', benefit: 'Organic Farming Support', icon: <BookOpen className="w-10 h-10 text-green-500" />, desc: 'Financial assistance to promote organic farming through a cluster approach.' },
  { id: 6, title: 'Kisan Credit Card (KCC)', benefit: 'Low-interest farm loans (4%)', icon: <HandCoins className="w-10 h-10 text-warning" />, desc: 'Provides adequate and timely farm credit to farmers for agricultural operations.' },
];

export default function Schemes() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-darkGreen justify-center flex items-center mb-4">
            <Landmark className="w-10 h-10 text-primary mr-3" />
            Government Schemes for Farmers
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
             AgriBot can help you apply and understand any scheme. Don't miss out on financial support meant for you.
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex overflow-x-auto hide-scrollbar pb-10 -mx-4 px-4 snap-x snap-mandatory scroll-smooth space-x-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="snap-center min-w-[300px] md:min-w-[350px] max-w-[350px] flex-shrink-0 bg-cream/30 border border-green-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative group flex flex-col h-full">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Landmark className="w-24 h-24 text-primary" />
              </div>
              
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100 relative z-10">
                {scheme.icon}
              </div>
              
              <h3 className="text-xl font-bold text-darkGreen mb-2 relative z-10">{scheme.title}</h3>
              <p className="font-extrabold text-primary mb-4 relative z-10">{scheme.benefit}</p>
              
              <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-grow relative z-10">
                {scheme.desc}
              </p>
              
              <button className="mt-auto flex items-center justify-between w-full font-bold text-sm bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-3 rounded-xl transition-colors relative z-10">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-darkGreen text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           <div className="relative z-10 text-center md:text-left md:max-w-xl mb-6 md:mb-0">
             <h3 className="text-2xl font-bold mb-2 text-cream">Confused about paperwork?</h3>
             <p className="text-gray-300">Click the AgriBot button in the bottom right corner and type <strong className="text-white bg-white/20 px-2 py-0.5 rounded">PM-KISAN details</strong> to get instant help in your local language.</p>
           </div>
           <button className="relative z-10 bg-white text-darkGreen px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center">
             Talk to AgriBot Now
           </button>
        </div>
      </div>
    </div>
  );
}
