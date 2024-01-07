import AuthProvider from "./components/AuthProvider";
import Routes from "./components/routes";
function App() {
  return (
    <AuthProvider>
      <Routes></Routes>
    </AuthProvider>
  );
}
export default App;
