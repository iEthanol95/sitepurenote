import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "./LanguageContext";
import { useSimpleAuth } from "./SimpleAuthContext";

interface ProfilePageProps {
  onBackToHome: () => void;
}

export function ProfilePage({ onBackToHome }: ProfilePageProps) {
  const { t } = useLanguage();
  const { user, signOut } = useSimpleAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    onBackToHome();
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulation d'une sauvegarde - à implémenter avec votre backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsEditing(false);
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  // Créer une date par défaut pour "Member since"
  const { language } = useLanguage();
  const memberSince = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-2xl"
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

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-light text-black dark:text-white mb-2">
            {t.profileTitle}
          </h2>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
            >
              <p className="text-green-600 dark:text-green-400 text-center font-medium">
                {t.updateSuccess}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-8 space-y-8"
        >
          {/* Account Info Section */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-6">
              {t.accountInfo}
            </h3>
            
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm text-black/60 dark:text-white/60 font-light">
                  {t.name}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-all duration-300 font-light"
                    placeholder={t.name}
                  />
                ) : (
                  <div className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl text-black dark:text-white font-light">
                    {user.name || "-"}
                  </div>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <label className="text-sm text-black/60 dark:text-white/60 font-light">
                  {t.email}
                </label>
                <div className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl text-black dark:text-white font-light">
                  {user.email}
                </div>
              </div>

              {/* Member Since */}
              <div className="space-y-2">
                <label className="text-sm text-black/60 dark:text-white/60 font-light">
                  {t.memberSince}
                </label>
                <div className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 rounded-xl text-black dark:text-white font-light">
                  {memberSince}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!isEditing ? (
              <>
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90"
                >
                  {t.editProfile}
                </motion.button>
                
                <motion.button
                  onClick={handleSignOut}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/10 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
                      {t.signingOut}
                    </>
                  ) : (
                    t.signOut
                  )}
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={handleSave}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      {t.saveChanges}
                      <span>→</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  onClick={handleCancel}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/10 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50"
                >
                  {t.cancel}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {/* User ID (for debugging/admin purposes) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-black/40 dark:text-white/40 font-light">
            ID: {user.id.substring(0, 8)}...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}