import { Switch, Match } from "solid-js";
import { currentPath } from "./components/router";
import LandingPage from "./pages/LandingPage";
import ReviewsPage from "./pages/ReviewsPage";
import AppealPage from "./pages/AppealPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Switch fallback={<div class="min-h-screen bg-background text-foreground flex items-center justify-center font-mono">404 - Page Not Found</div>}>
      <Match when={currentPath() === "/"}>
        <LandingPage />
      </Match>
      <Match when={currentPath() === "/reviews" || currentPath() === "/review"}>
        <ReviewsPage />
      </Match>
      <Match when={currentPath() === "/appeal"}>
        <AppealPage />
      </Match>
      <Match when={currentPath() === "/internal/staff/admin"}>
        <AdminPage />
      </Match>
    </Switch>
  );
}

export default App;
