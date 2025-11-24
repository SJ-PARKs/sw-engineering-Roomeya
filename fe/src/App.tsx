import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Survey from "./pages/Survey";
import Results from "./pages/Results";
import SurveyManagement from "./pages/SurveyManagement";
import Matching from "./pages/Matching";
import ProtectedRoute from "./components/common/ProtectedRoute";
import "./styles/common.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          <Route path="/survey/:surveyId" element={<Survey />} />
            <Route path="/survey" element={<Survey />} />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey-management"
            element={
              <ProtectedRoute>
                <SurveyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matching"
            element={
              <ProtectedRoute>
                <Matching />
              </ProtectedRoute>
            }
          />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
