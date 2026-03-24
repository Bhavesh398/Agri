import React, { useState, useEffect } from 'react';
import { Search, MapPin, CloudRain, Sun, Wind, Droplets, Thermometer, AlertCircle, Leaf, Navigation, Cloud, CloudLightning, CloudSnow, Loader2 } from 'lucide-react';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'MISSING_API_KEY',
  dangerouslyAllowBrowser: true
});

const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-yellow-500" />;
  if (code === 2 || code === 3) return <Cloud className="w-8 h-8 text-gray-300" />;
  if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (code >= 71 && code <= 82) return <CloudSnow className="w-8 h-8 text-white" />;
  if (code >= 95) return <CloudLightning className="w-8 h-8 text-purple-400" />;
  return <Sun className="w-8 h-8 text-yellow-500" />;
};

const getWeatherDesc = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 51 && code <= 67) return 'Rain / Drizzle';
  if (code >= 71 && code <= 82) return 'Snow Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Clear';
};

const getDayName = (dateStr, index) => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default function Weather() {
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [aiAdvice, setAiAdvice] = useState([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // Load user location automatically on mount if possible, or wait for manual prompt.
  // We'll trust the explicit "My Location" button as requested.
  
  const generateAIAdvice = async (weather, loc) => {
    setLoadingAdvice(true);
    try {
      if (client.apiKey === 'MISSING_API_KEY' || !client.apiKey || client.apiKey.trim() === '') {
        setAiAdvice(["VITE_OPENROUTER_API_KEY is missing. Update .env and restart."]);
        return;
      }
      const prompt = `Based on the following 7-day weather forecast for ${loc}, provide exactly 5 bullet points of practical, actionable farming advice.
      Current Temp: ${weather.current.temperature_2m}°C
      Current Humidity: ${weather.current.relative_humidity_2m}%
      Next 3 days max temps: ${weather.daily.temperature_2m_max.slice(0,3).join(", ")}
      Next 3 days rain probability: ${weather.daily.precipitation_probability_max.slice(0,3).join(", ")}%
      Format strictly as a JSON array of strings. Example: ["Advice 1", "Advice 2"]`;

      const response = await client.chat.completions.create({
        model: 'nvidia/nemotron-nano-12b-v2-vl:free', // Using the model user requested
        messages: [{ role: 'user', content: prompt }]
      });

      const jsonStr = response.choices[0].message.content.replace(/```json/g, "").replace(/```/g, "").trim();
      setAiAdvice(JSON.parse(jsonStr));
    } catch (error) {
       console.error(error);
       setAiAdvice(["Monitor crops closely today due to recent weather variations.", "Wait for clear skies before applying water-soluble fertilizers.", "Check local mandi rates before harvesting."]);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const fetchWeatherForCoords = async (lat, lon, locName) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
      const data = await res.json();
      
      let finalName = locName;
      if (!finalName) {
        // Reverse Geocoding
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const geoData = await geoRes.json();
        finalName = `${geoData.city || geoData.locality || 'Unknown'}, ${geoData.principalSubdivision || geoData.countryCode}`;
      }

      setLocationName(finalName);
      setWeatherData(data);
      generateAIAdvice(data, finalName);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherForCoords(position.coords.latitude, position.coords.longitude, '');
      },
      (error) => {
        console.error(error);
        alert('Location access denied or unavailable. Please search manually.');
        setLoading(false);
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    // Geocoding API text search
    try {
      const gRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
      const gData = await gRes.json();
      if (gData.results && gData.results.length > 0) {
         fetchWeatherForCoords(gData.results[0].latitude, gData.results[0].longitude, `${gData.results[0].name}, ${gData.results[0].admin1 || gData.results[0].country}`);
      } else {
         alert("Location not found.");
         setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-darkGreen mb-4 flex items-center">
              🌦️ Hyperlocal Weather
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">Get village-level 7-day weather forecasts with AI-generated farming advice.</p>
          </div>
          
          <div className="mt-6 md:mt-0 flex w-full md:w-auto relative group gap-2">
            <form onSubmit={handleSearch} className="flex flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search village/city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-l-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-darkGreen text-white px-4 py-3 rounded-r-2xl font-bold flex items-center shadow-md transition-colors"
              >
                {loading && !weatherData ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>
            </form>
            <button 
              onClick={handleGetLocation}
              className="bg-white border text-primary border-primary hover:bg-green-50 px-4 py-3 rounded-2xl font-bold shadow-md transition-colors flex items-center whitespace-nowrap"
            >
              <Navigation className="h-5 w-5 md:mr-2" />
              <span className="hidden md:block">Use My Location</span>
            </button>
          </div>
        </div>

        {!weatherData && !loading ? (
             <div className="bg-white p-16 rounded-3xl text-center shadow-sm border border-gray-100 flex flex-col items-center">
                 <CloudRain className="h-20 w-20 text-gray-200 mb-6" />
                 <h2 className="text-2xl font-bold text-gray-400 mb-4">No Location Selected</h2>
                 <p className="text-gray-500 max-w-md">Search for your village or click "Use My Location" to get your highly accurate 7-day farming weather forecast.</p>
                 <button onClick={handleGetLocation} className="mt-8 bg-primary text-white font-bold py-3 px-8 rounded-full flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"><Navigation className="w-5 h-5 mr-3"/> Locate Me Automatically</button>
             </div>
        ) : (
          <>
            {/* Special Alerts */}
            {weatherData?.daily?.precipitation_probability_max[0] >= 60 && (
              <div className="bg-warning/10 border-l-4 border-warning rounded-r-2xl p-4 mb-8 flex items-start animate-in fade-in">
                <AlertCircle className="text-warning h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-warning-dark uppercase tracking-wider text-sm mb-1">Rain Alert</h4>
                  <p className="text-gray-800 text-sm font-medium">There is a {weatherData.daily.precipitation_probability_max[0]}% chance of rain today. Consider delaying pesticide sprays.</p>
                </div>
              </div>
            )}

            {weatherData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Weather Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-skyBlue/90 to-blue-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                      <h2 className="text-3xl font-bold mb-1">{locationName}</h2>
                      <p className="text-white/80 font-medium">Today, {new Date(weatherData.current.time).toLocaleDateString()}</p>
                      <div className="flex items-center justify-center md:justify-start mt-6 group">
                        <div className="mr-6 transform group-hover:scale-110 transition-transform duration-500">
                           {getWeatherIcon(weatherData.current.weather_code)}
                        </div>
                        <div className="text-7xl font-black tracking-tighter">{Math.round(weatherData.current.temperature_2m)}°</div>
                      </div>
                      <p className="text-xl font-medium mt-3 tracking-wide">{getWeatherDesc(weatherData.current.weather_code)}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col gap-6 min-w-[220px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-white/90 text-sm font-medium"><Thermometer className="w-5 h-5 mr-3 opacity-80"/> Feels like</span>
                        <span className="font-bold text-lg">{Math.round(weatherData.current.apparent_temperature)}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-white/90 text-sm font-medium"><Droplets className="w-5 h-5 mr-3 opacity-80"/> Humidity</span>
                        <span className="font-bold text-lg">{Math.round(weatherData.current.relative_humidity_2m)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-white/90 text-sm font-medium"><Wind className="w-5 h-5 mr-3 opacity-80"/> Wind</span>
                        <span className="font-bold text-lg">{weatherData.current.wind_speed_10m} km/h</span>
                      </div>
                    </div>
                  </div>

                  {/* 5 Day Forecast Grid */}
                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-3">
                    {weatherData.daily.time.slice(0, 5).map((date, i) => (
                      <div key={i} className={`bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-3 flex flex-col items-center ${i === 0 ? 'bg-white/20 shadow-lg border-white/40 ring-2 ring-white/20' : ''}`}>
                        <span className="text-sm font-bold mb-3">{getDayName(date, i)}</span>
                        <div className="p-1 mb-2">
                           {getWeatherIcon(weatherData.daily.weather_code[i])}
                        </div>
                        <div className="flex gap-3 font-medium text-sm">
                          <span>{Math.round(weatherData.daily.temperature_2m_max[i])}°</span>
                          <span className="text-white/60">{Math.round(weatherData.daily.temperature_2m_min[i])}°</span>
                        </div>
                        {weatherData.daily.precipitation_probability_max[i] > 0 && 
                          <div className="text-xs text-blue-200 mt-2 font-bold flex items-center bg-blue-900/30 px-2 py-0.5 rounded-full">
                            <Droplets className="w-3 h-3 mr-1"/> {Math.round(weatherData.daily.precipitation_probability_max[i])}%
                          </div>
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Advice Panel */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col relative overflow-hidden">
                  {loadingAdvice ? (
                     <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                        <span className="font-bold text-primary animate-pulse">AgriBot is analyzing forecast...</span>
                     </div>
                  ) : null}

                  <h3 className="text-xl font-bold text-darkGreen mb-6 flex items-center pb-4 border-b border-gray-100">
                    <span className="bg-green-100 p-2 rounded-full mr-3"><Leaf className="w-5 h-5 text-primary"/></span>
                    AI Farming Advice
                  </h3>
                  
                  <ul className="space-y-5 flex-1 custom-scrollbar overflow-y-auto pr-2">
                    {aiAdvice.map((advice, i) => (
                      <li key={i} className="flex items-start group">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0 mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{advice}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                    <button className="text-primary font-bold text-sm hover:text-darkGreen transition-colors flex items-center">
                      Ask AgriBot specific questions →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
