import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "fr" | "en";
type Theme = "light" | "dark";

interface Translation {
  // Header
  features: string;
  donations: string;
  about: string;
  login: string;
  signup: string;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  startFree: string;
  watchDemo: string;
  cleanInterface: string;
  realtimeSync: string;
  secureSharing: string;
  writingInProgress: string;
  synchronized: string;

  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  powerfulEditor: string;
  powerfulEditorDesc: string;
  totalSecurity: string;
  totalSecurityDesc: string;
  smartSharing: string;
  smartSharingDesc: string;
  synchronization: string;
  synchronizationDesc: string;
  advancedSearch: string;
  advancedSearchDesc: string;
  fullHistory: string;
  fullHistoryDesc: string;

  // Community Section
  communityTitle: string;
  newPlatform: string;
  innovative: string;
  secure: string;
  securePrivate: string;
  support: string;
  dedicatedSupport: string;
  communityDescription: string;
  authenticReviews: string;
  gdprCompliant: string;
  sslEncryption: string;
  euHosting: string;

  // Footer
  footerDescription: string;
  product: string;
  changelog: string;
  roadmap: string;
  supportSection: string;
  documentation: string;
  userGuide: string;
  contact: string;
  status: string;
  legal: string;
  privacy: string;
  terms: string;
  rgpd: string;
  cookies: string;
  allRightsReserved: string;
  respectPrivacy: string;
  cookieMessage: string;

  // File name
  newNoteFilename: string;

  // Auth
  loginTitle: string;
  signupTitle: string;
  name: string;
  email: string;
  password: string;
  signin: string;
  signup: string;
  noAccount: string;
  hasAccount: string;
  signingIn: string;
  signingUp: string;
  successMessage: string;
  rememberMe: string;
  back: string;

  // Profile
  profileTitle: string;
  myProfile: string;
  accountInfo: string;
  signOut: string;
  signingOut: string;
  editProfile: string;
  saveChanges: string;
  cancel: string;
  updateSuccess: string;
  memberSince: string;

  // Password Reset
  forgotPassword: string;
  resetPasswordTitle: string;
  resetPasswordDescription: string;
  sendResetLink: string;
  sendingResetLink: string;
  resetLinkSent: string;
  resetLinkSentDescription: string;
  backToLogin: string;
  newPasswordTitle: string;
  newPasswordDescription: string;
  newPassword: string;
  confirmNewPassword: string;
  updatePassword: string;
  updatingPassword: string;
  passwordUpdated: string;
  passwordUpdatedDescription: string;
  passwordsDoNotMatch: string;
  passwordTooShort: string;

  // Reviews
  reviewsTitle: string;
  reviews: string;
  writeReview: string;
  yourRating: string;
  yourComment: string;
  shareYourExperience: string;
  submitReview: string;
  submitting: string;
  reviewSubmitted: string;
  loginToReview: string;
  noReviews: string;
  errorLoadingReviews: string;
  errorSubmittingReview: string;
  errorDeletingReview: string;
  pleaseSelectRating: string;
  pleaseWriteComment: string;
  backToHome: string;
  loading: string;

  // Password visibility
  show: string;
  hide: string;

  // Donation Page
  donationTitle: string;
  donationSubtitle: string;
  supportProject: string;
  selectAmount: string;
  customAmount: string;
  enterCustomAmount: string;
  optionalMessage: string;
  shareYourMessage: string;
  proceedDonation: string;
  processing: string;
  aCoffee: string;
  supportTheProject: string;
  generous: string;
  thankYouMuch: string;
  superGenerous: string;
  youAreAmazing: string;
  ultraGenerous: string;
  wowThankYou: string;
  donationError: string;
  pleaseSelectAmount: string;
  invalidAmount: string;

  // Notes Page
  startWriting: string;

