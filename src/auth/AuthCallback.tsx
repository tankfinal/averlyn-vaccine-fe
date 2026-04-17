import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      // Try PKCE flow (code in query params)
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        navigate("/", { replace: true });
        return;
      }

      // Try implicit flow (tokens in hash fragment)
      // Supabase client auto-detects hash tokens via onAuthStateChange,
      // so just wait briefly for session to be picked up
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/", { replace: true });
        return;
      }

      // If neither, wait for onAuthStateChange to fire
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe();
            navigate("/", { replace: true });
          }
        }
      );

      // Timeout fallback — redirect after 5s regardless
      setTimeout(() => {
        subscription.unsubscribe();
        navigate("/", { replace: true });
      }, 5000);
    };

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Quicksand', sans-serif",
        color: "#757575",
      }}
    >
      <p>Redirecting...</p>
    </div>
  );
}
