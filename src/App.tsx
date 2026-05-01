import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ruler, 
  Camera, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Scissors, 
  Check, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  Palette,
  Mail,
  Calendar,
  Facebook,
  Network,
  Languages,
  Plane,
  ShieldCheck
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from './lib/utils';
import { 
  BodyMeasurements, 
  ClothingCategory, 
  CustomizationState 
} from './types';
import { 
  MATERIALS, 
  COLORS, 
  BUTTONS, 
  CATEGORIES, 
  INITIAL_STYLES 
} from './constants';
import { 
  analyzeInspirationImage, 
  getStyleRecommendations 
} from './services/geminiService';

// --- Components ---

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { icon: Scissors, label: 'Intro' },
    { icon: Ruler, label: 'Measures' },
    { icon: Camera, label: 'Style' },
    { icon: Layers, label: 'Tailor' },
    { icon: Sparkles, label: 'Final' },
  ];

  return (
    <div className="flex justify-center items-center py-6 sm:py-8 space-x-2 sm:space-x-6">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500",
                currentStep >= i ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              <s.icon size={16} className="sm:size-[18px]" />
            </div>
            <span className={cn(
              "text-[9px] sm:text-[10px] uppercase tracking-widest mt-2 font-medium transition-opacity",
              currentStep === i ? "opacity-100" : "opacity-40"
            )}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "h-[1px] w-4 sm:w-12 bg-slate-200 transition-colors duration-500",
              currentStep > i && "bg-slate-900"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [step, setStep] = React.useState(0);
  const [currentView, setCurrentView] = React.useState<'tailor' | 'about'>('tailor');
  const [loading, setLoading] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState<string>("");
  const [aiRecs, setAiRecs] = React.useState<string>("");

  const [state, setState] = React.useState<CustomizationState>({
    measurements: {
      height: 175,
      weight: 70,
      chest: 95,
      waist: 80,
      hips: 95,
      shoulders: 45,
      armLength: 60,
      inseam: 80,
    },
    selectedGender: 'Man',
    selectedCategory: 'Blazer',
    selectedMaterial: MATERIALS[0].id,
    customMaterial: "",
    selectedColor: COLORS[0].hex,
    customColor: "",
    selectedButton: BUTTONS[0].name,
    customButton: "",
    inspirationImages: [],
    whatsapp: "",
    location: "",
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const getCalendarUrl = () => {
    const title = encodeURIComponent("Bespoke Tailoring Appointment - VietnamTailors");
    const materialName = MATERIALS.find(m => m.id === state.selectedMaterial)?.name;
    const colorDisplay = state.selectedColor === 'Others' 
      ? (state.customColor || 'Custom selection') 
      : (COLORS.find(c => c.hex === state.selectedColor)?.name || state.selectedColor);

    const body = `Tailoring Order Details:
------------------------
Category: ${state.selectedCategory}
Gender: ${state.selectedGender}
Material: ${materialName} ${state.customMaterial ? `(Custom: ${state.customMaterial})` : ''}
Color: ${colorDisplay}
Button: ${state.selectedButton} ${state.customButton ? `(Custom: ${state.customButton})` : ''}

Body Measurements:
Height: ${state.measurements.height}cm
Weight: ${state.measurements.weight}kg
Chest: ${state.measurements.chest}cm
Waist: ${state.measurements.waist}cm
Hips: ${state.measurements.hips}cm
Shoulders: ${state.measurements.shoulders}cm
Arm Length: ${state.measurements.armLength}cm
Inseam: ${state.measurements.inseam}cm

Contact Details:
WhatsApp: ${state.whatsapp || 'Not provided'}
Location: ${state.location || 'Not provided'}`;

    const details = encodeURIComponent(body);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&add=vietnamtailors@gmail.com`;
  };

  const handleBookAppointment = () => {
    const calendarUrl = getCalendarUrl();
    setRequestSent(true);
    
    // Attempt to open in new tab
    const win = window.open(calendarUrl, '_blank');
    
    // Fallback if blocked
    if (!win || win.closed || typeof win.closed === 'undefined') {
      console.warn("Popup blocked");
    }
  };

  const getRequestDetails = () => {
    const materialName = MATERIALS.find(m => m.id === state.selectedMaterial)?.name;
    const colorDisplay = state.selectedColor === 'Others' 
      ? (state.customColor || 'Custom selection') 
      : (COLORS.find(c => c.hex === state.selectedColor)?.name || state.selectedColor);

    return `--- VIETNAMTAILORS PLATFORM REQUEST ---
HELLO VIETNAMTAILORS (XIN CHÀO),

I would like to request a bespoke tailoring service matching.
(Tôi muốn yêu cầu dịch vụ may đo riêng biệt).

ORDER DETAILS / CHI TIẾT ĐƠN HÀNG:
- Category: ${state.selectedCategory} (${state.selectedGender})
- Material / Chất liệu: ${materialName} ${state.customMaterial ? `(Custom: ${state.customMaterial})` : ''}
- Color / Màu sắc: ${colorDisplay}
- Button / Khuy: ${state.selectedButton} ${state.customButton ? `(Custom: ${state.customButton})` : ''}

BODY MEASUREMENTS / SỐ ĐO CƠ THỂ:
- Height: ${state.measurements.height}cm
- Weight: ${state.measurements.weight}kg
- Chest: ${state.measurements.chest}cm
- Waist: ${state.measurements.waist}cm
- Hips: ${state.measurements.hips}cm
- Shoulders: ${state.measurements.shoulders}cm
- Arm Length: ${state.measurements.armLength}cm
- Inseam: ${state.measurements.inseam}cm

CONTACT / LIÊN HỆ:
- WhatsApp: ${state.whatsapp || 'Not provided'}
- Preferred Area / Khu vực: ${state.location || 'Not provided'}

Note to Platform: Please match me with a high-quality workshop specializing in this style.
Best regards.`;
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Bespoke Tailoring Request - ${state.selectedCategory}`);
    const body = encodeURIComponent(getRequestDetails());
    const mailtoLink = `mailto:vietnamtailors@gmail.com?subject=${subject}&body=${body}`;
    setRequestSent(true);
    window.location.href = mailtoLink;
  };

  const handleGmailSend = () => {
    const subject = encodeURIComponent(`Bespoke Tailoring Request - ${state.selectedCategory}`);
    const body = encodeURIComponent(getRequestDetails());
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=vietnamtailors@gmail.com&su=${subject}&body=${body}`, '_blank');
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(getRequestDetails());
    alert("Request details copied to clipboard!");
  };

  const handleInspirationUpload = async (files: File[]) => {
    setLoading(true);
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64s = await Promise.all(readers);
    setState(prev => ({ ...prev, inspirationImages: [...prev.inspirationImages, ...base64s] }));
    
    // Analyze the first image
    if (base64s.length > 0) {
      const result = await analyzeInspirationImage(base64s[0]);
      setAiAnalysis(result || "");
    }
    setLoading(false);
  };

  const getRecommendations = async () => {
    setLoading(true);
    const recs = await getStyleRecommendations(state.measurements, `${state.selectedGender} fashion, Elegant, bespoke, modern ${state.selectedCategory}`);
    setAiRecs(recs || "");
    setLoading(false);
  };

  React.useEffect(() => {
    if (step === 4) {
      getRecommendations();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-slate-900 font-sans selection:bg-slate-200">
      <header className="fixed top-0 left-0 w-full h-16 border-b border-black/5 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-8">
        <div className="flex items-center space-x-2">
          <Scissors className="text-slate-900" size={20} />
          <span className="font-serif italic text-xl tracking-tighter">VietnamTailors</span>
        </div>
        <nav className="flex space-x-6 text-[11px] uppercase tracking-widest font-semibold">
          <button 
            onClick={() => setCurrentView('tailor')}
            className={cn("hover:opacity-100 transition-opacity", currentView === 'tailor' ? "text-slate-900 opacity-100" : "opacity-40")}
          >
            Tailor
          </button>
          <button 
            onClick={() => setCurrentView('about')}
            className={cn("hover:opacity-100 transition-opacity", currentView === 'about' ? "text-slate-900 opacity-100" : "opacity-40")}
          >
            About
          </button>
        </nav>
      </header>

      <main className="pt-24 pb-32 max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentView === 'tailor' ? (
            <motion.div
              key="tailor-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StepIndicator currentStep={step} />
              <div className="mt-8">
                <AnimatePresence mode="wait">
                  {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h1 className="font-serif text-5xl md:text-7xl font-light leading-[1.1] mb-6">
                  One Gateway. <br/><span className="italic">Thousands</span> of Tailors.
                </h1>
                <p className="max-w-md mx-auto text-slate-500 mb-12">
                  VietnamTailors is your professional bridge to the finest workshops across Vietnam. We handle the quality control, translation, and shipping, while you focus on the design.
                </p>
                <button 
                  onClick={nextStep}
                  className="bg-slate-900 text-white px-10 py-5 rounded-full font-medium tracking-tight hover:scale-105 transition-transform flex items-center space-x-3 mx-auto group"
                >
                  <span>Begin Customization</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="font-serif text-4xl mb-4">Body Measurements</h2>
                  <p className="text-slate-500">Provide your dimensions for a precision fit. All values in cm.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(Object.keys(state.measurements) as Array<keyof BodyMeasurements>).map((m) => (
                    <div key={m} className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block">{m.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="number"
                        value={state.measurements[m]}
                        onChange={(e) => setState(prev => ({
                          ...prev,
                          measurements: { ...prev.measurements, [m]: Number(e.target.value) }
                        }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-12">
                  <button onClick={prevStep} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors font-medium">
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2"
                  >
                    <span>Continue to Style</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="font-serif text-4xl mb-4">Style Inspiration</h2>
                  <p className="text-slate-500">Select your gender and choose a category to see curated styles.</p>
                </div>

                <div className="space-y-8">
                  {/* Gender Selector */}
                  <div className="flex justify-center space-x-4">
                    {(['Man', 'Woman'] as const).map(g => (
                      <button 
                        key={g}
                        onClick={() => setState(prev => ({ ...prev, selectedGender: g }))}
                        className={cn(
                          "px-10 py-3 rounded-full border-2 transition-all font-bold tracking-widest text-[10px] uppercase",
                          state.selectedGender === g 
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                            : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  {/* Category Selector */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setState(prev => ({ ...prev, selectedCategory: cat }))}
                        className={cn(
                          "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all",
                          state.selectedCategory === cat 
                            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                            : "bg-white text-slate-400 border border-slate-100"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-12">
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">Curated for {state.selectedGender}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {INITIAL_STYLES.filter(s => s.category === state.selectedCategory && (s.gender === state.selectedGender || s.gender === 'Unisex')).map(style => (
                        <div key={style.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200 cursor-pointer">
                          <img src={style.image} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">{style.name}</p>
                          </div>
                        </div>
                      ))}
                      {INITIAL_STYLES.filter(s => s.category === state.selectedCategory && (s.gender === state.selectedGender || s.gender === 'Unisex')).length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                          <ImageIcon size={24} className="mb-2 opacity-20" />
                          <p className="text-[10px] uppercase font-bold tracking-widest">No curated items yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">Your Inspiration</h3>
                    <Dropzone onDrop={handleInspirationUpload} loading={loading} />
                    
                    {state.inspirationImages.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                          {state.inspirationImages.map((img, i) => (
                            <img key={i} src={img} className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
                          ))}
                        </div>
                        {aiAnalysis && (
                          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center space-x-2 mb-3">
                              <Sparkles size={14} className="text-blue-500" />
                              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">AI Visual Analysis</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600 italic">"{aiAnalysis.substring(0, 300)}..."</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors font-medium">
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg shadow-slate-900/20"
                  >
                    <span>Tailor Materials</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="font-serif text-4xl mb-4">Material & Details</h2>
                  <p className="text-slate-500">Fine-tune the fabrics and accessories of your garment.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">1. Fabric</h3>
                    <div className="space-y-3">
                      {MATERIALS.map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setState(prev => ({ ...prev, selectedMaterial: m.id }))}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl transition-all border",
                            state.selectedMaterial === m.id 
                              ? "bg-white border-slate-900 ring-4 ring-slate-900/5 shadow-lg" 
                              : "bg-transparent border-slate-200 opacity-60 hover:opacity-100"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">{m.name}</span>
                            {state.selectedMaterial === m.id && <Check size={14} className="text-slate-900" />}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{m.description}</p>
                        </button>
                      ))}
                      <div className="pt-2">
                        <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 block mb-2">Custom fabric requirements</label>
                        <textarea 
                          placeholder="Type your specific fabric wishes..."
                          value={state.customMaterial}
                          onChange={(e) => setState(prev => ({ ...prev, customMaterial: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all h-20 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">2. Color</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {COLORS.map(c => (
                          <button 
                            key={c.hex}
                            onClick={() => setState(prev => ({ ...prev, selectedColor: c.hex }))}
                            className={cn(
                              "p-3 rounded-2xl border transition-all flex items-center space-x-3",
                              state.selectedColor === c.hex ? "bg-white border-slate-900" : "bg-transparent border-slate-200"
                            )}
                          >
                            <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: c.hex }} />
                            <span className="text-[11px] font-bold uppercase tracking-tighter truncate">{c.name}</span>
                          </button>
                        ))}
                        <button 
                          onClick={() => setState(prev => ({ ...prev, selectedColor: 'Others' }))}
                          className={cn(
                            "p-3 rounded-2xl border transition-all flex items-center space-x-3",
                            state.selectedColor === 'Others' ? "bg-white border-slate-900 shadow-sm" : "bg-transparent border-slate-200 opacity-60"
                          )}
                        >
                          <div className="w-6 h-6 rounded-full border border-slate-200 bg-gradient-to-tr from-rose-100 via-indigo-100 to-emerald-100 shadow-inner" />
                          <span className="text-[11px] font-bold uppercase tracking-tighter truncate">Others</span>
                        </button>
                      </div>
                      <div className={cn("pt-1 transition-opacity", state.selectedColor === 'Others' ? "opacity-100" : "opacity-50")}>
                        <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 block mb-2">
                          {state.selectedColor === 'Others' ? "Specify your preferred color" : "Custom color requirements"}
                        </label>
                        <input 
                          type="text"
                          placeholder="e.g. Pale Avocado, Royal Purple..."
                          value={state.customColor}
                          onChange={(e) => setState(prev => ({ ...prev, customColor: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">3. Buttons</h3>
                    <div className="space-y-3">
                      {BUTTONS.map(b => (
                        <button 
                          key={b.name}
                          onClick={() => setState(prev => ({ ...prev, selectedButton: b.name }))}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl transition-all border",
                            state.selectedButton === b.name
                              ? "bg-white border-slate-900 shadow-lg" 
                              : "bg-transparent border-slate-200 opacity-60 hover:opacity-100"
                          )}
                        >
                          <span className="font-bold text-sm block mb-1">{b.name}</span>
                          <p className="text-[11px] text-slate-400 leading-tight">{b.description}</p>
                        </button>
                      ))}
                      <div className="pt-2">
                        <label className="text-[9px] uppercase tracking-widest font-black text-slate-400 block mb-2">Custom button requirements</label>
                        <input 
                          type="text"
                          placeholder="e.g. Gold trimming, Vintage wood..."
                          value={state.customButton}
                          onChange={(e) => setState(prev => ({ ...prev, customButton: e.target.value }))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-8">
                  <button onClick={prevStep} className="flex items-center space-x-2 text-slate-400 hover:text-slate-900 transition-colors font-medium">
                    <ChevronLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button 
                    onClick={nextStep}
                    className="bg-slate-900 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 shadow-lg shadow-slate-900/20"
                  >
                    <span>Final Review</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="text-center">
                  <h2 className="font-serif text-4xl mb-4">Your Bespoke Profile</h2>
                  <p className="text-slate-500">See how Aura fits you and our AI-guided stylistic advice.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/5 border border-slate-100">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-900">
                          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif text-xl">Valued Client</h4>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Profile Summary</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <section>
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-black text-slate-900/30">
                              <Ruler size={12} />
                              <span>Measurements</span>
                            </h5>
                            <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full border border-emerald-100">
                              QC Verified Path
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                             {Object.entries(state.measurements).slice(0, 4).map(([k, v]) => (
                               <div key={k} className="flex justify-between items-baseline border-b border-dotted border-slate-100 pb-1">
                                 <span className="text-[10px] text-slate-400 uppercase font-medium">{k.replace(/([A-Z])/g, ' $1')}</span>
                                 <span className="font-mono text-sm font-bold">{v}cm</span>
                               </div>
                             ))}
                          </div>
                        </section>

                        <section>
                          <h5 className="flex items-center space-x-2 text-[11px] uppercase tracking-widest font-black text-slate-900/30 mb-3">
                            <Palette size={12} />
                            <span>Customization</span>
                          </h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] text-slate-400 uppercase font-medium">Material</span>
                              <span className="text-sm font-bold text-slate-600">{MATERIALS.find(m => m.id === state.selectedMaterial)?.name}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] text-slate-400 uppercase font-medium">Color</span>
                              <span className="text-sm font-bold text-slate-600">
                                {state.selectedColor === 'Others' 
                                  ? (state.customColor || 'Custom selection') 
                                  : (COLORS.find(c => c.hex === state.selectedColor)?.name || state.selectedColor)}
                              </span>
                            </div>
                            <div className="flex justify-between items-baseline">
                               <span className="text-[10px] text-slate-400 uppercase font-medium">Button</span>
                               <span className="text-sm font-bold text-slate-600">{state.selectedButton}</span>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                      <div className="space-y-6">
                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">Your Contact Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold opacity-50 block truncate">WhatsApp Number</label>
                            <input 
                              type="text"
                              placeholder="+84..."
                              value={state.whatsapp}
                              onChange={(e) => setState(prev => ({ ...prev, whatsapp: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all text-xs sm:text-sm"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold opacity-50 block truncate">Preferred Area</label>
                            <input 
                              type="text"
                              placeholder="City/District"
                              value={state.location}
                              onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 transition-all text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ShieldCheck size={12} className="text-emerald-600" />
                              <h4 className="text-[9px] uppercase tracking-widest font-black text-slate-400">Payment & Pricing</h4>
                            </div>
                            <span className="text-[8px] uppercase tracking-[0.2em] font-black text-slate-300">Confidential</span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                            Final pricing is provided via email after reviewing your requirements. We accept <span className="text-slate-900 font-bold">Credit Cards, PayPal</span>, and all major global payment methods.
                          </p>
                        </div>

                        <h3 className="text-xs uppercase tracking-[0.2em] font-bold opacity-30">Action</h3>
                      
                      {!requestSent ? (
                        <div className="flex space-x-2 sm:space-x-4">
                          <a 
                            href={`mailto:vietnamtailors@gmail.com?subject=${encodeURIComponent(`Bespoke Tailoring Request - ${state.selectedCategory}`)}&body=${encodeURIComponent(getRequestDetails())}`}
                            onClick={() => setRequestSent(true)}
                            className="flex-1 border border-slate-200 py-3 sm:py-4 rounded-full font-bold text-[9px] sm:text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center text-slate-900 no-underline"
                          >
                            <Mail size={12} className="mr-1.5 sm:mr-2 sm:size-[14px]" />
                            Send Request
                          </a>
                          <a 
                            href={getCalendarUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setRequestSent(true)}
                            className="flex-1 bg-slate-900 text-white py-3 sm:py-4 rounded-full font-bold text-[9px] sm:text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center no-underline"
                          >
                            <Calendar size={12} className="mr-1.5 sm:mr-2 sm:size-[14px]" />
                            Book Appointment
                          </a>
                        </div>
                      ) : (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <h4 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center text-emerald-600">
                             <Check size={14} className="mr-2" />
                             Action Triggered
                          </h4>
                          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                            We've attempted to open your request. If no window appeared, please use the options below:
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                             <a 
                               href={`https://mail.google.com/mail/?view=cm&fs=1&to=vietnamtailors@gmail.com&su=${encodeURIComponent(`Bespoke Tailoring Request - ${state.selectedCategory}`)}&body=${encodeURIComponent(getRequestDetails())}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="w-full bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                             >
                               Open in Gmail (Web)
                             </a>
                             <a 
                               href={getCalendarUrl()}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                             >
                               Open Calendar Manually
                             </a>
                             <button 
                               onClick={handleCopyDetails}
                               className="w-full bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
                             >
                               Copy Details to Paste
                             </button>
                             <button 
                               onClick={() => setRequestSent(false)}
                               className="w-full mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                             >
                               Go Back
                             </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-black text-slate-400">
                      <Sparkles size={16} className="text-blue-500 animate-pulse" />
                      <span>AI Design Consultant</span>
                    </h3>
                    <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[40px] border border-white shadow-xl min-h-[400px] flex flex-col">
                      {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs uppercase tracking-widest font-bold text-slate-400">Generating Analysis...</p>
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="prose prose-slate prose-sm leading-relaxed"
                        >
                          <div className="whitespace-pre-wrap text-slate-600 font-serif text-lg leading-relaxed first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:font-extrabold italic">
                            {aiRecs}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-20 pt-8"
            >
              <section className="text-center space-y-6">
                <h2 className="font-serif text-5xl md:text-7xl font-light">Your <span className="italic">Global</span> Bridge.</h2>
                <p className="max-w-2xl mx-auto text-slate-500 leading-relaxed font-serif text-lg">
                  VietnamTailors combines a network of thousands of master artisans with modern quality standards and global logistics. We ensure that your design vision is translated perfectly onto the finest Vietnamese fabrics.
                </p>
              </section>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { title: "Connector", desc: "Matching your design with the specific workshop best suited for the style.", icon: Network },
                  { title: "Translator", desc: "We bridge the language gap, ensuring every precise measurement is understood.", icon: Languages },
                  { title: "Quality Control", desc: "Every garment is inspected by our platform team before it leaves Vietnam.", icon: Check },
                  { title: "Shipping", desc: "Professional global handling from our warehouse directly to your doorstep.", icon: Plane },
                ].map((pillar) => (
                  <div key={pillar.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center mb-4">
                       <pillar.icon size={18} />
                    </div>
                    <h4 className="font-bold text-sm mb-2">{pillar.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative group grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=800" 
                      alt="Precision Tailoring" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Established</p>
                    <p className="font-serif text-xl italic font-bold">Since 2016</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-3xl">Connecting You to the Heartland of Craft.</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Our platform manages a vast network of master tailors with decades of experience. By choosing VietnamTailors, you aren't just buying a suit; you are accessing a managed ecosystem that handles everything from fabric sourcing to final shipping.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-200">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Network</h4>
                      <p className="font-serif text-2xl font-light">1,000+ Workshops</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Service Hubs</h4>
                      <p className="font-serif text-2xl font-light">3 Cities +</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center">
                      <Sparkles size={12} className="mr-2 text-blue-500" />
                      Our Intelligence
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      By integrating AI stylistic analysis, we help bridge the gap between inspiration and the final cut, ensuring your measurements and aesthetic desires align perfectly with modern trends.
                    </p>
                  </div>
                </div>
              </div>

              <section className="bg-white rounded-[40px] p-12 text-center border border-slate-100 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <h3 className="font-serif text-3xl mb-8 relative z-10">Get in Touch</h3>
                <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
                  <div className="space-y-2 group">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center">
                       <Mail size={12} className="mr-2" />
                       Workshop Email
                    </h4>
                    <a href="mailto:vietnamtailors@gmail.com" className="text-lg font-medium hover:text-blue-600 transition-colors block">vietnamtailors@gmail.com</a>
                  </div>
                  <div className="space-y-2 group">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center">
                       <Facebook size={12} className="mr-2" />
                       Social Profile
                    </h4>
                    <a href="https://facebook.com/vietnamtailors" target="_blank" rel="noopener noreferrer" className="text-lg font-medium hover:text-blue-600 transition-colors block">@vietnamtailors</a>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center">
                       <Sparkles size={12} className="mr-2" />
                       Collaborations
                    </h4>
                    <p className="text-lg font-medium text-slate-400 italic">Available upon request</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentView('tailor')}
                  className="mt-12 bg-slate-900 text-white px-10 py-5 rounded-full font-medium tracking-tight hover:scale-105 transition-transform relative z-10 shadow-xl shadow-slate-900/20"
                >
                  Book Your Session
                </button>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <div className="hidden md:block pointer-events-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-20 vertical-text origin-left transform -rotate-180 mb-2">Established 2016</p>
          </div>
          <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full border border-black/5 pointer-events-auto">
             <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">VietnamTailors System v1.0 • Secure AI Analysis Active</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Dropzone({ onDrop, loading }: { onDrop: (files: File[]) => void, loading: boolean }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true
  } as any);

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "border-2 border-dashed rounded-[32px] p-8 text-center cursor-pointer transition-all h-full min-h-[160px] flex flex-col items-center justify-center",
        isDragActive ? "border-slate-900 bg-slate-900/5" : "border-slate-200 hover:border-slate-300",
        loading && "opacity-50 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <Upload size={32} className="text-slate-300 mb-4" />
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Processing...</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Upload Photo</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Drag & drop or highlight style</p>
        </>
      )}
    </div>
  );
}
