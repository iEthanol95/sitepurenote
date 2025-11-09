import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import Stripe from "npm:stripe@17.4.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for server operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// Initialize Stripe
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
console.log("Initializing server...");
console.log("Stripe key configured:", stripeKey ? "Yes (length: " + stripeKey.length + ")" : "No");

const stripe = new Stripe(stripeKey, {
  apiVersion: '2024-12-18.acacia',
});

// Enable CORS first (before logger)
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Enable logger
app.use('*', logger(console.log));

// Health check endpoint
app.get("/make-server-837fe92e/health", (c) => {
  const stripeConfigured = !!(Deno.env.get('STRIPE_SECRET_KEY'));
  return c.json({ 
    status: "ok",
    stripe: stripeConfigured ? "configured" : "not configured",
    timestamp: new Date().toISOString()
  });
});

// User signin endpoint
app.post("/make-server-837fe92e/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log(`Signin error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User ${email} signed in successfully`);
    return c.json({ 
      success: true, 
      access_token: data.session?.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });
  } catch (error) {
    console.log(`Signin error: ${error}`);
    return c.json({ error: "Internal server error during signin" }, 500);
  }
});

// User signup endpoint
app.post("/make-server-837fe92e/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User ${email} created successfully`);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Protected route example - verify user token
app.get("/make-server-837fe92e/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name
      }
    });
  } catch (error) {
    console.log(`Profile error: ${error}`);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all reviews
app.get("/make-server-837fe92e/reviews", async (c) => {
  try {
    const reviews = await kv.getByPrefix("review:");
    
    // Sort by createdAt descending
    const sortedReviews = reviews.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ reviews: sortedReviews });
  } catch (error) {
    console.log(`Error fetching reviews: ${error}`);
    return c.json({ error: "Failed to fetch reviews" }, 500);
  }
});

// Create a new review (protected)
app.post("/make-server-837fe92e/reviews", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    const { rating, comment } = await c.req.json();

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: "Rating must be between 1 and 5" }, 400);
    }

    if (!comment || comment.trim().length === 0) {
      return c.json({ error: "Comment is required" }, 400);
    }

    const reviewId = `review:${Date.now()}_${user.id}`;
    const review = {
      id: reviewId,
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      userEmail: user.email,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    await kv.set(reviewId, review);
    
    console.log(`Review created by ${user.email}`);
    return c.json({ success: true, review });
  } catch (error) {
    console.log(`Error creating review: ${error}`);
    return c.json({ error: "Failed to create review" }, 500);
  }
});

// Delete a review (protected - only owner can delete)
app.delete("/make-server-837fe92e/reviews/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    const reviewId = c.req.param('id');
    const review = await kv.get(reviewId);

    if (!review) {
      return c.json({ error: "Review not found" }, 404);
    }

    if (review.userId !== user.id) {
      return c.json({ error: "You can only delete your own reviews" }, 403);
    }

    await kv.del(reviewId);
    
    console.log(`Review ${reviewId} deleted by ${user.email}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting review: ${error}`);
    return c.json({ error: "Failed to delete review" }, 500);
  }
});

// Get user's plan
app.get("/make-server-837fe92e/user-plan", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ plan: "free" });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ plan: "free" });
    }

    const planKey = `user_plan:${user.id}`;
    const planData = await kv.get(planKey);
    
    return c.json({ plan: planData?.plan || "free" });
  } catch (error) {
    console.log(`Error fetching user plan: ${error}`);
    return c.json({ plan: "free" });
  }
});

// Update user's plan
app.post("/make-server-837fe92e/update-plan", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Authorization token required" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    const { plan } = await c.req.json();
    
    if (!plan || !['free', 'pro', 'team'].includes(plan)) {
      return c.json({ error: "Invalid plan" }, 400);
    }

    const planKey = `user_plan:${user.id}`;
    await kv.set(planKey, { 
      plan, 
      userId: user.id,
      updatedAt: new Date().toISOString() 
    });
    
    console.log(`User ${user.email} updated plan to ${plan}`);
    return c.json({ success: true, plan });
  } catch (error) {
    console.log(`Error updating user plan: ${error}`);
    return c.json({ error: "Failed to update plan" }, 500);
  }
});

