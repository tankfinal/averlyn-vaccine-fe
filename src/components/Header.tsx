import { useBaby } from "../hooks/useBaby";
import { useAuth } from "../hooks/useAuth";
import { formatAge, formatDate } from "../utils/date";

export function Header() {
  const { data: baby } = useBaby();
  const { user, signOut } = useAuth();

  const birthDate = baby ? new Date(baby.birth_date) : null;

  return (
    <header className="header">
      {user && (
        <div className="user-menu">
          {user.user_metadata?.avatar_url && (
            <img
              className="user-avatar"
              src={user.user_metadata.avatar_url as string}
              alt="avatar"
            />
          )}
          <button className="user-logout-btn" onClick={signOut}>
            {"\u767B\u51FA"}
          </button>
        </div>
      )}
      <div className="baby-name">{baby?.name ?? "Averlyn"}</div>
      <div className="baby-subtitle">Vaccine Tracker</div>
      {birthDate && (
        <div className="baby-info">
          <span className="info-pill">
            <span className="info-icon">{"\uD83D\uDCC5"}</span>
            {formatDate(baby!.birth_date)}
          </span>
          <span className="info-pill">
            <span className="info-icon">{"\uD83D\uDC76"}</span>
            <span id="ageDisplay">{formatAge(birthDate)}</span>
          </span>
        </div>
      )}
    </header>
  );
}
