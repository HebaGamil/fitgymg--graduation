
import "../styles/app-layout.css";

const NAV = [
  ["plan", "Home", "⌂"],
  ["meals", "Nutrition", "♧"],
  ["exercise", "Exercise", "⚒"],
  ["progress", "Progress", "♧"],
  ["supplements", "Supplements", "⚗"],
];

export default function AppLayout({ active, go, children }) {
  return (
    <div className="app">

      <header className="nf-navigation">
        <div className="nf-nav-top">
          {NAV.slice(0, 3).map(([key, label, icon]) => (
            <button
              key={key}
              className={`nf-button ${active === key ? "selected" : ""}`}
              onClick={() => go(key)}
            >
              <span>{label}</span>
              <span>{icon}</span>
            </button>
          ))}

          <button className="nf-profile" onClick={() => go("details")}>
            ♙
          </button>
        </div>

        <div className="nf-nav-bottom">
          {NAV.slice(3).map(([key, label, icon]) => (
            <button
              key={key}
              className={`nf-button ${active === key ? "selected" : ""}`}
              onClick={() => go(key)}
            >
              <span>{label}</span>
              <span>{icon}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="main">
        {children}
      </main>

      <div className="nf-logout-area">
        <button
          className="nf-logout"
          onClick={() => go("landing")}
        >
          Log out <span>⏻</span>
        </button>
      </div>

    </div>
  );
}
