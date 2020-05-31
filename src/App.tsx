import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Routes } from "./routes";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading</div>} persistor={persistor}>
        <Routes />
      </PersistGate>
    </Provider>
  );
}

export default App;
