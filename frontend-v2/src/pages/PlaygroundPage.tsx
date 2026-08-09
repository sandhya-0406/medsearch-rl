import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { FlaskConical, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlaygroundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-poppins font-bold flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-emerald-500" /> Research Playground
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Quickly test pre-configured medical domain samples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { domain: 'Brain MRI', desc: 'Glioma, Meningioma, Pituitary tumor detection', badge: 'MRI' },
          { domain: 'ESAD Surgical', desc: 'Endoscopic Surgical Action Detection', badge: 'ESAD' },
          { domain: 'MESAD Surgical', desc: 'Multi-site Surgical Action Analysis', badge: 'MESAD' },
        ].map((item, idx) => (
          <GlassCard key={idx} title={item.domain}>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              <button
                onClick={() => navigate('/analyze')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Analyze Sample
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};