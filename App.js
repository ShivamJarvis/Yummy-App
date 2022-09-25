import AppNav from "./AppNavigation/AppNav";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  

  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
