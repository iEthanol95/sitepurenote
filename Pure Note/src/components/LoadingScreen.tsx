import { useEffect, useState, useRef } from "react";
import { FileText } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const onCompleteRef = useRef(onLoadingComplete);

  useEffect(() => {
    onCompleteRef.current = onLoadingComplete;
  }, [onLoadingComplete]);

  useEffect(() => {
    let intervalId: number | undefined;
    let hasCompleted = false;
    
    // Simuler le chargement progressif
    intervalId = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!hasCompleted) {
            hasCompleted = true;
            // Déclencher la fin du chargement
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                onCompleteRef.current();
              }, 300);
            }, 200);
          }
          return 100;
        }
        // Accélération progressive
        const increment = prev < 50 ? 4 : prev < 80 ? 6 : 10;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center z-[9999] transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Logo et nom */}
      <div className="flex flex-col items-center gap-8 mb-12">
        <div className="relative">
          {/* Cercle animé autour du logo */}
          <div className="absolute inset-0 -m-4">
            <svg className="w-24 h-24" viewBox="0 0 100 100" style={{ animation: 'spin 3s linear infinite' }}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="70 200"
                strokeLinecap="round"
                className="text-black/10 dark:text-white/10"
              />
            </svg>
          </div>
          
          {/* Logo */}
          <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl">
            <FileText className="w-8 h-8 text-white dark:text-black" />
          </div>
        </div>

        {/* Nom de l'app */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl text-black dark:text-white tracking-tight">
            Pure Note
          </h1>
          <p className="text-sm text-black/40 dark:text-white/40">
            Simple. Elegant. Powerful.
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-64 h-1 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pourcentage */}
      <div className="mt-4 text-sm text-black/30 dark:text-white/30 tabular-nums">
        {progress}%
      </div>

      {/* Points animés */}
      <div className="flex gap-1.5 mt-8">
        <div
          className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
