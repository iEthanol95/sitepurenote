import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { useSimpleAuth } from "./SimpleAuthContext";
import { motion } from "motion/react";
import { Heart, ArrowLeft, Coffee, Gift, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface DonationPageProps {
  onBackToHome: () => void;
}

export function DonationPage({ onBackToHome }: DonationPageProps) {
  const { t } = useLanguage();
  const { user } = useSimpleAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [serverStatus, setServerStatus] = useState<string>("");

  // Check server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const url = `https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/health`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await response.json();
        console.log("Server health check:", data);
        setServerStatus(data.stripe === "configured" ? "ready" : "no-stripe");
      } catch (error) {
        console.error("Server health check failed:", error);
        setServerStatus("error");
      }
    };
    checkHealth();
  }, []);

  const suggestedAmounts = [
    {
      amount: 5,
      icon: Coffee,
      label: t.aCoffee,
      description: t.supportTheProject,
    },
    {
      amount: 10,
      icon: Heart,
      label: t.generous,
      description: t.thankYouMuch,
    },
    {
      amount: 20,
      icon: Gift,
      label: t.superGenerous,
      description: t.youAreAmazing,
    },
    {
      amount: 50,
      icon: Sparkles,
      label: t.ultraGenerous,
      description: t.wowThankYou,
    },
  ];

  const handleDonation = async () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount < 1) {
      setErrorMessage(t.invalidAmount);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("Request timeout after 30 seconds");
    }, 30000); // 30 second timeout

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/create-checkout`;
      console.log("Calling donation endpoint:", url);
      console.log("Amount:", amount);
      console.log("User email:", user?.email || "");
      console.log("Project ID:", projectId);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          donorMessage: donorMessage,
          userEmail: user?.email || "",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        setLoading(false);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || errorJson.details || "Failed to create checkout session");
        } catch (parseError) {
          throw new Error(`Server error (${response.status}): ${errorText.substring(0, 200)}`);
        }
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      if (!data.url) {
        setLoading(false);
        throw new Error("No checkout URL received from server");
      }
      
      console.log("Redirecting to Stripe:", data.url);
      // Keep loading state true during redirect
      // Rediriger vers Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      clearTimeout(timeoutId);
      setLoading(false);
      console.error("Donation error details:", error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage(t.language === "fr" 
            ? "La requête a expiré. Veuillez réessayer." 
            : "Request timed out. Please try again.");
        } else {
          setErrorMessage(`${t.donationError}: ${error.message}`);
        }
      } else {
        setErrorMessage(t.donationError);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/10 dark:border-white/10 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center">
          <motion.button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-black dark:text-white" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl mb-6 text-black dark:text-white">
              {t.donationTitle}
            </h1>
            <p className="text-xl text-black/70 dark:text-white/70 max-w-2xl mx-auto">
              {t.donationSubtitle}
            </p>
          </motion.div>

          {/* Suggested Amounts */}
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl mb-6 text-black dark:text-white text-center">
              {t.selectAmount}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suggestedAmounts.map((item, index) => {
                const Icon = item.icon;
                const isSelected = selectedAmount === item.amount;
                return (
                  <motion.button
                    key={item.amount}
                    onClick={() => {
                      setSelectedAmount(item.amount);
                      setCustomAmount("");
                      setErrorMessage("");
                    }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? "border-black dark:border-white bg-black/5 dark:bg-white/5 scale-105"
                        : "border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-black dark:text-white mb-3" />
                    <div className="text-3xl mb-2 text-black dark:text-white">
                      {item.amount}€
                    </div>
                    <div className="text-sm text-black dark:text-white mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-black/70 dark:text-white/70">
                      {item.description}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Custom Amount */}
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="max-w-md mx-auto">
              <label className="block text-lg mb-3 text-black dark:text-white text-center">
                {t.customAmount}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                    setErrorMessage("");
                  }}
                  placeholder={t.enterCustomAmount}
                  className="text-center text-xl h-14 border-black/10 dark:border-white/10"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50">
                  €
                </div>
              </div>
            </div>
          </motion.div>

          {/* Optional Message */}
          <motion.div
            className="mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <label className="block text-lg mb-3 text-black dark:text-white text-center">
                {t.optionalMessage}
              </label>
              <textarea
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                placeholder={t.shareYourMessage}
                className="w-full h-24 px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                maxLength={200}
              />
            </div>
          </motion.div>



          {/* Server Status Warning */}
          {serverStatus === "no-stripe" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center text-yellow-800 dark:text-yellow-400"
            >
              {t.language === "fr" 
                ? "⚠️ Stripe n'est pas configuré. Veuillez contacter l'administrateur." 
                : "⚠️ Stripe is not configured. Please contact the administrator."}
            </motion.div>
          )}

          {serverStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center text-red-600 dark:text-red-400"
            >
              {t.language === "fr" 
                ? "❌ Impossible de contacter le serveur. Veuillez réessayer." 
                : "❌ Cannot reach server. Please try again."}
            </motion.div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center text-red-600 dark:text-red-400"
            >
              {errorMessage}
            </motion.div>
          )}

          {/* Donate Button */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button
              onClick={handleDonation}
              disabled={loading || (!selectedAmount && !customAmount)}
              className="px-12 py-6 text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  {t.processing}
                </span>
              ) : (
                t.proceedDonation
              )}
            </Button>
            {loading && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-black/60 dark:text-white/60"
              >
                {t.language === "fr" 
                  ? "Préparation de votre paiement sécurisé..." 
                  : "Preparing your secure payment..."}
              </motion.p>
            )}
          </motion.div>

          {/* Footer Info */}
          <motion.div
            className="mt-16 text-center space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-black/70 dark:text-white/70">
                Paiement sécurisé via Stripe
              </p>
            </div>
            <p className="text-sm text-black/50 dark:text-white/50 max-w-lg mx-auto">
              Tous les dons sont traités de manière sécurisée. Nous ne stockons jamais vos informations de paiement.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
