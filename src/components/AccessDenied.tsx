import { useAuth } from "../hooks/useAuth";

export function AccessDenied() {
  const { user, signOut } = useAuth();

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-baby-name">Averlyn</div>
        <div className="access-denied-message">
          {"\u62B1\u6B49\uFF0C\u60A8\u6C92\u6709\u5B58\u53D6\u6B0A\u9650"}
        </div>
        {user?.email && (
          <div className="access-denied-email">{user.email}</div>
        )}
        <button className="login-google-btn" onClick={signOut}>
          {"\u767B\u51FA"}
        </button>
      </div>
    </div>
  );
}
