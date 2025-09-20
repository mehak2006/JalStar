import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// import ForecastViewer from "./components/ForecastViewer";
// import HistoryViewer from "./components/HistoryViewer";
// import Header from "@/components/header";
// import Districts from "./districts/district";
import States from "./states/state";
const queryClient = new QueryClient();
import DistrictsMap from "./districts/district";
import AlertSubscription from "./components/AlertSubscription";
import LoginPage from "./components/ui/loginPage";
import SignupPage from "./components/ui/signupPage";
const App = () => (
  <>
  
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="groundwater-theme">
      {/* <Header/> */}
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
             
                {/* <Route path="/forecast" element={<ForecastViewer />} />
                <Route path="/history" element={<HistoryViewer />} /> */}
                {/* <Route path="/district" element={<Districts />} /> */}
                <Route path="/state" element={<States />} />
                <Route path="/district" element={<DistrictsMap/>}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
    <LoginPage/>
    <SignupPage/>
      <AlertSubscription/>
  </QueryClientProvider>
  </>
);

export default App;
