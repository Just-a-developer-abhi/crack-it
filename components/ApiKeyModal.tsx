"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [keyInput, setKeyInput] = useState<string>(apiKey);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setKeyInput(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleaned = keyInput.trim().replace(/^["']|["']$/g, "");
    onSaveApiKey(cleaned);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveApiKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel bg-slate-900/95 border border-slate-750 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Key size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-100">
                  How to Set Up Your Free AI Key
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BYOK
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Unlock 100% Free & Unlimited AI Mock Interviews
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3 Step Interactive Walkthrough */}
        <div className="py-5 space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-xs font-semibold text-slate-200">
                Go to Google AI Studio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google provides every account a generous free tier (15 requests/minute) with <strong>zero credit card required</strong>.
              </p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition pt-1"
              >
                <span>Open Google AI Studio Key Page</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-xs font-semibold text-slate-200">
                Create & Copy Your API Key
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click the blue <strong>&ldquo;Create API key&rdquo;</strong> button, choose your project (or default), and copy the generated key string.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1 space-y-2.5">
              <h3 className="text-xs font-semibold text-slate-200">
                Paste Your Key Below
              </h3>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Paste Gemini API key here..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-750 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Privacy Guarantee */}
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-950/25 border border-emerald-800/40 text-xs text-emerald-300 mb-6">
          <ShieldCheck size={18} className="shrink-0 text-emerald-400 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Security Guarantee:</strong> Your key is saved strictly in your browser&apos;s local storage and used directly for your interviews. It is never stored on external databases or shared.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300 transition underline underline-offset-4"
              >
                Remove Saved Key
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-slate-100 rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} /> Saved & Unlimited Active!
                </>
              ) : (
                <>
                  <Zap size={14} /> Save & Unlock Unlimited
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
