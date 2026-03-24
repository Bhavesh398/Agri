import React, { useState } from 'react';
import { Upload, Camera, AlertCircle, Share2, MapPin, CheckCircle, Leaf, TestTube } from 'lucide-react';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'MISSING_API_KEY',
  dangerouslyAllowBrowser: true
});

const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export default function CropDoctor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState('English');

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      if (client.apiKey === 'MISSING_API_KEY' || !client.apiKey || client.apiKey.trim() === '') {
        throw new Error("API Key is missing. Ensure VITE_OPENROUTER_API_KEY is saved in agrismart/.env and you restarted the dev server.");
      }
      
      const base64Image = await getBase64(file);
      
      const prompt = `Analyze this crop/leaf image. Identify any disease. Return your answer EXCLUSIVELY as a single, valid JSON object. Do not add any extra text, characters, or markdown formatting whatsoever. Ensure all brackets are properly opened and closed. Follow this exact structure:
      {
        "name": "Disease Name (Scientific name)",
        "confidence": 95,
        "severity": "SEVERE",
        "part": "affected part",
        "cause": "short description of cause",
        "organic": ["treatment 1", "treatment 2"],
        "chemical": ["chemical 1", "chemical 2"],
        "prevention": ["prevention 1", "prevention 2"]
      }
      CRITICAL: You must translate the contents/values for "name", "part", "cause", "organic", "chemical", and "prevention" into ${language}. Keep the exact English JSON keys.`;

      const apiResponse = await client.chat.completions.create({
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ],
        reasoning: { enabled: true }
      });

      const content = apiResponse.choices[0].message.content;
      try {
        let jsonStr = content.replace(/```json/gi, "").replace(/```/g, "").trim();
        // Fallback: forcefully extract the main JSON object if the model still appended trailing characters
        const match = jsonStr.match(/\{[\s\S]*\}/);
        if (match) {
          jsonStr = match[0];
        }
        
        // Specific fix for the model hallucinating an extra close bracket after 'cause' string
        jsonStr = jsonStr.replace(/"cause"\s*:\s*"([^"]*)"\s*\},/g, '"cause": "$1",');
        
        const parsed = JSON.parse(jsonStr);
        setResult(parsed);
      } catch (parseError) {
        console.error("Failed to parse JSON:", content);
        setErrorMsg("Failed to parse the AI response. Please try again.");
      }
      
    } catch (apiError) {
      console.error(apiError);
      setErrorMsg(`API Error: ${apiError.message || 'Check your API key or network and ensure you restarted the server.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-darkGreen mb-4 flex items-center justify-center md:justify-start">
            🌿 AI Crop Doctor
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">Upload a photo of your affected crop or leaf. Our AI will instantly identify the disease and provide an expert treatment plan.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Upload */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-100 h-fit">
            
            <div 
              className="border-3 border-dashed border-gray-300 hover:border-primary/60 hover:bg-green-50/50 rounded-2xl h-[300px] flex flex-col justify-center items-center transition-all cursor-pointer group relative overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('camera-upload').click()}
            >
              <input type="file" id="camera-upload" className="hidden" accept="image/jpeg, image/png" onChange={(e) => {
                if(e.target.files[0]) {
                  setFile(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
              
              {preview ? (
                <div className="absolute inset-0 w-full h-full">
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-10 w-10 text-white mb-2" />
                    <p className="text-white font-bold tracking-wide">Change Image</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-green-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform flex-shrink-0">
                    <Camera className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 truncate max-w-[80%] text-center">
                    Drag & drop your crop photo here
                  </h3>
                  <p className="text-gray-500 text-sm px-4 text-center">or click to browse — JPG, PNG supported</p>
                </>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Try a sample:</p>
              <div className="flex gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="w-16 h-16 rounded-xl bg-gray-200 border-2 border-transparent hover:border-primary cursor-pointer overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100&h=100`} className="w-full h-full object-cover opacity-80" alt="sample"/>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
              
              <button  
                onClick={handleScan}
                disabled={!file || loading}
                className="w-full md:w-2/3 bg-primary hover:bg-darkGreen text-white disabled:bg-gray-300 disabled:cursor-not-allowed font-bold py-3 px-6 rounded-xl transition-all shadow-md flex justify-center items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>🔍 Diagnose Now</>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">Powered by OpenAI Vision</p>
          </div>

          {/* Right Column - Results */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden relative min-h-[500px]">
            {!result && !loading && !errorMsg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6 opacity-50">
                  <Leaf className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-400">Your diagnosis will appear here</h3>
                <p className="text-gray-400 mt-2 text-sm max-w-xs">Upload an image to get instant AI-powered disease detection and remedies.</p>
              </div>
            )}

            {errorMsg && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-50/50">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">Diagnosis Failed</h3>
                <p className="text-red-500 mt-2 text-sm max-w-xs font-medium">{errorMsg}</p>
              </div>
            )}

            {loading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm z-10">
                 <div className="animate-pulse flex flex-col items-center">
                    <div className="h-24 w-24 bg-gray-200 rounded-full mb-6"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded-md mb-4"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-56 bg-gray-200 rounded-md"></div>
                 </div>
               </div>
            )}

            {result && !loading && (
              <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-2">{result.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold uppercase flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {result.severity}</span>
                      <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Part: {result.part}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">{result.confidence}%</div>
                    <div className="text-xs text-gray-500 font-medium">Confidence</div>
                  </div>
                </div>

                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6">
                  <h4 className="font-bold text-gray-800 mb-1">Root Cause</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.cause}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-bold text-green-700 mb-3 flex items-center"><Leaf className="w-4 h-4 mr-1"/> Organic Treatment</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {result.organic.map((item, i) => (
                        <li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"/> <span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-700 mb-3 flex items-center"><TestTube className="w-4 h-4 mr-1"/> Chemical Treatment</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {result.chemical.map((item, i) => (
                        <li key={i} className="flex items-start"><CheckCircle className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"/> <span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                <hr className="border-gray-100 mb-6" />

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-white border-2 border-primary text-primary hover:bg-green-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
                    <MapPin className="w-5 h-5 mr-2" /> Find Agro Store
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5 mr-2" /> Share Report
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
