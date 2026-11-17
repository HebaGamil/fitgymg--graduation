
import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DetailsPage from "./pages/DetailsPage";
import PlanPage from "./pages/PlanPage";

export default function App() {
  const [page, setPage] = useState("landing");
  const [profile, setProfile] = useState(null);

  const go = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  switch (page) {
    case "login":
      return <LoginPage go={go} />;

    case "signup":
      return <SignupPage go={go} />;

    case "details":
      return (
        <DetailsPage
          go={go}
          onSubmit={setProfile}
        />
      );

    case "plan":
      return (
        <PlanPage
          go={go}
          profile={profile}
        />
      );

    default:
      return <LandingPage go={go} />;
  }
}
