import { theme } from './theme/theme';
import { ThemeProvider, Button, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';
import { Login } from './pages/login';
import { Recepcion } from './pages/Recepcion';
import { routes } from './routes';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={10}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <CssBaseline/>
        <RouterProvider router={routes}/>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