// Create Stripe Checkout session for donations
app.post("/make-server-837fe92e/create-checkout", async (c) => {
  try {
    console.log("=== Received create-checkout request ===");
    
    // Check if Stripe is configured
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey || stripeKey === '') {
      console.log("ERROR: STRIPE_SECRET_KEY is not configured");
      return c.json({ error: "Stripe is not configured. Please add your STRIPE_SECRET_KEY." }, 500);
    }
    
    console.log("Stripe key configured, length:", stripeKey.length);
    
    const { amount, donorMessage, userEmail } = await c.req.json();
    console.log(`Processing donation: amount=${amount}, email=${userEmail}, message=${donorMessage?.substring(0, 50)}`);

    if (!amount || amount < 1) {
      return c.json({ error: "Invalid donation amount" }, 400);
    }

    // Convert euros to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Create Stripe Checkout session
    console.log("Creating Stripe checkout session with params:", {
      currency: 'eur',
      amount: amountInCents,
      origin: c.req.header('origin')
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Don à Pure Note',
              description: donorMessage || 'Soutien au projet Pure Note',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${c.req.header('origin') || 'https://purenote.app'}?donation=success`,
      cancel_url: `${c.req.header('origin') || 'https://purenote.app'}?donation=cancelled`,
      customer_email: userEmail || undefined,
      metadata: {
        type: 'donation',
        message: donorMessage || '',
      },
    });

    console.log(`✓ Stripe session created successfully: ${session.id}`);
    console.log(`✓ Checkout URL: ${session.url}`);

    // Store donation info in KV store
    const donationId = `donation:${session.id}`;
    await kv.set(donationId, {
      sessionId: session.id,
      amount: amount,
      message: donorMessage,
      email: userEmail,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    console.log(`✓ Donation saved to KV store: ${donationId}`);
    console.log(`=== Sending response with URL ===`);
    
    return c.json({ url: session.url });
  } catch (error) {
    console.error(`!!! ERROR creating Stripe checkout session !!!`);
    console.error(`Error type: ${error?.constructor?.name}`);
    console.error(`Error message: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`Error stack: ${error instanceof Error ? error.stack : 'N/A'}`);
    
    // Return more detailed error info
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error && error.stack 
      ? error.stack.split('\n').slice(0, 3).join('\n') 
      : String(error);
    
    return c.json({ 
      error: "Failed to create checkout session", 
      details: errorMessage,
      debugInfo: errorDetails
    }, 500);
  }
});

// Stripe webhook endpoint for handling payment events
app.post("/make-server-837fe92e/stripe-webhook", async (c) => {
  try {
    const sig = c.req.header('stripe-signature');
    const body = await c.req.text();

    if (!sig) {
      return c.json({ error: "Missing stripe-signature header" }, 400);
    }

    // In production, you should verify the webhook signature
    // const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    
    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Update donation status
      const donationId = `donation:${session.id}`;
      const donation = await kv.get(donationId);
      
      if (donation) {
        await kv.set(donationId, {
          ...donation,
          status: 'completed',
          completedAt: new Date().toISOString(),
        });
        
        console.log(`Donation ${session.id} completed successfully`);
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.log(`Webhook error: ${error}`);
    return c.json({ error: "Webhook handler failed" }, 400);
  }
});

// Send contact email endpoint
app.post("/make-server-837fe92e/send-contact-email", async (c) => {
  try {
    console.log("=== Received send-contact-email request ===");
    
    const { name, email, subject, message } = await c.req.json();
    console.log(`Contact form submission from: ${name} (${email})`);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Check if Resend API key is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.log("ERROR: RESEND_API_KEY is not configured");
      return c.json({ 
        error: "Email service is not configured. Please add your RESEND_API_KEY.",
        fallback: true 
      }, 500);
    }

    console.log("Resend API key configured, length:", resendApiKey.length);
    console.log("Resend API key starts with:", resendApiKey.substring(0, 5));
    console.log("Sending email...");

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pure Note <onboarding@resend.dev>',
        to: ['purenote.contact@gmail.com'],
        reply_to: email,
        subject: `[Pure Note Contact] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">Nouveau message de contact</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Sujet:</strong> ${subject}</p>
            </div>
            <div style="background: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h3 style="color: #000; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Cet email a été envoyé depuis le formulaire de contact de Pure Note.
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error response:', response.status, data);
      
      // Provide more specific error messages
      let errorMessage = data.message || "Unknown error from email service";
      
      if (response.status === 403) {
        errorMessage = "Email service authentication failed. Please check your API key.";
      } else if (response.status === 422) {
        errorMessage = `Invalid email data: ${data.message || "Please check the email addresses"}`;
      }
      
      return c.json({ 
        error: "Failed to send email",
        details: errorMessage,
        statusCode: response.status
      }, response.status);
    }

    console.log(`✓ Email sent successfully: ${data.id}`);

    // Store contact message in KV store for records
    const contactId = `contact:${Date.now()}`;
    await kv.set(contactId, {
      name,
      email,
      subject,
      message,
      emailId: data.id,
      createdAt: new Date().toISOString(),
    });

    console.log(`✓ Contact message saved to KV store: ${contactId}`);
    
    return c.json({ 
      success: true,
      message: "Email sent successfully" 
    });
  } catch (error) {
    console.error(`!!! ERROR sending contact email !!!`);
    console.error(`Error message: ${error instanceof Error ? error.message : String(error)}`);
    console.error(`Error stack: ${error instanceof Error ? error.stack : 'N/A'}`);
    
    return c.json({ 
      error: "Failed to send email",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Save contact message (simplified version without email sending)
app.post("/make-server-837fe92e/save-contact-message", async (c) => {
  try {
    console.log("=== Received save-contact-message request ===");
    
    const { name, email, subject, message } = await c.req.json();
    console.log(`Saving contact form submission from: ${name} (${email})`);

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    // Store contact message in KV store
    const contactId = `contact:${Date.now()}`;
    await kv.set(contactId, {
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });

    console.log(`✓ Contact message saved to KV store: ${contactId}`);
    
    return c.json({ 
      success: true,
      message: "Message saved successfully",
      contactId 
    });
  } catch (error) {
    console.error(`!!! ERROR saving contact message !!!`);
    console.error(`Error message: ${error instanceof Error ? error.message : String(error)}`);
    
    return c.json({ 
      error: "Failed to save message",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

Deno.serve(app.fetch);