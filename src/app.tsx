import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

import Local from "./views/Local";
import StorageView from "./views/Storage";
import Start from "./views/Start";
import Layout from "./layout";
import Tracklist from "./views/Tracklist";
import Settings from "./views/Settings";
import Radio from "./views/Radio";
import Playlists from "./views/Playlist/Playlists";
import SettingsGeneral from "./views/Settings/SettingsGeneral";
import SettingsNetwork from "./views/Settings/SettingsNetwork";
import Multiroom from "./views/Multiroom";
import SettingsMultiroom from "./views/Settings/SettingsMultiroom";
import BluetoothView from "./views/Bluetooth";
import SettingsLocal from "./views/Settings/SettingsLibrary";
import SettingsDisplay from "./views/Settings/SettingsDisplay";
import SettingsStorage from "./views/Settings/SettingsStorage";
import SettingsSupport from "./views/Settings/SettingsSupport";
import SettingsSystem from "./views/Settings/SettingsSystem";
import SettingsDsp from "./views/Settings/SettingsDsp";
import SettingsLinein from "./views/Settings/SettingsLinein";
import SettingsTuner from "./views/Settings/SettingsTuner";
import SettingsMixer from "./views/Settings/SettingsMixer";
import PlaylistView from "./views/Playlist/PlaylistView";
import Tuner from "./views/Tuner";
import Dsp from "./views/Dsp";

const App = () => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            unstyled: true,
            classNames: {
              toast: "w-full",
            },
          }}
        />

        <Router>
          <Layout>
            <Routes key={location.pathname}>
              <Route path="/" element={<Start />} />
              <Route path="/bluetooth" element={<BluetoothView />} />
              <Route path="/spotify" element={<Start />} />
              <Route path="/shairportsync" element={<Start />} />
              <Route path="/linein" element={<Start />} />
              <Route path="/multiroom" element={<Multiroom />} />
              <Route path="/tracklist" element={<Tracklist />} />
              <Route path="/playlist/" element={<Playlists />} />
              <Route path="/playlist/:id" element={<PlaylistView />} />
              <Route path="/local/:view?/:id?" element={<Local />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/tuner" element={<Tuner />} />
              <Route path="/storage/*" element={<StorageView />} />
              <Route path="/dsp" element={<Dsp />} />
              <Route path="/settings/" element={<Settings />} />
              <Route path="/settings/system/" element={<SettingsSystem />} />
              <Route path="/settings/general/" element={<SettingsGeneral />} />
              <Route path="/settings/mixer/" element={<SettingsMixer />} />
              <Route path="/settings/local/" element={<SettingsLocal />} />
              <Route path="/settings/bluetooth/" element={<BluetoothView />} />
              <Route path="/settings/network/" element={<SettingsNetwork />} />
              <Route path="/settings/storage/" element={<SettingsStorage />} />
              <Route path="/settings/linein/" element={<SettingsLinein />} />
              <Route path="/settings/dsp/" element={<SettingsDsp />} />
              <Route path="/settings/tuner/" element={<SettingsTuner />} />
              <Route path="/settings/display/" element={<SettingsDisplay />} />
              <Route path="/settings/multiroom/" element={<SettingsMultiroom />} />
              <Route path="/settings/support/" element={<SettingsSupport />} />
            </Routes>
          </Layout>
        </Router>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
