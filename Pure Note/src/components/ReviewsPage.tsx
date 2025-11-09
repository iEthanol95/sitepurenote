import { useState, useEffect } from "react";
import { ArrowLeft, Star, Trash2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useLanguage } from "./LanguageContext";
import { useSimpleAuth } from "./SimpleAuthContext";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsPageProps {
  onBackToHome: () => void;
  onShowLogin: () => void;
}

export function ReviewsPage({ onBackToHome, onShowLogin }: ReviewsPageProps) {
  const { t } = useLanguage();
  const { user, accessToken } = useSimpleAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/reviews`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Error fetching reviews:", err);
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(t.errorLoadingReviews || "Failed to load reviews");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !accessToken) {
      onShowLogin();
      return;
    }

    if (rating === 0) {
      setError(t.pleaseSelectRating || "Please select a rating");
      return;
    }

    if (comment.trim().length === 0) {
      setError(t.pleaseWriteComment || "Please write a comment");
      return;
    }

    setSubmitting(true);
    setError("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            rating,
            comment: comment.trim(),
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setRating(0);
      setComment("");
      await fetchReviews();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Error submitting review:", err);
      if (err.name !== 'AbortError') {
        setError(err.message || t.errorSubmittingReview || "Failed to submit review");
      } else {
        setError(t.language === "fr" ? "La requête a expiré" : "Request timed out");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!accessToken) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-837fe92e/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      await fetchReviews();
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Error deleting review:", err);
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(t.errorDeletingReview || "Failed to delete review");
      }
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (interactive ? (hoverRating || rating) : count)
                  ? "fill-black dark:fill-white text-black dark:text-white"
                  : "text-black dark:text-white"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <motion.button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-black dark:text-white hover:opacity-70 transition-opacity"
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.backToHome || "Back to home"}</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title and Stats */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-normal text-black dark:text-white mb-4">
            {t.reviewsTitle || "Reviews"}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(Number(getAverageRating())))}
              <span className="text-2xl text-black dark:text-white ml-2">
                {getAverageRating()}
              </span>
            </div>
            <span className="text-black dark:text-white">
              ({reviews.length} {t.reviews || "reviews"})
            </span>
          </div>
        </motion.div>

        {/* Review Form */}
        {user ? (
          <motion.div
            className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl p-8 mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl text-black dark:text-white mb-6">
              {t.writeReview || "Write a review"}
            </h2>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-black dark:text-white mb-3">
                  {t.yourRating || "Your rating"}
                </label>
                {renderStars(rating, true)}
              </div>

              <div>
                <label className="block text-black dark:text-white mb-3">
                  {t.yourComment || "Your comment"}
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.shareYourExperience || "Share your experience..."}
                  className="min-h-[120px] bg-white dark:bg-black border-black dark:border-white text-black dark:text-white"
                  disabled={submitting}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.p>
                )}

                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-600 dark:text-green-400"
                  >
                    {t.reviewSubmitted || "Review submitted successfully!"}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white w-full"
              >
                {submitting ? (
                  t.submitting || "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.submitReview || "Submit review"}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl p-8 mb-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-black dark:text-white mb-4">
              {t.loginToReview || "Please log in to write a review"}
            </p>
            <Button
              onClick={onShowLogin}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-white"
            >
              {t.login || "Log in"}
            </Button>
          </motion.div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-black dark:text-white">
                {t.loading || "Loading..."}
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-black dark:text-white">
                {t.noReviews || "No reviews yet. Be the first to review!"}
              </p>
            </motion.div>
          ) : (
            reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="bg-white dark:bg-black border border-black dark:border-white rounded-2xl p-6"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-black dark:text-white mb-1">
                      {review.userName}
                    </h3>
                    <p className="text-sm text-black dark:text-white opacity-60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {renderStars(review.rating)}
                    {user && user.id === review.userId && (
                      <motion.button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 dark:text-red-400 hover:opacity-70"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
                <p className="text-black dark:text-white leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
