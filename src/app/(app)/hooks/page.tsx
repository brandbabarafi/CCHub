"use client";

import { useEffect, useState } from "react";
import { Brain, Sparkles, Zap } from "lucide-react";
import { getHookTypes, getHookEmotions, getContentHooks, generateHooks, classifyHook } from "@/features/hooks/actions";

type Tab = "library" | "generator" | "classifier";

export default function HooksPage() {
  const [tab, setTab] = useState<Tab>("library");
  const [hookTypes, setHookTypes] = useState<any[]>([]);
  const [emotions, setEmotions] = useState<any[]>([]);
  const [contentHooks, setContentHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ht, em, ch] = await Promise.all([
        getHookTypes(),
        getHookEmotions(),
        getContentHooks(),
      ]);
      setHookTypes(ht);
      setEmotions(em);
      setContentHooks(ch);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Hook Intelligence</h1>
          <p className="text-sm text-text-secondary mt-1">Classify, generate, and analyze your hooks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Hook Types", value: hookTypes.length, icon: Brain },
          { label: "Hooks Created", value: contentHooks.length, icon: Zap },
          { label: "Emotions", value: emotions.length, icon: Sparkles },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow-soft p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-surface rounded-sm flex items-center justify-center">
              <Icon size={18} className="text-text-secondary" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-text-primary">{value}</p>
              <p className="text-xs text-text-tertiary">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface rounded-sm p-1 w-fit">
        {([
          { key: "library", label: "Hook Library" },
          { key: "generator", label: "Generator" },
          { key: "classifier", label: "Classifier" },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors duration-150 ${
              tab === key
                ? "bg-white text-text-primary shadow-soft"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-text-tertiary text-sm">Loading...</div>
      ) : tab === "library" ? (
        <HookLibrary hookTypes={hookTypes} />
      ) : tab === "generator" ? (
        <HookGenerator hookTypes={hookTypes} />
      ) : (
        <HookClassifier />
      )}
    </div>
  );
}

function HookLibrary({ hookTypes }: { hookTypes: any[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {hookTypes.map((ht) => (
        <div key={ht.id} className="bg-white rounded-lg shadow-soft p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary">{ht.name}</h3>
            <span className="text-xs text-text-tertiary bg-surface px-2 py-0.5 rounded-sm">
              {ht._count.hooks} hooks
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{ht.description}</p>
        </div>
      ))}
    </div>
  );
}

function HookGenerator({ hookTypes }: { hookTypes: any[] }) {
  const [brand, setBrand] = useState("");
  const [pillar, setPillar] = useState("");
  const [goal, setGoal] = useState("");
  const [hookType, setHookType] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  async function handleGenerate() {
    if (!brand || !pillar || !goal) return;
    setLoading(true);
    const hooks = await generateHooks({ brand, pillar, goal, hookType });
    setResults(hooks);
    setLoading(false);
  }

  function copyHook(idx: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Form */}
      <div className="bg-white rounded-lg shadow-soft p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-text-primary">Generate Hooks</h2>
        {[
          { label: "Brand / Niche", value: brand, set: setBrand, placeholder: "e.g. Digital Marketing Agency" },
          { label: "Content Pillar", value: pillar, set: setPillar, placeholder: "e.g. Personal Branding" },
          { label: "Goal", value: goal, set: setGoal, placeholder: "e.g. Increase awareness about pricing mistakes" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">{label}</label>
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="h-10 px-3 rounded-sm border border-border text-sm outline-none focus:border-text-primary transition-colors"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Hook Type (optional)</label>
          <select
            value={hookType}
            onChange={(e) => setHookType(e.target.value)}
            className="h-10 px-3 rounded-sm border border-border text-sm outline-none bg-white"
          >
            <option value="">Any type</option>
            {hookTypes.map((ht) => (
              <option key={ht.id} value={ht.name}>{ht.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !brand || !pillar || !goal}
          className="h-10 rounded-sm bg-text-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "Generating..." : "Generate Hooks"}
        </button>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Generated Hooks</h2>
        {results.length === 0 ? (
          <p className="text-sm text-text-tertiary">Fill the form and click generate.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((hook, i) => (
              <div key={i} className="p-3 bg-surface rounded-sm flex items-start justify-between gap-3">
                <p className="text-sm text-text-primary leading-relaxed">{hook}</p>
                <button
                  onClick={() => copyHook(i, hook)}
                  className="text-xs text-text-tertiary hover:text-text-primary transition-colors shrink-0"
                >
                  {copied === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HookClassifier() {
  const [hookText, setHookText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleClassify() {
    if (!hookText.trim()) return;
    setLoading(true);
    const res = await classifyHook(hookText);
    setResult(res);
    setLoading(false);
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Input */}
      <div className="bg-white rounded-lg shadow-soft p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-text-primary">Classify Hook</h2>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Hook Text</label>
          <textarea
            value={hookText}
            onChange={(e) => setHookText(e.target.value)}
            placeholder="Paste your hook here..."
            rows={5}
            className="px-3 py-2 rounded-sm border border-border text-sm outline-none resize-none focus:border-text-primary transition-colors"
          />
        </div>
        <button
          onClick={handleClassify}
          disabled={loading || !hookText.trim()}
          className="h-10 rounded-sm bg-text-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "Analyzing..." : "Classify Hook"}
        </button>
      </div>

      {/* Result */}
      <div className="bg-white rounded-lg shadow-soft p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">Analysis Result</h2>
        {!result ? (
          <p className="text-sm text-text-tertiary">Paste a hook and click classify.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface rounded-sm">
                <p className="text-xs text-text-tertiary mb-1">Hook Type</p>
                <p className="text-sm font-semibold text-text-primary">{result.hookType}</p>
              </div>
              <div className="p-3 bg-surface rounded-sm">
                <p className="text-xs text-text-tertiary mb-1">Emotion</p>
                <p className="text-sm font-semibold text-text-primary">{result.emotion}</p>
              </div>
            </div>
            <div className="p-3 bg-surface rounded-sm">
              <p className="text-xs text-text-tertiary mb-2">Confidence</p>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className="bg-text-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((result.confidence || 0) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">{Math.round((result.confidence || 0) * 100)}%</p>
            </div>
            {result.suggestion && (
              <div className="p-3 bg-surface rounded-sm">
                <p className="text-xs text-text-tertiary mb-1">Suggestion</p>
                <p className="text-sm text-text-primary leading-relaxed">{result.suggestion}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}