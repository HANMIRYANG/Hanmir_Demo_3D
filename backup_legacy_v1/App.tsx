import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ChatWidget } from './components/ChatWidget';
import { Contact } from './components/Contact';
import { CustomCursor } from './components/CustomCursor';

function App() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white cursor-none">
      <CustomCursor />
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Statistics Band */}
        <div className="w-full bg-zinc-900 border-y border-zinc-800 py-12 cursor-none">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: "협력 파트너사", val: "350+" },
                    { label: "보유 특허", val: "42" },
                    { label: "수출 국가", val: "18" },
                    { label: "기술 만족도", val: "99%" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col border-l border-zinc-700 pl-6 group hover:bg-zinc-800/50 transition-colors p-2 rounded">
                        <span className="text-3xl font-bold text-white tracking-tighter group-hover:text-blue-500 transition-colors">{stat.val}</span>
                        <span className="text-xs font-bold text-zinc-500 mt-1">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>

        <Features />

        {/* Informational Break */}
        <section className="py-32 bg-black relative overflow-hidden cursor-none">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 grayscale"></div>
            <div className="relative max-w-7xl mx-auto px-6 text-center">
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-snug">
                    "소재의 한계를 뛰어넘는<br/>첨단 코팅 기술의 정점"
                 </h2>
                 <p className="text-zinc-400 font-medium">HANMIR Co., Ltd.</p>
            </div>
        </section>

        <Contact />
      </main>

      <footer className="bg-black py-12 border-t border-zinc-900 cursor-none">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-xs font-medium">
              <p>&copy; 2024 HANMIR Co., Ltd. All rights reserved.</p>
              <div className="flex gap-8 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
                  <a href="#" className="hover:text-white transition-colors">이용약관</a>
                  <a href="#" className="hover:text-white transition-colors">사이트맵</a>
              </div>
          </div>
      </footer>

      <ChatWidget />
    </div>
  );
}

export default App;