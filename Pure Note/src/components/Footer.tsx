import { useLanguage } from "././LanguageContext";
import { motion } from "motion/react";

interface FooterProps {
  onShowContact?: () => void;
}

export function Footer({ onShowContact }: FooterProps) {
  const { t, theme } = useLanguage();

  const footerSections = [
    {
      title: t.product,
      links: [
        { name: t.features, href: "#", onClick: undefined },
        { name: t.pricing, href: "#", onClick: undefined },
        { name: t.changelog, href: "#", onClick: undefined },
        { name: t.roadmap, href: "#", onClick: undefined }
      ]
    },
    {
      title: t.supportSection,
      links: [
        { name: t.documentation, href: "#", onClick: undefined },
        { name: t.userGuide, href: "#", onClick: undefined },
        { name: t.contact, href: "#", onClick: onShowContact },
        { name: t.status, href: "#", onClick: undefined }
      ]
    },
    {
      title: t.legal,
      links: [
        { name: t.privacy, href: "#", onClick: undefined },
        { name: t.terms, href: "#", onClick: undefined },
        { name: t.rgpd, href: "#", onClick: undefined },
        { name: t.cookies, href: "#", onClick: undefined }
      ]
    }
  ];

  return (
    <footer id="about" className="bg-white dark:bg-black border-t border-black/10 dark:border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <motion.div 
            className="space-y-4"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white dark:text-black text-sm">✎</span>
              </motion.div>
              <span className="font-medium text-black dark:text-white">Pure Note</span>
            </motion.div>
            <motion.p 
              className="text-black/70 dark:text-white/70 text-sm leading-relaxed"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {t.footerDescription}
            </motion.p>
          </motion.div>
          
          {footerSections.map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex}
              className="space-y-4"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
            >
              <motion.h4 
                className="font-medium text-black dark:text-white"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {section.title}
              </motion.h4>
              <ul className="space-y-2 text-sm text-black/70 dark:text-white/70">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a 
                      href={link.href} 
                      className="hover:text-black dark:hover:text-white transition-colors relative"
                      whileHover={{ x: 5, color: theme === "dark" ? "#fff" : "#000" }}
                      transition={{ duration: 0.2 }}
                      onClick={link.onClick}
                    >
                      {link.name}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/10 dark:border-white/10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.p 
            className="text-sm text-black dark:text-white"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {t.allRightsReserved}
          </motion.p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <motion.span 
              className="text-sm text-black dark:text-white"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {t.respectPrivacy}
            </motion.span>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-black dark:bg-white rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <motion.span 
                className="text-xs text-black dark:text-white"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {t.cookieMessage}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}