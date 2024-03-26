import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import { ShowsProvider } from './services/ShowsContext.tsx';
import {AuthContextProvider} from "./services/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
      <AuthContextProvider>
        <ShowsProvider>
            <App />
        </ShowsProvider>
      </AuthContextProvider>
  </BrowserRouter>,
)
