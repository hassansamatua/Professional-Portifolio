"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isComponentMounted = true;

    const handleCallback = async () => {
      try {
        // Check if we have a hash (token from email link)
        if (!window.location.hash) {
          console.warn("No token in URL hash");
          if (isComponentMounted) {
            setError("No verification token found. Please check your email link.");
            timeoutId = setTimeout(() => router.push("/auth/signup"), 2000);
          }
          return;
        }

        // Set up listener for auth state changes
        // This will catch the session creation from the token
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth event:", event, "Session:", !!session);

            if (event === "SIGNED_IN" && session) {
              console.log("Email verified successfully!");
              if (isComponentMounted) {
                setIsVerifying(false);
                // Use a small delay to ensure state updates complete
                timeoutId = setTimeout(() => {
                  router.push("/dashboard");
                }, 100);
              }
              return;
            }

            if (event === "SIGNED_OUT") {
              if (isComponentMounted) {
                setError("Session was cleared. Please try signing up again.");
                timeoutId = setTimeout(() => router.push("/auth/signup"), 2000);
              }
              return;
            }
          }
        );

        // Get current session to check if already verified
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          if (isComponentMounted) {
            setError("Failed to verify email. Please try signing up again.");
            timeoutId = setTimeout(() => router.push("/auth/signup"), 2000);
          }
          return;
        }

        if (data.session) {
          // Session already exists - verification was successful
          console.log("Session already exists, redirecting to dashboard");
          if (isComponentMounted) {
            setIsVerifying(false);
            timeoutId = setTimeout(() => {
              router.push("/dashboard");
            }, 100);
          }
          return;
        }

        // Wait for auth state change listener to catch the session
        // Set a timeout in case verification takes too long
        timeoutId = setTimeout(() => {
          if (isComponentMounted) {
            console.error("Verification timeout - no session created");
            setError("Email verification timed out. Please try again.");
            timeoutId = setTimeout(() => router.push("/auth/signup"), 2000);
          }
        }, 5000); // 5 second timeout

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Callback error:", err);
        if (isComponentMounted) {
          setError("An error occurred during verification. Please try again.");
          timeoutId = setTimeout(() => router.push("/auth/signup"), 2000);
        }
      }
    };

    handleCallback();

    return () => {
      isComponentMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02050b] via-[#050c1d] to-[#071426] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {error ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Verification Failed</h1>
              <p className="text-red-300">{error}</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Verifying...</h1>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
