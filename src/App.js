import { theme } from './theme/theme';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
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
