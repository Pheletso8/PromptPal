import { useRef, useCallback } from 'react';

export const useVoice = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Memoized stop function to prevent unnecessary re-renders in ChatPage
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      // Cleanup the URL to prevent browser memory leaks
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
  }, []);

  /**
   * speaks the provided text using ElevenLabs Neural TTS.
   * @param text The content to speak
   * @param isMuted Boolean flag from ChatPage state
   */
  const speak = async (text: string, isMuted: boolean) => {
    // 1. Guard clause: Stop immediately if muted or text is empty
    if (isMuted || !text) {
      stop();
      return;
    }
    
    // Kill any currently playing audio before starting new request
    stop();

    // 2. CLEAN TEXT: Ensure the AI doesn't read out code or diagrams
    const cleanText = text
      .replace(/```mermaid[\s\S]*?```/g, "") // Remove Mermaid diagrams
      .replace(/```[\s\S]*?```/g, "")        // Remove code blocks
      .replace(/(\*\*|__)/g, "")             // Remove bold Markdown
      .replace(/\$(.*?)\$/g, "$1")           // Simplify LaTeX for speech
      .replace(/#/g, "")                     // Remove headers
      .trim();

    if (!cleanText) return;

    // 3. API CONFIGURATION
    const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Bella (Premium Neural Voice)
    // Accessing Vite environment variable (Ensure VITE_ prefix is in .env)
    const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY; 

    if (!API_KEY) {
      console.error("❌ ElevenLabs API Key is missing! Check VITE_ELEVENLABS_API_KEY in .env");
      return;
    }
    console.log("🔑 Checking API Key Presence:", API_KEY ? "Found! ✅" : "NOT FOUND (Undefined) ❌");

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: { 
            stability: 0.5, 
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("❌ ElevenLabs API Error:", errData);
        return;
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // 4. PLAYBACK: Start audio
      audio.play().catch(e => {
        console.warn("⚠️ Autoplay blocked. User must interact with page first.", e);
      });
      
    } catch (err) {
      console.error("❌ Network Error calling ElevenLabs:", err);
    }
  };

  return { speak, stop };
};
