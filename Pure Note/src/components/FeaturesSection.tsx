import { Edit3, Shield, Share2, RefreshCw, Search, Brain } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { motion } from "motion/react";

export function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Edit3,
      title: t.powerfulEditor,
      description: t.powerfulEditorDesc
    },
    {
      icon: Shield,
      title: t.totalSecurity,
      description: t.totalSecurityDesc
    },
    {
      icon: Share2,
      title: t.smartSharing,
      description: t.smartSharingDesc
    },
    {
      icon: RefreshCw,
      title: t.synchronization,
      description: t.synchronizationDesc
    },
    {
      icon: Search,
      title: t.advancedSearch,
      description: t.advancedSearchDesc
    },
    {
      icon: Brain,
      title: t.fullHistory,
      description: t.fullHistoryDesc
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center space-y-4 mb-20"
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
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {t.featuresTitle}
          </motion.h2>
          <motion.p 
            className="text-xl text-black dark:text-white max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t.featuresSubtitle}
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="group"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div 
                className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl p-8 h-full hover:shadow-lg hover:border-black dark:hover:border-white transition-all duration-300"
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="space-y-6">
                  <motion.div 
                    className="w-12 h-12 bg-white dark:bg-black rounded-xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-all duration-300"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-6 h-6 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <motion.h3 
                      className="text-xl font-medium text-black dark:text-white"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-black dark:text-white leading-relaxed"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}