"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Sparkles, AlertCircle, SkipForward } from "lucide-react";
import {
  isSpeechRecognitionSupported,
  createSpeechRecognizer,
} from "@/lib/speech";

interface BottomResponseBarProps {
  onSubmit: (text: string) => void;
  onSkip?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isFollowUp?: boolean;
}

export const BottomResponseBar: React.FC<BottomResponseBarProps> = ({
  onSubmit,
  onSkip,
  disabled = false,
  placeholder = "Type your architectural explanation or use voice dictation...",
  isFollowUp = false,
}) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 180);
      textareaRef.current.style.height = `${Math.max(nextHeight, 48)}px`;
    }
  }, [text]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError("Speech recognition is not supported in this browser.");
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      const recognizer = createSpeechRecognizer({
        onResult: (transcript) => {
          setText((prev) => {
            const separator = prev && !prev.endsWith(" ") ? " " : "";
            return `${prev}${separator}${transcript}`;
          });
        },
        onError: (err) => {
          setSpeechError(`Microphone error: ${err}`);
          setIsListening(false);
          setTimeout(() => setSpeechError(null), 4000);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });

      if (recognizer) {
        try {
          recognizer.start();
          recognitionRef.current = recognizer;
          setIsListening(true);
        } catch (e) {
          console.error("Speech recognition start failed:", e);
          setIsListening(false);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
    }
    onSubmit(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }
  };

  const charCount = text.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 safe-bottom">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Context badge if responding to follow-up */}
        {isFollowUp && (
          <div className="flex items-center gap-2 mb-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 px-3 py-1.5 rounded-xl animate-fade-in">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>
              Follow-Up Probe: Be specific on edge cases and failure mechanisms.
            </span>
          </div>
        )}

        {/* Speech error indicator */}
        {speechError && (
          <div className="flex items-center gap-2 mb-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/50 px-3 py-1.5 rounded-xl">
            <AlertCircle size={14} className="shrink-0 text-rose-400" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Active Listening Indicator */}
        {isListening && (
          <div className="flex items-center gap-2 mb-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="font-medium">Listening... Speak clearly into your microphone.</span>
          </div>
        )}

        <div className="flex items-end gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all shadow-lg">
          {/* Microphone Dictation Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Stop Listening" : "Voice Dictation"}
            disabled={disabled}
            className={`p-2.5 rounded-xl transition-all shrink-0 ${
              isListening
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse"
                : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80"
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Auto-Resizing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={isListening ? "Transcribing speech..." : placeholder}
            className="flex-1 max-h-[180px] py-2 px-1 text-sm bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
          />

          {/* Action buttons: Skip + Character counter + Send Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pb-1">
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                disabled={disabled}
                title="Pass/Skip this question (Awards 0/10)"
                className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
              >
                <SkipForward size={14} />
                <span className="hidden sm:inline">Pass</span>
              </button>
            )}

            <span
              className={`text-[11px] font-mono transition-colors hidden md:inline-block ${
                charCount > 150
                  ? "text-emerald-400"
                  : charCount > 0
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              {charCount} chars
            </span>

            <button
              type="button"
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 active:scale-95"
              title="Send Answer (Enter)"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="flex items-center justify-between mt-1 px-2 text-[10px] text-slate-500">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Enter</kbd> to submit, or click <strong className="text-slate-400">Pass</strong> to skip</span>
          <span className="md:hidden">{charCount} chars</span>
        </div>
      </div>
    </div>
  );
};
