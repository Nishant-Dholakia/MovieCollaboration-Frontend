import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import GroupsListPage from "./pages/groups/GroupList";
import CreateGroupPage from "./pages/groups/CreateGroup";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>

            {/* Public */}
            <Route path="/" element={<Home />} />

            {/* Protected */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="profile/" element={<Profile />} />
              <Route path="groups/">
                <Route path="" element={<GroupsListPage />} />
                <Route path="create/" element={<CreateGroupPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
