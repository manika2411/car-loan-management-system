import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Applications from "./pages/Applications";
import MyApplications from "./pages/MyApplications";
import Signup from "./pages/Signup";
import Documents from "./pages/Documents";
import ApplyLoan from "./pages/ApplyLoan";
import LoanAccount from "./pages/LoanAccount";
import EmiSchedule from "./pages/EmiSchedule";
import Users from "./pages/Users";
import Vehicles from "./pages/Vehicle";
import LoanAccounts from "./pages/LoanAccounts";
import KycReview from "./pages/KycReview";
import VerifyOtp from "./pages/VerifyOtp";
import LoanStatement from "./pages/LoanStatement";
import Payments from "./pages/Payments";
import AddLead from "./pages/AddLead";

function App() {
  const token = localStorage.getItem("token");

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />}/>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/leads" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_SALES_AGENT","ROLE_LOAN_OFFICER"]}><Leads /></ProtectedRoute>}/>
          <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>}/>
          <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>}/>
          <Route path="/apply-loan" element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]}><ApplyLoan /></ProtectedRoute>}/>
          <Route path="/loan-account" element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]}><LoanAccount /></ProtectedRoute>}/>
          <Route path="/emi-schedule" element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]}><EmiSchedule /></ProtectedRoute>}/>
          <Route path="/users" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><Users /></ProtectedRoute>}/>
          <Route path="/vehicles" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]}><Vehicles /></ProtectedRoute>}/>
          <Route path="/loan-accounts" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_LOAN_OFFICER"]}><LoanAccounts /></ProtectedRoute>}/>
          <Route path="/kyc-review" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_LOAN_OFFICER",]}><KycReview /></ProtectedRoute>}/>
          <Route path="/loan-statement/:loanAccountId" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_LOAN_OFFICER",]}><LoanStatement /></ProtectedRoute>}/>
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/payments" element={<ProtectedRoute allowedRoles={["ROLE_CUSTOMER"]}><Payments /></ProtectedRoute>}/>
          <Route path="/add-lead" element={<ProtectedRoute allowedRoles={["ROLE_ADMIN","ROLE_SALES_AGENT"]}><AddLead /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;