import { theme } from './theme/theme';
import { ThemeProvider, Button, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';
import { Login } from './pages/login';
import { Recepcion } from './pages/Recepcion';
import { routes } from './routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <RouterProvider router={routes}/>
    </ThemeProvider>
  );
}

export default App;
