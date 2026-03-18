import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import PricingPage from "./pages/PricingPage";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "login")
    return (
      <LoginPage
        onSwitch={() => setPage("signup")}
        onHome={() => setPage("home")}
      />
    );

  if (page === "signup")
    return (
      <SignupPage
        onSwitch={() => setPage("login")}
        onHome={() => setPage("home")}
      />
    );

  if (page === "profile") return <ProfilePage onHome={() => setPage("home")} />;

  if (page === "pricing")
    return (
      <PricingPage
        onHome={() => setPage("home")}
        onSignup={() => setPage("signup")}
      />
    );

  return (
    <HomePage
      onLogin={() => setPage("login")}
      onSignup={() => setPage("signup")}
      onProfile={() => setPage("profile")}
      onPricing={() => setPage("pricing")}
    />
  );
}
