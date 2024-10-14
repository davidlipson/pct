import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import mixpanel from "mixpanel-browser";
import { GameProvider } from "./components/Game/contexts/GameContext";

// Near entry of your product, init Mixpanel
mixpanel.init(process.env.REACT_APP_MP, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <GameProvider>
    <App />
  </GameProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
