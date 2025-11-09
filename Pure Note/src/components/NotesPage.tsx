import { useState, useEffect, useRef } from "react";
import { useLanguage } from "./LanguageContext";
import { FileText, Moon, ArrowLeft } from "lucide-react";

interface NotesPageProps {
  onBackToHome: () => void;
}

export function NotesPage({ onBackToHome }: NotesPageProps) {
  const { t } = useLanguage();
  const [noteContent, setNoteContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showSynced, setShowSynced] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Nettoyer le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (noteContent.length > 0) {
      setIsWriting(true);
      setShowSynced(false);
      
      // Simuler "Synchronisé" après 2 secondes d'inactivité
      timeoutRef.current = setTimeout(() => {
        setIsWriting(false);
        setShowSynced(true);
      }, 2000);
    } else {
      setIsWriting(false);
      setShowSynced(false);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [noteContent]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#1a1a1a] flex items-center justify-center p-6">
      {/* Bouton de retour flottant */}
      <button
        onClick={onBackToHome}
        className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2a2a2a] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-black/5 dark:border-white/5 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
        }`}
        style={{ transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s' }}
      >
        <ArrowLeft className="w-4 h-4 text-black dark:text-white group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm text-black dark:text-white">
          {t.back}
        </span>
      </button>

      <div
        className={`w-full max-w-3xl h-[600px] bg-white dark:bg-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* macOS Window Controls */}
        <div className="h-14 bg-[#f6f6f6] dark:bg-[#323232] flex items-center justify-between px-5 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            {/* Close Button - Red */}
            <button
              onClick={onBackToHome}
              onMouseEnter={() => setHoveredButton("close")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[14px] h-[14px] rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-all duration-200 relative flex items-center justify-center group shadow-sm"
              style={{
                boxShadow: '0 1px 3px rgba(255, 95, 87, 0.5)'
              }}
            >
              {hoveredButton === "close" && (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  className="absolute"
                >
                  <path
                    d="M2 2L6 6M6 2L2 6"
                    stroke="#5a0000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>

            {/* Minimize Button - Yellow */}
            <button
              onMouseEnter={() => setHoveredButton("minimize")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[14px] h-[14px] rounded-full bg-[#ffbd2e] hover:bg-[#ffaa00] transition-all duration-200 relative flex items-center justify-center shadow-sm"
              style={{
                boxShadow: '0 1px 3px rgba(255, 189, 46, 0.5)'
              }}
            >
              {hoveredButton === "minimize" && (
                <div className="w-[6px] h-[2px] bg-[#5a3c00] rounded-full absolute" />
              )}
            </button>

            {/* Maximize Button - Green */}
            <button
              onMouseEnter={() => setHoveredButton("maximize")}
              onMouseLeave={() => setHoveredButton(null)}
              className="w-[14px] h-[14px] rounded-full bg-[#28c840] hover:bg-[#1fb32f] transition-all duration-200 relative flex items-center justify-center shadow-sm"
              style={{
                boxShadow: '0 1px 3px rgba(40, 200, 64, 0.5)'
              }}
            >
              {hoveredButton === "maximize" && (
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  className="absolute"
                >
                  <path
                    d="M2 6L6 2M6 2H3.5M6 2V4.5"
                    stroke="#003d00"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Title with icon */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-black/40 dark:text-white/40" />
            <span className="text-sm text-black/70 dark:text-white/70">
              {t.newNoteFilename}
            </span>
          </div>

          {/* Right button */}
          <button className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center hover:opacity-80 transition-opacity">
            <Moon className="w-4 h-4 text-white dark:text-black" />
          </button>
        </div>

        {/* Writing status indicator */}
        <div className="px-10 pt-6 pb-2 h-10">
          {isWriting && (
            <div className="text-sm text-[#ff6b35] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse" />
              {t.writingInProgress}
            </div>
          )}
        </div>

        {/* Note Editor */}
        <div className="flex-1 overflow-hidden px-10 pb-4">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder={t.language === "fr" ? "Commencez à écrire..." : "Start writing..."}
            className="w-full h-full bg-transparent text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 resize-none focus:outline-none"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: "15px",
              lineHeight: "1.7",
            }}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="h-12 bg-[#f6f6f6] dark:bg-[#323232] border-t border-black/5 dark:border-white/5 flex items-center px-5">
          {showSynced && noteContent.length > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
              <span className="text-xs text-black/70 dark:text-white/70">
                {t.synchronized}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}