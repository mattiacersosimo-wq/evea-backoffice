import { lazy, Suspense } from "react";
import useAuth from "src/hooks/useAuth";
import LoadingScreen from "src/components/LoadingScreen";

const PromoterDashboard = lazy(() => import("./promoterDashboard"));
const CustomerDashboard = lazy(() => import("./customerDashboard"));

const DashboardRouter = () => {
  const { user } = useAuth();
  const Comp = user?.is_promoter === 1 ? PromoterDashboard : CustomerDashboard;
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Comp />
    </Suspense>
  );
};

export default DashboardRouter;
