import AppNav from "./AppNavigation/AppNav";
import { AuthProvider } from "./contexts/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppNav />
      </PaperProvider>
    </AuthProvider>
  );
}