  // Contact Page
  contactTitle: string;
  contactSubtitle: string;
  getInTouch: string;
  contactDescription: string;
  sendEmail: string;
  responseTime: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendMessage: string;
  sending: string;
  fillAllFields: string;
  emailClientOpened: string;
  from: string;
  emailSentSuccess: string;
  emailSendError: string;
  messageSaved: string;
}

const translations: Record<Language, Translation> = {
  fr: {
    // Header
    features: "Fonctionnalités",
    donations: "Dons",
    about: "À propos",
    login: "Se connecter",
    signup: "S'inscrire",

    // Hero Section
    heroTitle: "L'écriture pure,",
    heroSubtitle: "sans distraction",
    heroDescription:
      "Créez, organisez et partagez vos notes avec l'éditeur le plus intuitif. Expérience minimaliste, fonctionnalités puissantes.",
    startFree: "➤ Commencer",
    watchDemo: "Voir en action",
    cleanInterface: "Interface épurée",
    realtimeSync: "Synchronisation temps réel",
    secureSharing: "Partage sécurisé",
    writingInProgress: "Écriture en cours...",
    synchronized: "Synchronisé",

    // Features Section
    featuresTitle: "Tout ce dont vous avez besoin pour écrire",
    featuresSubtitle: "Des outils puissants dans une interface épurée",
    powerfulEditor: "Éditeur puissant",
    powerfulEditorDesc:
      "Markdown, raccourcis clavier, et outils d'édition avancés pour une écriture fluide.",
    totalSecurity: "Sécurité totale",
    totalSecurityDesc:
      "Vos données sont chiffrées de bout en bout. Nous ne pouvons pas lire vos notes.",
    smartSharing: "Partage intelligent",
    smartSharingDesc:
      "Partagez vos notes avec un lien, ou collaborez en temps réel avec votre équipe.",
    synchronization: "Synchronisation",
    synchronizationDesc:
      "Accédez à vos notes partout, sur tous vos appareils. Sync automatique.",
    advancedSearch: "Recherche avancée",
    advancedSearchDesc:
      "Trouvez n'importe quelle note instantanément avec notre moteur de recherche rapide.",
    fullHistory: "Historique complet",
    fullHistoryDesc:
      "Chaque modification est sauvegardée. Revenez à n'importe quelle version antérieure.",

    // Community Section
    communityTitle: "Rejoignez notre communauté",
    newPlatform: "Nouvelle plateforme",
    innovative: "Innovante",
    secure: "Sécurisée",
    securePrivate: "Sécurisée et privée",
    support: "Support",
    dedicatedSupport: "Support dédié",
    communityDescription:
      "Des milliers d'écrivains, étudiants et professionnels font confiance à Pure Note pour leurs notes quotidiennes.",
    authenticReviews: "Avis authentiques de nos utilisateurs",
    gdprCompliant: "Conforme RGPD",
    sslEncryption: "Chiffrement SSL",
    euHosting: "Hébergé en UE",

    // Footer
    footerDescription:
      "L'outil parfait pour capturer vos idées et les transformer en réalité.",
    product: "Produit",
    changelog: "Nouveautés",
    roadmap: "Feuille de route",
    supportSection: "Support",
    documentation: "Documentation",
    userGuide: "Guide utilisateur",
    contact: "Contact",
    status: "État du service",
    legal: "Légal",
    privacy: "Confidentialité",
    terms: "Conditions",
    rgpd: "RGPD",
    cookies: "Cookies",
    allRightsReserved: "Tous droits réservés",
    respectPrivacy: "Nous respectons votre vie privée",
    cookieMessage: "Nous utilisons des cookies pour améliorer votre expérience",

    // File name
    newNoteFilename: "ma-note-pure",

    // Auth
    loginTitle: "Connexion",
    signupTitle: "Créer un compte",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    signin: "Se connecter",
    signup: "Créer un compte",
    noAccount: "Pas encore de compte ?",
    hasAccount: "Vous avez déjà un compte ?",
    signingIn: "Connexion en cours...",
    signingUp: "Création du compte...",
    successMessage: "Bienvenue sur Pure Note !",
    rememberMe: "Se souvenir de moi",
    back: "Retour",

    // Profile
    profileTitle: "Profil",
    myProfile: "Mon Profil",
    accountInfo: "Informations du compte",
    signOut: "Se déconnecter",
    signingOut: "Déconnexion...",
    editProfile: "Modifier le profil",
    saveChanges: "Enregistrer",
    cancel: "Annuler",
    updateSuccess: "Profil mis à jour avec succès",
    memberSince: "Membre depuis",

    // Password Reset
    forgotPassword: "Mot de passe oublié ?",
    resetPasswordTitle: "Réinitialiser le mot de passe",
    resetPasswordDescription:
      "Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    sendResetLink: "Envoyer le lien",
    sendingResetLink: "Envoi en cours...",
    resetLinkSent: "Lien envoyé !",
    resetLinkSentDescription:
      "Vérifiez votre boîte de réception pour le lien de réinitialisation.",
    backToLogin: "Retour à la connexion",
    newPasswordTitle: "Nouveau mot de passe",
    newPasswordDescription: "Entrez votre nouveau mot de passe ci-dessous.",
    newPassword: "Nouveau mot de passe",
    confirmNewPassword: "Confirmer le mot de passe",
    updatePassword: "Mettre à jour",
    updatingPassword: "Mise à jour...",
    passwordUpdated: "Mot de passe mis à jour !",
    passwordUpdatedDescription:
      "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",

    // Reviews
    reviewsTitle: "Avis de la communauté",
    reviews: "Avis",
    writeReview: "Écrire un avis",
    yourRating: "Votre note",
    yourComment: "Votre commentaire",
    shareYourExperience: "Partagez votre expérience avec Pure Note...",
    submitReview: "Publier",
    submitting: "Publication...",
    reviewSubmitted: "Merci pour votre avis !",
    loginToReview: "Veuillez vous connecter pour écrire un avis",
    noReviews:
      "Aucun avis pour le moment. Soyez le premier à donner votre avis !",
    errorLoadingReviews: "Erreur lors du chargement des avis",
    errorSubmittingReview: "Erreur lors de la publication de l'avis",
    errorDeletingReview: "Erreur lors de la suppression de l'avis",
    pleaseSelectRating: "Veuillez sélectionner une note",
    pleaseWriteComment: "Veuillez écrire un commentaire",
    backToHome: "Retour à l'accueil",
    loading: "Chargement...",

    // Password visibility
    show: "afficher",
    hide: "masquer",

    // Donation Page
    donationTitle: "Soutenez Pure Note",
    donationSubtitle:
      "Votre contribution nous aide à maintenir Pure Note gratuit et sans publicité pour tout le monde",
    supportProject: "Soutenir le projet",
    selectAmount: "Sélectionner un montant",
    customAmount: "Montant personnalisé",
    enterCustomAmount: "Entrez un montant...",
    optionalMessage: "Message optionnel",
    shareYourMessage: "Partagez votre message avec nous...",
    proceedDonation: "Procéder au don",
    processing: "Traitement en cours...",
    aCoffee: "Un café",
    supportTheProject: "Soutenir le projet",
    generous: "Généreux",
    thankYouMuch: "Merci beaucoup !",
    superGenerous: "Super généreux",
    youAreAmazing: "Vous êtes incroyable !",
    ultraGenerous: "Ultra généreux",
    wowThankYou: "Wow, merci infiniment !",
    donationError: "Erreur lors du traitement du don",
    pleaseSelectAmount: "Veuillez sélectionner ou entrer un montant",
    invalidAmount: "Montant invalide",

    // Notes Page
    startWriting: "Commencez à écrire...",

    // Contact Page
    contactTitle: "Contactez-nous",
    contactSubtitle:
      "Une question, une suggestion ou besoin d'aide ? Nous sommes là pour vous écouter.",
    getInTouch: "Prenez contact",
    contactDescription:
      "Envoyez-nous un email et nous vous répondrons dans les plus brefs délais.",
    sendEmail: "Envoyer un email",
    responseTime: "Nous répondons généralement sous 24-48 heures",
    nameLabel: "Nom",
    namePlaceholder: "Votre nom",
    emailLabel: "Email",
    emailPlaceholder: "votre@email.com",
    subjectLabel: "Objet",
    subjectPlaceholder: "De quoi s'agit-il ?",
    messageLabel: "Message",
    messagePlaceholder: "Votre message ici...",
    sendMessage: "Envoyer le message",
    sending: "Envoi en cours...",
    fillAllFields: "Veuillez remplir tous les champs",
    emailClientOpened: "Client email ouvert avec succès",
    from: "De",
    emailSentSuccess: "Email envoyé avec succès !",
    emailSendError: "Erreur lors de l'envoi de l'email",
    messageSaved: "Message enregistré ! Nous vous contacterons bientôt.",
  },
  en: {
    // Header
    features: "Features",
    donations: "Donations",
    about: "About",
    login: "Sign in",
    signup: "Sign up",

    // Hero Section
    heroTitle: "Pure writing,",
    heroSubtitle: "without distraction",
    heroDescription:
      "Create, organize, and share your notes with the most intuitive editor. Minimalist experience, powerful features.",
    startFree: "➤ Get Started",
    watchDemo: "See it in action",
    cleanInterface: "Clean interface",
    realtimeSync: "Real-time sync",
    secureSharing: "Secure sharing",
    writingInProgress: "Writing in progress...",
    synchronized: "Synchronized",

    // Features Section
    featuresTitle: "Everything you need to write",
    featuresSubtitle: "Powerful tools in a clean interface",
    powerfulEditor: "Powerful editor",
    powerfulEditorDesc:
      "Markdown, keyboard shortcuts, and advanced editing tools for smooth writing.",
    totalSecurity: "Total security",
    totalSecurityDesc:
      "Your data is end-to-end encrypted. We cannot read your notes.",
    smartSharing: "Smart sharing",
    smartSharingDesc:
      "Share your notes with a link, or collaborate in real-time with your team.",
    synchronization: "Synchronization",
    synchronizationDesc:
      "Access your notes anywhere, on all your devices. Automatic sync.",
    advancedSearch: "Advanced search",
    advancedSearchDesc:
      "Find any note instantly with our fast search engine.",
    fullHistory: "Full history",
    fullHistoryDesc:
      "Every change is saved. Go back to any previous version.",

    // Community Section
    communityTitle: "Join our community",
    newPlatform: "New platform",
    innovative: "Innovative",
    secure: "Secure",
    securePrivate: "Secure and private",
    support: "Support",
    dedicatedSupport: "Dedicated support",
    communityDescription:
      "Thousands of writers, students, and professionals trust Pure Note for their daily notes.",
    authenticReviews: "Authentic reviews from our users",
    gdprCompliant: "GDPR Compliant",
    sslEncryption: "SSL Encryption",
    euHosting: "EU Hosting",

    // Footer
    footerDescription:
      "The perfect tool to capture your ideas and turn them into reality.",
    product: "Product",
    changelog: "Changelog",
    roadmap: "Roadmap",
    supportSection: "Support",
    documentation: "Documentation",
    userGuide: "User Guide",
    contact: "Contact",
    status: "Status",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    rgpd: "GDPR",
    cookies: "Cookies",
    allRightsReserved: "All rights reserved",
    respectPrivacy: "We respect your privacy",
    cookieMessage: "We use cookies to enhance your experience",

    // File name
    newNoteFilename: "my-pure-note",

    // Auth
    loginTitle: "Sign in",
    signupTitle: "Create account",
    name: "Name",
    email: "Email",
    password: "Password",
    signin: "Sign in",
    signup: "Create account",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signingIn: "Signing in...",
    signingUp: "Creating account...",
    successMessage: "Welcome to Pure Note!",
    rememberMe: "Remember me",
    back: "Back",

    // Profile
    profileTitle: "Profile",
    myProfile: "My Profile",
    accountInfo: "Account information",
    signOut: "Sign out",
    signingOut: "Signing out...",
    editProfile: "Edit profile",
    saveChanges: "Save changes",
    cancel: "Cancel",
    updateSuccess: "Profile updated successfully",
    memberSince: "Member since",

    // Password Reset
    forgotPassword: "Forgot password?",
    resetPasswordTitle: "Reset password",
    resetPasswordDescription:
      "Enter your email address and we'll send you a link to reset your password.",
    sendResetLink: "Send reset link",
    sendingResetLink: "Sending...",
    resetLinkSent: "Link sent!",
    resetLinkSentDescription: "Check your inbox for the reset link.",
    backToLogin: "Back to login",
    newPasswordTitle: "New password",
    newPasswordDescription: "Enter your new password below.",
    newPassword: "New password",
    confirmNewPassword: "Confirm password",
    updatePassword: "Update password",
    updatingPassword: "Updating...",
    passwordUpdated: "Password updated!",
    passwordUpdatedDescription:
      "Your password has been successfully updated. You can now sign in.",
    passwordsDoNotMatch: "Passwords do not match",
    passwordTooShort: "Password must be at least 6 characters",

    // Reviews
    reviewsTitle: "Community Reviews",
    reviews: "Reviews",
    writeReview: "Write a review",
    yourRating: "Your rating",
    yourComment: "Your comment",
    shareYourExperience: "Share your experience with Pure Note...",
    submitReview: "Submit",
    submitting: "Submitting...",
    reviewSubmitted: "Thank you for your review!",
    loginToReview: "Please sign in to write a review",
    noReviews: "No reviews yet. Be the first to share your thoughts!",
    errorLoadingReviews: "Error loading reviews",
    errorSubmittingReview: "Error submitting review",
    errorDeletingReview: "Error deleting review",
    pleaseSelectRating: "Please select a rating",
    pleaseWriteComment: "Please write a comment",
    backToHome: "Back to home",
    loading: "Loading...",

    // Password visibility
    show: "show",
    hide: "hide",

    // Donation Page
    donationTitle: "Support Pure Note",
    donationSubtitle:
      "Your contribution helps us keep Pure Note free and ad-free for everyone",
    supportProject: "Support the project",
    selectAmount: "Select an amount",
    customAmount: "Custom amount",
    enterCustomAmount: "Enter amount...",
    optionalMessage: "Optional message",
    shareYourMessage: "Share your message with us...",
    proceedDonation: "Proceed to donation",
    processing: "Processing...",
    aCoffee: "A coffee",
    supportTheProject: "Support the project",
    generous: "Generous",
    thankYouMuch: "Thank you so much!",
    superGenerous: "Super generous",
    youAreAmazing: "You are amazing!",
    ultraGenerous: "Ultra generous",
    wowThankYou: "Wow, thank you so much!",
    donationError: "Error processing donation",
    pleaseSelectAmount: "Please select or enter an amount",
    invalidAmount: "Invalid amount",

    // Notes Page
    startWriting: "Start writing...",

    // Contact Page
    contactTitle: "Contact Us",
    contactSubtitle:
      "Have a question, suggestion, or need help? We're here to listen.",
    getInTouch: "Get in touch",
    contactDescription:
      "Send us an email and we'll get back to you as soon as possible.",
    sendEmail: "Send an email",
    responseTime: "We typically respond within 24-48 hours",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    subjectLabel: "Subject",
    subjectPlaceholder: "Enter the subject of your message",
    messageLabel: "Message",
    messagePlaceholder: "Enter your message",
    sendMessage: "Send",
    sending: "Sending...",
    fillAllFields: "Please fill all fields",
    emailClientOpened: "Your email client has been opened",
    from: "From",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
  theme: Theme;
  toggleTheme: () => void;
  scrollToTop: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "fr";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        theme,
        toggleTheme,
        scrollToTop,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}