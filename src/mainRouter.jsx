import { Routes, Route, NavLink } from 'react-router-dom';
import App from './App.jsx';
import App2 from './App2.jsx';
import App3 from './App3.jsx';


export default function MainRouter() {
  return (
    <>
      <nav>
        <NavLink to="/Laster">Laster</NavLink> |{' '}
        <NavLink to="/Lior">Lior</NavLink> |{' '}
        <NavLink to="/Guy">Guy</NavLink>
 
      </nav>

      <Routes>
        <Route path="/Laster" element={<App />} />
        <Route path="/Lior" element={<App2 />} />
        <Route path="/Guy" element={<App3 />} />
      </Routes>
    </>
  );
}
