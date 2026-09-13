// Speech Recognition utility for browser voice dictation

export interface SpeechRecognitionResultHandler {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
  );
}

export function createSpeechRecognizer(handlers: SpeechRecognitionResultHandler) {
  if (!isSpeechRecognitionSupported()) return null;

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognitionClass();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let currentTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      currentTranscript += event.results[i][0].transcript;
    }
    handlers.onResult(currentTranscript);
  };

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error:", event.error);
    handlers.onError(event.error);
  };

  recognition.onend = () => {
    handlers.onEnd();
  };

  return recognition;
}

// Speech Synthesis (Text-to-Speech) for reading questions out loud

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

export function stopSpeaking(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.cancel();
}

export function speakText(
  text: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: () => void }
): void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onError?.();
    return;
  }

  // Cancel any existing playback
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = "en-US";

  // Pick a smooth, natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) =>
      (v.name.includes("Natural") ||
        v.name.includes("Google") ||
        v.name.includes("Samantha") ||
        v.name.includes("Daniel")) &&
      v.lang.startsWith("en")
  );
  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  if (callbacks?.onStart) utterance.onstart = callbacks.onStart;
  if (callbacks?.onEnd) utterance.onend = callbacks.onEnd;
  if (callbacks?.onError) utterance.onerror = callbacks.onError;

  window.speechSynthesis.speak(utterance);
}


