import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // With detectSessionInUrl + PKCE, supabase-js automatically
    // exchanges the code when it sees ?code= in the URL.
    // We just need to wait for the session to be established.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          subscription.unsubscribe();
          navigate("/", { replace: true });
        }
      }
    );

    // Also check if session is already available (e.g. fast exchange)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        navigate("/", { replace: true });
      }
    });

    // Timeout fallback
    const timer = setTimeout(() => {
      subscription.unsubscribe();
      navigate("/", { replace: true });
    }, 5000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
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
