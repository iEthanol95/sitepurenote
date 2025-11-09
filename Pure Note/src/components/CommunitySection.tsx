import { Button } from "./ui/button";
import { Shield, Clock, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";

interface CommunitySectionProps {
  onShowReviews?: () => void;
}

export function CommunitySection({ onShowReviews }: CommunitySectionProps) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Sparkles,
      color: "text-black dark:text-white",
      number: t.newPlatform,
      description: t.innovative
    },
    {
      icon: Shield,
      color: "text-black dark:text-white",
      number: t.secure,
      description: t.securePrivate
    },
    {
      icon: Clock,
      color: "text-black dark:text-white",
      number: t.support,
      description: t.dedicatedSupport
    }
  ];

  return (
    <section id="community" className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          className="space-y-6 mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-normal text-black dark:text-white"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.communityTitle}
          </motion.h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="space-y-4"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <motion.div 
                className="flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
              </motion.div>
              <motion.div 
                className="text-3xl font-normal text-black dark:text-white"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {stat.number}
              </motion.div>
              <motion.div 
                className="text-black dark:text-white"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {stat.description}
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div 
            className="w-12 h-12 bg-white dark:bg-black rounded-full shadow-sm flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-black dark:text-white">👥</span>
          </motion.div>
          
          <motion.p 
            className="text-xl text-black dark:text-white max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t.communityDescription}
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button 
              onClick={onShowReviews}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white px-8 py-6 text-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-black to-black dark:from-white dark:to-white"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.4 }}
              />
              <span className="relative z-10">{t.authenticReviews}</span>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-black dark:border-white"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Shield, text: t.gdprCompliant },
            { emoji: "🔒", text: t.sslEncryption },
            { emoji: "🇪🇺", text: t.euHosting }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-2 text-sm text-black dark:text-white"
              whileHover={{ y: -2, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {item.icon ? (
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-4 h-4 text-black dark:text-white" />
                </motion.div>
              ) : (
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.emoji}
                </motion.span>
              )}
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}