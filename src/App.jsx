import React, { useState } from 'react';
import { Activity, AlertCircle, ArrowRight, RotateCcw, CheckCircle, Info, Stethoscope, ChevronRight, Check } from 'lucide-react';

const AOSpineTraumaFlow = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    morphology: null,
    neurology: null,
    m1: false,
    m2: false
  });

  // Data Definitions
  const morphologies = [
    { id: 'A0', type: 'A', name: 'A0: Minor/Insignificant', desc: 'Spinous/transverse process fractures. No structural instability.', points: 0 },
    { id: 'A1', type: 'A', name: 'A1: Wedge Compression', desc: 'Single endplate fracture. No posterior wall involvement.', points: 1 },
    { id: 'A2', type: 'A', name: 'A2: Split/Pincer', desc: 'Coronal split or pincer fracture. Both endplates involved.', points: 2 },
    { id: 'A3', type: 'A', name: 'A3: Incomplete Burst', desc: 'Single endplate + Posterior wall involvement. Vertical laminar fracture common.', points: 3 },
    { id: 'A4', type: 'A', name: 'A4: Complete Burst', desc: 'Both endplates + Posterior wall involvement. Usually kyphotic.', points: 5 },
    { id: 'B1', type: 'B', name: 'B1: Bony Tension Band', desc: 'Chance fracture. Purely transosseous failure of posterior tension band.', points: 5 },
    { id: 'B2', type: 'B', name: 'B2: Ligamentous Tension Band', desc: 'Failure of posterior ligamentous complex (PLC) +/- bony component.', points: 6 },
    { id: 'B3', type: 'B', name: 'B3: Hyperextension', desc: 'Disruption through disc or ALL. Anterior tension band failure.', points: 7 },
    { id: 'C', type: 'C', name: 'Type C: Translation', desc: 'Displacement/Dislocation in any plane. Highly unstable.', points: 8 },
  ];

  const neurologies = [
    { id: 'N0', name: 'N0: Intact', desc: 'Neurologically intact.', points: 0 },
    { id: 'N1', name: 'N1: Transient', desc: 'Transient deficit, resolved >24hrs.', points: 1 },
    { id: 'N2', name: 'N2: Radicular', desc: 'Nerve root signs/symptoms only.', points: 2 },
    { id: 'N3', name: 'N3: Incomplete Cord', desc: 'Incomplete spinal cord injury / Cauda Equina.', points: 4 },
    { id: 'N4', name: 'N4: Complete Cord', desc: 'Complete spinal cord injury.', points: 4 },
    { id: 'NX', name: 'NX: Indeterminate', desc: 'Patient cannot be examined (e.g., head injury, intubated).', points: 3 },
  ];

  const handleMorphologySelect = (morph) => {
    setSelection({ ...selection, morphology: morph });
    setTimeout(() => setStep(2), 200);
  };

  const handleNeuroSelect = (neuro) => {
    setSelection({ ...selection, neurology: neuro });
    setTimeout(() => setStep(3), 200);
  };

  const toggleModifier = (mod) => {
    setSelection(prev => ({ ...prev, [mod]: !prev[mod] }));
  };

  const calculateScore = () => {
    let score = 0;
    if (selection.morphology) score += selection.morphology.points;
    if (selection.neurology) score += selection.neurology.points;
    if (selection.m1) score += 1;
    // M2 is 0 points but clinically relevant
    return score;
  };

  const getRecommendation = (score) => {
    if (score <= 3) return {
      action: 'Conservative',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle className="w-6 h-6" />,
      detail: 'Non-operative management is typically preferred.'
    };
    if (score === 4 || score === 5) return {
      action: 'Indeterminate (Gray Zone)',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Activity className="w-6 h-6" />,
      detail: 'Surgeon discretion required. Consider modifiers (M1/M2) and patient status.'
    };
    return {
      action: 'Surgical',
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-6 h-6" />,
      detail: 'Operative stabilization is typically recommended.'
    };
  };

  const resetFlow = () => {
    setStep(1);
    setSelection({ morphology: null, neurology: null, m1: false, m2: false });
  };

  const renderMorphologyStep = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
        Select Morphology (Worst Injury)
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {['A', 'B', 'C'].map(type => (
          <div key={type} className="space-y-2 mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {type === 'A' ? 'Compression Injuries' : type === 'B' ? 'Tension Band Injuries' : 'Translation Injuries'}
            </h3>
            {morphologies.filter(m => m.type === type).map((m) => (
              <button
                key={m.id}
                onClick={() => handleMorphologySelect(m)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden
                  ${selection.morphology?.id === m.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white shadow-sm'}`}
              >
                <div className="flex justify-between items-center z-10 relative">
                  <div>
                    <span className={`font-bold text-lg ${selection.morphology?.id === m.id ? 'text-blue-700' : 'text-slate-700'}`}>{m.name}</span>
                    <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    type === 'C' ? 'bg-rose-100 text-rose-700' :
                    type === 'B' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.points} pts
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderNeuroStep = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
        Neurological Status
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {neurologies.map((n) => (
          <button
            key={n.id}
            onClick={() => handleNeuroSelect(n)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200
              ${selection.neurology?.id === n.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white shadow-sm'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className={`font-bold text-lg ${selection.neurology?.id === n.id ? 'text-blue-700' : 'text-slate-700'}`}>{n.id}</span>
                <span className="ml-2 font-medium text-slate-600">{n.name.split(': ')[1]}</span>
                <p className="text-sm text-slate-500 mt-1">{n.desc}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                {n.points} pts
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(1)}
        className="mt-6 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        <RotateCcw className="w-4 h-4 mr-2" /> Back to Morphology
      </button>
    </div>
  );

  const renderModifierStep = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
        Clinical Modifiers
      </h2>

      <div className="space-y-4">
        <div
          onClick={() => toggleModifier('m1')}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-4
            ${selection.m1 ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white shadow-sm'}`}
        >
          <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
            ${selection.m1 ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
            {selection.m1 && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">M1: Indeterminate PLC Injury</span>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">+1 pt</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Used when MRI findings are unclear or if PLC status is equivocal (e.g., high T2 signal but no clear rupture).
              Often tips the scale in stable burst fractures.
            </p>
          </div>
        </div>

        <div
          onClick={() => toggleModifier('m2')}
          className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-start gap-4
            ${selection.m2 ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 bg-white shadow-sm'}`}
        >
          <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
            ${selection.m2 ? 'bg-amber-600 border-amber-600' : 'border-slate-300 bg-white'}`}>
            {selection.m2 && <Check className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="font-bold text-slate-800">M2: Patient Specific Comorbidity</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">0 pts</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Does not add points to score but critically affects decision (e.g., Ankylosing Spondylitis, burns, severe osteoporosis).
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep(2)}
          className="flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Back
        </button>
        <button
          onClick={() => setStep(4)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center shadow-lg hover:shadow-xl transition-all"
        >
          Calculate Result <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    const score = calculateScore();
    const rec = getRecommendation(score);
    const classification = `${selection.morphology?.id || '?'}, ${selection.neurology?.id || '?'}${selection.m1 ? ', M1' : ''}${selection.m2 ? ', M2' : ''}`;

    return (
      <div className="animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-blue-400" />
              Clinical Assessment
            </h2>
            <p className="text-slate-400 mt-1">Based on TL AOSIS Algorithm</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classification</span>
                <div className="text-3xl font-bold text-slate-800 mt-1">{classification}</div>
                <div className="text-sm text-slate-500 mt-2 space-y-1">
                  <div className="flex justify-between"><span>Morphology ({selection.morphology?.id}):</span> <span>{selection.morphology?.points} pts</span></div>
                  <div className="flex justify-between"><span>Neurology ({selection.neurology?.id}):</span> <span>{selection.neurology?.points} pts</span></div>
                  {selection.m1 && <div className="flex justify-between text-blue-600 font-medium"><span>Modifier M1:</span> <span>+1 pt</span></div>}
                </div>
              </div>

              <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Score</span>
                <div className="text-4xl font-extrabold text-blue-600 mt-1">{score}</div>
                <span className="text-sm text-slate-500">TL AOSIS Points</span>
              </div>
            </div>

            <div className={`p-5 rounded-xl border ${rec.color} mb-6`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">{rec.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{rec.action} Management</h3>
                  <p className="opacity-90 leading-relaxed">{rec.detail}</p>
                </div>
              </div>
            </div>

            {selection.m2 && (
              <div className="flex gap-3 p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 text-sm mb-6">
                <Info className="w-5 h-5 flex-shrink-0" />
                <p>
                  <strong>Note on M2:</strong> You selected a patient-specific comorbidity.
                  Even if the score suggests conservative care (e.g., Ankylosing Spondylitis with a fracture),
                  surgery might still be indicated due to the rigid spine's poor healing potential.
                  Clinical judgment overrides the calculator.
                </p>
              </div>
            )}

            <button
              onClick={resetFlow}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Start New Case
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">AOSpine Classification</h1>
          <p className="text-slate-500">Thoracolumbar Injury Classification & Severity Score (TL AOSIS)</p>
        </header>

        {step === 1 && renderMorphologyStep()}
        {step === 2 && renderNeuroStep()}
        {step === 3 && renderModifierStep()}
        {step === 4 && renderResult()}

        <footer className="mt-12 text-center text-xs text-slate-400">
          <p>Based on Vaccaro et al. (2013/2016). For educational purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default AOSpineTraumaFlow;
