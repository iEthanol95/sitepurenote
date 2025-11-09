import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onBackToHome: () => void;
}

export function ForgotPassword({ onBackToLogin, onBackToHome }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Utiliser l'API Supabase pour envoyer un email de réinitialisation
      const response = await fetch(`https://${projectId}.supabase.co/auth/v1/recover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': publicAnonKey
        },
        body: JSON.stringify({ email })
      });

      // Supabase retourne toujours 200 pour la sécurité, même si l'email n'existe pas
      if (response.ok) {
        setSuccess(true);
      } else {
        const result = await response.json();
        setError(result.error_description || result.msg || "Une erreur s'est produite");
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError("Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.button
            onClick={onBackToHome}
            className="mb-8 flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <span>←</span>
            <span>{t.back}</span>
          </motion.button>

          {/* Logo */}
          <motion.div 
            className="text-center mb-12 cursor-pointer"
            onClick={onBackToHome}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-3xl font-light text-black dark:text-white tracking-tight">
              Pure Note
            </h1>
          </motion.div>

          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-8 text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <div>
              <h2 className="text-2xl font-light text-black dark:text-white mb-3">
                {t.resetLinkSent}
              </h2>
              <p className="text-black/60 dark:text-white/60 font-light">
                {t.resetLinkSentDescription}
              </p>
            </div>

            <motion.button
              onClick={onBackToLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 flex items-center justify-center gap-2"
            >
              {t.backToLogin}
              <span>→</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          onClick={onBackToLogin}
          className="mb-8 flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
          whileHover={{ x: -4 }}
          transition={{ duration: 0.2 }}
        >
          <span>←</span>
          <span>{t.back}</span>
        </motion.button>

        {/* Logo */}
        <motion.div 
          className="text-center mb-12 cursor-pointer"
          onClick={onBackToHome}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-3xl font-light text-black dark:text-white tracking-tight">
            Pure Note
          </h1>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl font-light text-black dark:text-white mb-2">
            {t.resetPasswordTitle}
          </h2>
          <p className="text-black/60 dark:text-white/60 font-light text-sm">
            {t.resetPasswordDescription}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-8"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40">
                @
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                required
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-300 text-lg font-light"
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
              >
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                {t.sendingResetLink}
              </>
            ) : (
              <>
                {t.sendResetLink}
                <span>→</span>
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Back to Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <button
            onClick={onBackToLogin}
            className="text-black/60 dark:text-white/60 font-light hover:text-black dark:hover:text-white transition-all duration-200"
          >
            {t.backToLogin}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}