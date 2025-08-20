import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import MainRouter from './mainRouter.jsx'; 
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";


createRoot(document.getElementById('root')).render(

  <MantineProvider defaultColorScheme="dark" theme={{ primaryColor: "indigo", fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", defaultRadius: "md",}}>
    <Notifications position="top-right" />
      <StrictMode>
        <BrowserRouter>
          <MainRouter />
        </BrowserRouter>
      </StrictMode>
  </MantineProvider>
);
