import { motion } from "motion/react";
import { ArrowLeft, Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

export function MessageSentPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les paramètres de l'URL
  const params = new URLSearchParams(location.search);
  const name = params.get('name') || 'User';
  const email = params.get('email') || '';
  const subject = params.get('subject') || '';
  const message = params.get('message') || '';

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200,
            }}
            className="w-24 h-24 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check className="w-12 h-12 text-white dark:text-black" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-black dark:text-white mb-4"
          >
            Message Sent!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-black/60 dark:text-white/60 text-lg max-w-2xl mx-auto"
          >
            Thank you for reaching out! We've received your message and will get back to you soon.
          </motion.p>
        </motion.div>

        {/* Message Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-8">Your Message Summary</h2>

          <div className="space-y-6">
            <div className="pb-6 border-b border-black/10 dark:border-white/10">
              <label className="block text-black/60 dark:text-white/60 text-sm mb-2 font-medium">
                Name
              </label>
              <p className="text-black dark:text-white text-lg">{name}</p>
            </div>

            <div className="pb-6 border-b border-black/10 dark:border-white/10">
              <label className="block text-black/60 dark:text-white/60 text-sm mb-2 font-medium">
                Email
              </label>
              <p className="text-black dark:text-white text-lg break-all">{email}</p>
            </div>

            <div className="pb-6 border-b border-black/10 dark:border-white/10">
              <label className="block text-black/60 dark:text-white/60 text-sm mb-2 font-medium">
                Subject
              </label>
              <p className="text-black dark:text-white text-lg">{subject}</p>
            </div>

            <div>
              <label className="block text-black/60 dark:text-white/60 text-sm mb-2 font-medium">
                Message
              </label>
              <p className="text-black dark:text-white text-lg whitespace-pre-wrap bg-black/5 dark:bg-white/5 p-4 rounded-lg">
                {message}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
