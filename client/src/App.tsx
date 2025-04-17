
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loader from "./components/Loader";
import { Calendar } from "../../client/src/components/ui/calendar";

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminVerifyOTP = lazy(() => import("./pages/AdminVerifyOTP"));
const LandlordLogin = lazy(() => import("./pages/LandlordLogin"));
const DashboardLayout = lazy(() => import("./layout/DashboardLayout"));
const RegisterLandlord = lazy(() => import("./pages/LandlordRegister"));
const LogoutLandlord = lazy(() => import("./pages/LogoutLandlord"));
const PropertyForm = lazy(() => import("./pages/Property/property"));
const PropertyTable = lazy(() => import("./pages/Property/PropertyTable"));
const Bill = lazy(() => import("./pages/bill/Bill"));
const BillTable = lazy(() => import("./pages/bill/BillTable"));
const Contract = lazy(() => import("./pages/contracts/Contract"));
const ContractTable = lazy(() => import("./pages/contracts/ContractTable"));
const Tax = lazy(() => import("./pages/tax/Tax"));
const TaxTable = lazy(() => import("./pages/tax/TaxTable"));
const Payment = lazy(() => import("./pages/payment/Payment"));
const PaymentTable = lazy(() => import("./pages/payment/PaymentTable"));
const Lease = lazy(() => import("./pages/lease/Lease"));
const LeaseTable = lazy(() => import("./pages/lease/LeaseTable"));
const Maintenance = lazy(() => import("./pages/maintenance/Maintenance"));
const MaintenanceTable = lazy(() => import("./pages/maintenance/MaintenanceTable"));
const TenantHistory = lazy(() => import("./pages/history/TenantHistory"));
const TenantHistoryDetail = lazy(() => import("./pages/history/TenantHistoryDetails"));
const TenantHistoryTable = lazy(() => import("./pages/history/TenantHistoryTable"));
const RentalAgreement = lazy(() => import("./pages/ragreement/RentalAgreement"));
const RentalAgreementTable = lazy(() => import("./pages/ragreement/RentalAgreementTable"));
const UserProtected = lazy(() => import("./components/Protected"));
const Navbar = lazy(() => import("./pages/admin/AdminNavbar"));
const Tenant = lazy(() => import("./pages/tenant/Tenant"));
const TenantTable = lazy(() => import("./pages/tenant/TenantTable"));
const AdminProtected = lazy(() => import("./pages/admin/AdminProtected"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogout = lazy(() => import("./pages/AdminLogout"));
const LandlordProtected = lazy(() => import("./pages/landlord/LandlordProtected"));
const LandlordLayout = lazy(() => import("./pages/landlord/LandlordLayout"));
const LandlordDashboard = lazy(() => import("./pages/landlord/LandlordDashboard"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RezorPayment = lazy(() => import("./pages/rezorpay/RezorPayment"));
const RezorPaymentTable = lazy(() => import("./pages/rezorpay/RezorPaymentTable"));

const SuspenseWrapper = (Component: any) => (
  <Suspense fallback={<Loader />} >
    <Component />
  </Suspense>
);

const App = () => {

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={SuspenseWrapper(HomePage)} />

          {/* Admin */}
          <Route path="/admin/login" element={SuspenseWrapper(AdminLogin)} />
          <Route path="/admin/adminOtp" element={SuspenseWrapper(AdminVerifyOTP)} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Loader />}>
                <AdminProtected compo={SuspenseWrapper(AdminLayout)} />
              </Suspense>
            }
          >
            <Route index element={SuspenseWrapper(AdminDashboard)} />
            <Route path="table" element={SuspenseWrapper(RezorPaymentTable)} />
            <Route path="logout" element={SuspenseWrapper(AdminLogout)} />
          </Route>

          {/* Landlord Public */}
          <Route path="/landlord/login" element={SuspenseWrapper(LandlordLogin)} />
          <Route path="/landlord/Register" element={SuspenseWrapper(RegisterLandlord)} />

          {/* Landlord Protected */}
          <Route
            path="/landlord"
            element={
              <Suspense fallback={<Loader />}>
                <LandlordProtected compo={SuspenseWrapper(LandlordLayout)} />
              </Suspense>
            }
          >
            <Route index element={SuspenseWrapper(LandlordDashboard)} />
            <Route path="logout" element={SuspenseWrapper(LogoutLandlord)} />
            <Route path="calendar" element={<Calendar />} />

            <Route path="tax">
              <Route index element={SuspenseWrapper(Tax)} />
              <Route path=":id" element={SuspenseWrapper(Tax)} />
              <Route path="table" element={SuspenseWrapper(TaxTable)} />
            </Route>

            <Route path="rezor" element={SuspenseWrapper(RezorPayment)} />

            <Route path="payment">
              <Route index element={SuspenseWrapper(Payment)} />
              <Route path=":id" element={SuspenseWrapper(Payment)} />
              <Route path="table" element={SuspenseWrapper(PaymentTable)} />
            </Route>

            <Route path="lease">
              <Route index element={SuspenseWrapper(Lease)} />
              <Route path=":id" element={SuspenseWrapper(Lease)} />
              <Route path="table" element={SuspenseWrapper(LeaseTable)} />
            </Route>

            <Route path="maintenance">
              <Route index element={SuspenseWrapper(Maintenance)} />
              <Route path=":id" element={SuspenseWrapper(Maintenance)} />
              <Route path="table" element={SuspenseWrapper(MaintenanceTable)} />
            </Route>

            <Route path="property">
              <Route index element={SuspenseWrapper(PropertyForm)} />
              <Route path=":id" element={SuspenseWrapper(PropertyForm)} />
              <Route path="table" element={SuspenseWrapper(PropertyTable)} />
            </Route>

            <Route path="contract">
              <Route index element={SuspenseWrapper(Contract)} />
              <Route path=":id" element={SuspenseWrapper(Contract)} />
              <Route path="table" element={SuspenseWrapper(ContractTable)} />
            </Route>

            <Route path="tenanthistory">
              <Route index element={SuspenseWrapper(TenantHistory)} />
              <Route path=":id" element={SuspenseWrapper(TenantHistory)} />
              <Route path="view/:id" element={SuspenseWrapper(TenantHistoryDetail)} />
              <Route path="table" element={SuspenseWrapper(TenantHistoryTable)} />
            </Route>

            <Route path="rental">
              <Route index element={SuspenseWrapper(RentalAgreement)} />
              <Route path=":id" element={SuspenseWrapper(RentalAgreement)} />
              <Route path="table" element={SuspenseWrapper(RentalAgreementTable)} />
            </Route>

            <Route path="bill">
              <Route index element={SuspenseWrapper(Bill)} />
              <Route path=":id" element={SuspenseWrapper(Bill)} />
              <Route path="table" element={SuspenseWrapper(BillTable)} />
            </Route>

            <Route path="tenant">
              <Route index element={SuspenseWrapper(Tenant)} />
              <Route path=":id" element={SuspenseWrapper(Tenant)} />
              <Route path="table" element={SuspenseWrapper(TenantTable)} />
            </Route>
          </Route>


          <Route path="*" element={<div className="text-center mt-10">Page Not Found</div>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
