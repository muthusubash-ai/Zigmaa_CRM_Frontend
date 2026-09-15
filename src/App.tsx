import { GoogleOAuthProvider } from "@react-oauth/google";

import { LoginPage } from "@/features/auth/login-page";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? "";
const googleEnabled = Boolean(
  googleClientId && !googleClientId.startsWith("your-google-web-client-id"),
);

function App() {
  const loginPage = <LoginPage googleEnabled={googleEnabled} />;

  if (!googleEnabled) {
    return loginPage;
  }

  return <GoogleOAuthProvider clientId={googleClientId}>{loginPage}</GoogleOAuthProvider>;
}

export default App;
