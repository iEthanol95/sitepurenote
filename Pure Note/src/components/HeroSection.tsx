import { Button } from "./ui/button";
import { Check, Play } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";

interface HeroSectionProps {
  onDemoClick?: () => void;
}

export function HeroSection({ onDemoClick }: HeroSectionProps) {
  const { t } = useLanguage();

const handleDownload = () => {
  const fileUrl =
    "https://github.com/iEthanol95/sitepurenote/raw/refs/heads/main/Pure%20Note/Pure_Note_Setup_1.0.0.exe";
  window.open(fileUrl, "_blank", "noopener,noreferrer");
};


  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-white dark:from-black dark:to-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="space-y-6"
            >
              <motion.h1
                className="text-5xl lg:text-6xl font-normal leading-tight text-black dark:text-white"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                {t.heroTitle}
                <br />
                <motion.span
                  className="text-black dark:text-white"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  {t.heroSubtitle}
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl text-black dark:text-white leading-relaxed max-w-md"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                {t.heroDescription}
              </motion.p>
            </motion.div>

            {/* ✅ Boutons : Télécharger et Voir la démo */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {/* Bouton de téléchargement */}
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Button
                  onClick={handleDownload}
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white px-8 py-6 text-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black to-black dark:from-white dark:to-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="relative z-10">
                    {t.language === "fr"
                      ? "Télécharger Pure Note"
                      : "Download Pure Note"}
                  </span>
                </Button>
              </motion.div>

              {/* Bouton démo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Button
                  onClick={onDemoClick}
                  variant="ghost"
                  className="text-black dark:text-white px-8 py-6 text-lg flex items-center gap-2 hover:bg-white dark:hover:bg-black transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Play className="w-5 h-5" />
                  </motion.div>
                  {t.watchDemo}
                </Button>
              </motion.div>
            </motion.div>

            {/* ✅ Liste d’avantages */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 pt-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {[
                { icon: Check, text: t.cleanInterface },
                { icon: Check, text: t.realtimeSync },
                { icon: Check, text: t.secureSharing },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 text-black dark:text-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.3 + index * 0.1,
                  }}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Check className="w-5 h-5 text-black dark:text-white" />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ✅ Animation de droite (interface de note) */}
          <motion.div
            className="lg:pl-12"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <div className="relative">
              <motion.div
                className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-black dark:border-white overflow-hidden"
                whileHover={{
                  y: -10,
                  shadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-black border-b border-black dark:border-white">
                  <div className="flex gap-2">
                    <motion.div
                      className="w-3 h-3 rounded-full bg-black"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-black dark:bg-white"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="w-3 h-3 rounded-full bg-black dark:bg-white"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4 text-sm text-black dark:text-white">
                    <span>📄</span>
                    <span>{t.newNoteFilename}</span>
                  </div>
                  <div className="ml-auto">
                    <motion.div
                      className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 180, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white dark:text-black text-xs">
                        ⚡
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div className="p-8 min-h-[400px] bg-white dark:bg-black">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-black dark:text-white">
                      <motion.span
                        className="w-1 h-6 bg-black dark:bg-white"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                      />
                      <span className="text-sm">
                        {t.writingInProgress}
                      </span>
                    </div>
                    <motion.div
                      className="space-y-3 pt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.5 }}
                    >
                      <motion.div
                        className="h-4 bg-black dark:bg-white rounded w-3/4"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{
                          duration: 1.5,
                          delay: 1.6,
                        }}
                      />
                      <motion.div
                        className="h-4 bg-black dark:bg-white rounded w-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 1.5,
                          delay: 1.8,
                        }}
                      />
                      <motion.div
                        className="h-4 bg-black dark:bg-white rounded w-2/3"
                        initial={{ width: 0 }}
                        animate={{ width: "66%" }}
                        transition={{ duration: 1.5, delay: 2 }}
                      />
                    </motion.div>
                  </div>
                </div>

                <div className="px-6 py-3 bg-white dark:bg-black border-t border-black dark:border-white flex items-center gap-4 text-sm text-black dark:text-white">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-black dark:bg-white rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <span>{t.synchronized}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
