import { motion } from "motion/react";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageContext";
import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import emailjs from '@emailjs/browser';

interface ContactPageProps {
  onBackToHome: () => void;
}

export function ContactPage({ onBackToHome }: ContactPageProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('GW9_jH8rAx2dM-xPj');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error(t.fillAllFields || "Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send email via EmailJS
      await emailjs.send(
        'service_7bvp6gd',
        'template_7p3h2gl',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'purenote.contact@gmail.com',
        }
      );

      toast.success(t.messageSaved || "Message sent successfully!");
      
      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
      
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = error instanceof Error ? error.message : (t.emailSendError || "Failed to send message");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onBackToHome}
          className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.backToHome}</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-black dark:text-white mb-4">
            {t.contactTitle}
          </h1>
          <p className="text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            {t.contactSubtitle}
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Mail className="w-10 h-10 text-white dark:text-black" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-black dark:text-white mb-4"
          >
            {t.getInTouch}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-black/60 dark:text-white/60 mb-8"
          >
            {t.contactDescription}
          </motion.p>

          {/* Email Display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-6 mb-8"
          >
            <a
              href="mailto:purenote.contact@gmail.com"
              className="text-black dark:text-white hover:text-black/70 dark:hover:text-white/70 transition-colors break-all"
            >
              purenote.contact@gmail.com
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-6 text-left mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-black dark:text-white mb-2 text-sm">
                  {t.nameLabel || "Name"}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  placeholder={t.namePlaceholder || "Your name"}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-black dark:text-white mb-2 text-sm">
                  {t.emailLabel || "Email"}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                  placeholder={t.emailPlaceholder || "your@email.com"}
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-black dark:text-white mb-2 text-sm">
                {t.subjectLabel || "Subject"}
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
                placeholder={t.subjectPlaceholder || "What's this about?"}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-black dark:text-white mb-2 text-sm">
                {t.messageLabel || "Message"}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
                placeholder={t.messagePlaceholder || "Your message here..."}
              />
            </div>

            {/* Send Email Button */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 px-8 py-6 text-base group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-black/80 to-black dark:from-white/80 dark:to-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {isSubmitting ? (t.sending || "Sending...") : (t.sendMessage || "Send Message")}
                </span>
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 text-center"
        >
          <p className="text-black/50 dark:text-white/50 text-sm">
            {t.responseTime}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
