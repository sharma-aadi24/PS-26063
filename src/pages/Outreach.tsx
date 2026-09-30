// src/pages/Outreach.tsx
import React, { useState } from 'react';
import { Bot, FileText, Send, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { postOutreach } from '../services/api';

const Outreach: React.FC = () => {
  const [sourceType, setSourceType] = useState('Expedition');
  const [audience, setAudience] = useState('Public');
  const [format, setFormat] = useState('Social Media Post');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate generation delay
    setTimeout(async () => {
      const generatedText = `[AI GENERATED DRAFT]\n\nDid you know? Our latest ${sourceType} reveals fascinating insights about polar ecosystems! ❄️\n\nDesigned for: ${audience}\nFormat: ${format}\n\n#PolarScience #NCPOR #Research`;
      
      try {
        const item = await postOutreach({
          title: `Generated ${format} for ${audience}`,
          sourceType,
          sourceId: 1,
          audience,
          contentType: format,
          generatedText
        });
        setResult(item);
      } catch (e) {
        console.error(e);
      } finally {
        setGenerating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#e0f7ff] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-[#00d1ff]" size={32} />
            <h1 className="text-3xl font-bold text-white">Outreach Studio</h1>
            <span className="text-xs bg-[#00d1ff]/20 text-[#00d1ff] px-3 py-1 rounded-full border border-[#00d1ff]/40 ml-2">AI Assistant</span>
          </div>
          <p className="text-[#e0f7ff]/60">Generate public-facing content from scientific datasets, publications and expedition reports.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} /> 1. Select Source Material</h3>
              <select value={sourceType} onChange={e => setSourceType(e.target.value)}
                className="w-full bg-[#0a0e27] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d1ff]">
                <option>Expedition Report</option>
                <option>Scientific Publication</option>
                <option>Dataset Metadata</option>
                <option>Knowledge Article</option>
              </select>
            </div>

            <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Share2 size={18} /> 2. Target Audience</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Public', 'Students', 'Media/Journalists', 'Policymakers'].map(a => (
                  <button key={a} onClick={() => setAudience(a)}
                    className={`p-3 rounded-lg border text-sm font-medium transition ${audience === a ? 'bg-[#00d1ff]/10 border-[#00d1ff] text-[#00d1ff]' : 'bg-[#0a0e27] border-white/10 text-white/60 hover:border-white/30'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0d1a3a]/80 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Send size={18} /> 3. Content Format</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Social Media Post', 'Website Story', 'Press Release', 'Educational Summary'].map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`p-3 rounded-lg border text-sm font-medium transition ${format === f ? 'bg-[#00d1ff]/10 border-[#00d1ff] text-[#00d1ff]' : 'bg-[#0a0e27] border-white/10 text-white/60 hover:border-white/30'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={generating}
              className="w-full py-4 bg-[#00d1ff] text-[#0a0e27] font-bold rounded-xl hover:bg-[#00d1ff]/80 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
              {generating ? <><Bot className="animate-pulse" /> Generating...</> : <><Sparkles /> Generate Content</>}
            </button>
            <p className="text-xs text-center text-white/40">AI assists researchers; humans approve scientific communication.</p>
          </div>

          {/* Result Preview */}
          <div className="bg-[#041024] border border-white/10 rounded-2xl flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0d1a3a]/50">
              <span className="font-medium text-white text-sm flex items-center gap-2">
                <Bot size={16} className="text-[#00d1ff]" /> Output Preview
              </span>
              {result && <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/40">Status: Draft (Needs Review)</span>}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex items-center justify-center min-h-[400px]">
              {generating ? (
                <div className="text-center">
                  <Bot size={48} className="mx-auto text-[#00d1ff] animate-bounce mb-4" />
                  <p className="text-[#e0f7ff]/60 animate-pulse">Analyzing source and generating tailored content...</p>
                </div>
              ) : result ? (
                <div className="w-full h-full flex flex-col">
                  <textarea 
                    readOnly 
                    value={result.generatedText}
                    className="flex-1 w-full bg-[#0d1a3a]/50 border border-white/10 rounded-xl p-6 text-[#e0f7ff]/90 resize-none focus:outline-none focus:border-[#00d1ff]/50 leading-relaxed font-serif"
                  />
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium flex items-center justify-center gap-2">
                      <FileText size={18} /> Copy to Clipboard
                    </button>
                    <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Submit for Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#e0f7ff]/30">
                  <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select your parameters and click Generate.</p>
                </div>
              )}
            </div>
            
            {/* Workflow Diagram overlay if empty */}
            {!generating && !result && (
              <div className="absolute inset-0 pointer-events-none p-8 flex items-center justify-center opacity-10">
                 <div className="flex items-center gap-2 text-xl font-bold">
                    <span>Source</span> ➔ <span>Extract</span> ➔ <span>Audience</span> ➔ <span>Generate</span> ➔ <span>Publish</span>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outreach;
