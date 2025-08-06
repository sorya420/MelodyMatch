


import { Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";


import ConcertsPage from "./pages/ConcertsPage";
import CallbackHandler from "./component/CallbackHandler";
import { SpotifyAuthutil } from "./component/SpotifyAuthutil";
import MusicRoom from "./component/MusicRoom";
import LoginWithSpotify from "./component/Spotifyloginpages";



const App = () => {
  const [cookies] = useCookies(["user"]);
  const authToken = cookies.AuthToken;

  return (
    <Routes>
      {/* Always public */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      {authToken ? (
        <>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/music/concerts" element={<ConcertsPage/>} />
           <Route path="/callback" element={<CallbackHandler />} />
              <Route path="/loginspotify" element={<SpotifyAuthutil/>} />
               <Route path="/room" element={<MusicRoom />} />
             <Route path="/loginspotifypage" element={<LoginWithSpotify/>} />
              
  
        </>
      ) : (
        // If not logged in, block access to all protected routes
        <>
          <Route path="/onboarding" element={<Navigate to="/" />} />
          <Route path="/dashboard" element={<Navigate to="/" />} />
          
          
          <Route path="/music/concerts" element={<Navigate to="/" />} />
        </>
      )}

      {/* Optional: 404 route */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};

export default App;

