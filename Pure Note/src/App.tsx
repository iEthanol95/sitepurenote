import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CommunitySection } from "./components/CommunitySection";
import { Footer } from "./components/Footer";
import { SimpleAuthLogin } from "./components/SimpleAuthLogin";
import { SimpleAuthSignup } from "./components/SimpleAuthSignup";
import { ProfilePage } from "./components/ProfilePage";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { ReviewsPage } from "./components/ReviewsPage";
import { DonationPage } from "./components/DonationPage";
import { NotesPage } from "./components/NotesPage";
import { ContactPage } from "./components/ContactPage";
import { MessageSentPage } from "./components/MessageSentPage";
import { LoadingScreen } from "./components/LoadingScreen";
import { LanguageProvider } from "./components/LanguageContext";
import { SimpleAuthProvider, useSimpleAuth } from "./components/SimpleAuthContext";
import { Toaster } from "./components/ui/sonner";

type Page =
  "home"
  | "login"
  | "signup"
  | "profile"
  | "forgot-password"
  | "reset-password"
  | "reviews"
  | "donations"
  | "notes"
  | "message-sent"
  | "contact";


function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { signIn, signUp } = useSimpleAuth();

  // Détecter le token de réinitialisation et les paramètres de donation dans l'URL
  useEffect(() => {
    // Check for donation success/cancel
    const urlParams = new URLSearchParams(window.location.search);
    const donationStatus = urlParams.get('donation');
    
    if (donationStatus === 'success' || donationStatus === 'cancelled') {
      // Show notification
      if (donationStatus === 'success') {
        console.log('Donation successful!');
        // Could show a success message here
      } else {
        console.log('Donation cancelled');
      }
      // Clean URL
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Check for reset token
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const type = params.get('type');
      
      if (accessToken && type === 'recovery') {
        setResetToken(accessToken);
        setCurrentPage("reset-password");
        // Nettoyer l'URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const handleShowLogin = () => setCurrentPage("login");
  const handleShowSignup = () => setCurrentPage("signup");
  const handleShowProfile = () => setCurrentPage("profile");
  const handleShowForgotPassword = () => setCurrentPage("forgot-password");
  const handleShowReviews = () => setCurrentPage("reviews");
  const handleShowDonations = () => setCurrentPage("donations");
  const handleShowNotes = () => setCurrentPage("notes");
  const handleShowContact = () => setCurrentPage("contact");
  const handleBackToHome = () => setCurrentPage("home");
  const handleSwitchToSignup = () => setCurrentPage("signup");
  const handleSwitchToLogin = () => setCurrentPage("login");
  const handleResetSuccess = () => {
      const handleShowMessageSent = () => setCurrentPage("message-sent");
    setResetToken(null);
    setCurrentPage("login");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Petite transition pour un effet plus fluide
    setTimeout(() => {
      setShowContent(true);
    }, 100);
  };

  // Afficher l'écran de chargement
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div 
      className={`min-h-screen bg-white dark:bg-black overflow-x-hidden transition-all duration-700 ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      {currentPage === "home" && (
        <>
          <Header 
            onShowLogin={handleShowLogin} 
            onShowSignup={handleShowSignup}
            onShowProfile={handleShowProfile}
            onShowDonations={handleShowDonations}
            onShowNotes={handleShowNotes}
            onShowContact={handleShowContact}
          />
          <main>
            <HeroSection onDemoClick={handleShowNotes} />
            <FeaturesSection />
            <CommunitySection onShowReviews={handleShowReviews} />
          </main>
          <Footer onShowContact={handleShowContact} />
        </>
      )}
      
      {currentPage === "login" && (
        <SimpleAuthLogin 
          onSwitchToSignup={handleSwitchToSignup}
          onBackToHome={handleBackToHome}
          onForgotPassword={handleShowForgotPassword}
          onSignIn={signIn}
        />
      )}
      
      {currentPage === "signup" && (
        <SimpleAuthSignup 
          onSwitchToLogin={handleSwitchToLogin}
          onBackToHome={handleBackToHome}
          onSignUp={signUp}
        />
      )};
      
      {currentPage === "profile" && (
        <ProfilePage 
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === "forgot-password" && (
        <ForgotPassword 
          onBackToLogin={handleSwitchToLogin}
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === "reset-password" && resetToken && (
        <ResetPassword 
          onBackToHome={handleBackToHome}
          onSuccess={handleResetSuccess}
          accessToken={resetToken}
        />
      )}
      
      {currentPage === "reviews" && (
        <ReviewsPage 
          onBackToHome={handleBackToHome}
          onShowLogin={handleShowLogin}
        />
      )}
      
      {currentPage === "donations" && (
        <DonationPage 
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === "notes" && (
        <NotesPage 
          onBackToHome={handleBackToHome}
        />
      )}
      
      {currentPage === "contact" && (
        <ContactPage 
          onBackToHome={handleBackToHome}
        />
      )}

          {currentPage === "message-sent" && (
      <MessageSentPage />
    )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SimpleAuthProvider>
        <AppContent />
        <Toaster richColors position="top-center" />
      </SimpleAuthProvider>
    </LanguageProvider>
  );
}
