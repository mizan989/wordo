import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, X, Settings2 } from 'lucide-react';
import { Editor } from '@tiptap/react';

interface ReadAloudBarProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export const ReadAloudBar: React.FC<ReadAloudBarProps> = ({ isOpen, onClose, editor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const defaultVoice = available.find((v) => v.lang.startsWith('en')) || available[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!isOpen) return null;

  const getCleanTextToRead = (): string => {
    if (!editor) return '';
    const { from, to, empty } = editor.state.selection;
    if (!empty) {
      const selected = editor.state.doc.textBetween(from, to, ' ');
      if (selected.trim()) return selected;
    }
    return editor.getText();
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const text = getCleanTextToRead();
    if (!text.trim()) {
      alert('The document is empty. Type some text to hear it read aloud.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    if (selectedVoice) {
      const voiceObj = voices.find((v) => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-[#1a2333] border-b border-blue-200 dark:border-blue-900 px-4 py-2 flex items-center justify-between shadow-xs select-none animate-fadeIn transition-colors text-xs">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 font-semibold text-[#185abd] dark:text-blue-400">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>Read Aloud</span>
        </div>

        <div className="h-4 w-px bg-blue-200 dark:bg-blue-800" />

        {/* Play/Pause/Stop Controls */}
        <div className="flex items-center space-x-1 bg-white dark:bg-[#202838] border border-blue-200 dark:border-blue-800 rounded-md p-0.5 shadow-2xs">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              title="Play (Read Aloud)"
              className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#185abd] dark:text-blue-300 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={handlePause}
              title="Pause"
              className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 text-[#185abd] dark:text-blue-300 transition-colors"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          <button
            onClick={handleStop}
            title="Stop"
            className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Speed Setting */}
        <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-300">
          <span className="text-[11px]">Speed:</span>
          {[0.75, 1, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => handleRateChange(s)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                rate === s
                  ? 'bg-[#185abd] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#202838] border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Voice Selector Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-1 px-2 py-1 bg-white dark:bg-[#202838] border border-blue-200 dark:border-blue-800 rounded text-[11px] hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Settings2 className="w-3 h-3 text-[#185abd]" />
            <span>Voice</span>
          </button>

          {showSettings && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-[#202020] border border-gray-300 dark:border-gray-700 shadow-xl rounded-md p-2 z-50">
              <span className="block text-[11px] font-semibold text-gray-500 mb-1">Select Voice</span>
              <select
                value={selectedVoice}
                onChange={(e) => {
                  setSelectedVoice(e.target.value);
                  setShowSettings(false);
                  if (isPlaying) {
                    handleStop();
                    setTimeout(handlePlay, 100);
                  }
                }}
                className="w-full text-xs p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-[#181818]"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          handleStop();
          onClose();
        }}
        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md"
        title="Close Read Aloud"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
