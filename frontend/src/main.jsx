import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store/store.js";

// Global error handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  // Only log if it's not from browser extensions
  if (!event.reason?.message?.includes("message channel") && 
      !event.reason?.message?.includes("content.js")) {
    console.error("Unhandled promise rejection:", event.reason);
  }
  // Prevent default browser error handling for extension-related errors
  if (event.reason?.message?.includes("message channel") || 
      event.reason?.message?.includes("content.js")) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);



