import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";
import { useSimpleAuth } from "./SimpleAuthContext";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

interface HeaderProps {
  onShowLogin?: () => void;
  onShowSignup?: () => void;
  onShowProfile?: () => void;
  onShowDonations?: () => void;
  onShowNotes?: () => void;
  onShowContact?: () => void;
}

export function Header({
  onShowLogin,
  onShowSignup,
  onShowProfile,
  onShowDonations,
  onShowNotes,
  onShowContact,
}: HeaderProps) {
  const { theme, toggleTheme, t, scrollToTop } = useLanguage();
  const { user } = useSimpleAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition =
        element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="w-full px-6 py-4 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/10 dark:border-white/10 fixed top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={scrollToTop}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{
              scale: 0.8,
              rotate: [0, -10, 10, -5, 5, 0],
              y: [0, -5, 0],
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
              tap: { duration: 0.6 },
            }}
            className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center"
          >
            <span className="text-white dark:text-black text-sm">
              ✎
            </span>
          </motion.div>
          <motion.span
            className="font-medium text-black dark:text-white"
            whileHover={{ x: 3 }}
            whileTap={{
              scale: [1, 0.95, 1.05, 1],
              x: [0, -2, 2, 0],
            }}
            transition={{
              duration: 0.2,
              tap: { duration: 0.4 },
            }}
          >
            Pure Note
          </motion.span>
        </motion.div>

        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex items-center gap-8"
        >
          <motion.button
            onClick={onShowNotes}
            whileHover={{
              y: -2,
              color: theme === "dark" ? "#fff" : "#000",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors relative"
          >
            {t.language === "fr" ? "Notes" : "Notes"}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("features")}
            whileHover={{
              y: -2,
              color: theme === "dark" ? "#fff" : "#000",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors relative"
          >
            {t.features}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.button
            onClick={() => {
              window.open('https://paypal.me/PureNoteContact', '_blank');
            }}
            whileHover={{
              y: -2,
              color: theme === "dark" ? "#fff" : "#000",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors relative"
          >
            {t.donations}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.button
            onClick={() => scrollToSection("about")}
            whileHover={{
              y: -2,
              color: theme === "dark" ? "#fff" : "#000",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 10,
            }}
            className="text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors relative"
          >
            {t.about}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.nav>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
            className="p-2 rounded-lg bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </motion.div>
          </motion.button>

          <LanguageSelector />
          {user ? (
            <motion.button
              onClick={onShowProfile}
              className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/10 rounded-lg hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm">👤</span>
              <span className="text-sm text-black/70 dark:text-white/70">
                {user.name || user.email}
              </span>
            </motion.button>
          ) : (
            <>
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
                  variant="ghost"
                  className="text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300"
                  onClick={onShowLogin}
                >
                  {t.login}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
              >
                <Button
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
                  onClick={onShowSignup}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/80 to-black dark:from-white/80 dark:to-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {t.signup}
                  </span>
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}