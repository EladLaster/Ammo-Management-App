import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(

<MantineProvider
  defaultColorScheme="light"
  theme={{
    dir: "rtl",
    primaryColor: "indigo",
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    defaultRadius: "md",
    colors: {
      light: [
        "#cccccc",
        "#cccccc", 
      ],
    },
  }}>
    <Notifications position="top-right" />
      <StrictMode>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </StrictMode>
  </MantineProvider>
);
