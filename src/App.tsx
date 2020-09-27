import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Routes } from "./routes";
import Firebase, { FirebaseContext } from "./lib/firebase";
import { MusicContextWrapper } from "components/music-context-wrapper/music-context-wrapper";
import { LoadingSpinner } from "components/loading-spinner/loading-spinner";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <FirebaseContext.Provider value={new Firebase()}>
          <MusicContextWrapper>
            <Routes />
          </MusicContextWrapper>
        </FirebaseContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
