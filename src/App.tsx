import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Routes } from "./routes";
import Firebase, { FirebaseContext } from "./lib/firebase";
import { FirebaseSession } from "firebase-session";
import { MusicContextWrapper } from "components/music-context-wrapper/music-context-wrapper";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
        <FirebaseContext.Provider value={new Firebase()}>
          <FirebaseSession>
            <MusicContextWrapper>
              <Routes />
            </MusicContextWrapper>
          </FirebaseSession>
        </FirebaseContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
