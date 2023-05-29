import { createTheme, merge } from '@mui/material';

const paleta={
  primary:    '#1A1A1B',

  secondary:  '#263859',

  third:      '#6B778D',
  thirdHover: '#1A1A1B',

  fourth:     '#EEEEEE',

  neutro1:    '#ffffff',
  neutro2:    '#000000',

  tableHeader:'#464646'
}

/*
import Roboto from '../assets/font/Roboto-Bold.ttf';
import Montserrat from '../assets/font/Montserrat-Bold.ttf';
import Lato from '../assets/font/Lato-Light.ttf';
*/

/*
const RobotoRegular = {
  fontFamily: 'Roboto-Bold',
  src: `url(${Roboto})`
}
const MontserratRegular = {
  fontFamily: 'Montserrat-Bold',
  src: `url(${Montserrat})`
}
const LatoRegular = {
  fontFamily: 'Lato-Ligth',
  src: `url(${Lato})`
}
*/
export const theme = createTheme({
  typography: {
    /*fontFamily: [
      `"${MontserratRegular.fontFamily}"`,
      //`"${RobotoRegular.fontFamily}"`,
      `"${LatoRegular.fontFamily}"`,
      ].join(','),*/

  },
  palette: {
    text: {
      primary: paleta.fourth, // Color de fuente primario
      secondary: "#888888", // Color de fuente secundario
    },
    primary: {
      // green dark
      main: paleta.primary,
    },
    secondary: {
      // green ligth
      main: paleta.secondary,
    },
    third: {
      // gray
      main: paleta.third,
    },
    fourth: {
      main: paleta.fourth,
    },
    neutro1: {
      //white
      main: paleta.neutro1,
    },
    neutro2: {
      //black
      main: paleta.neutro2,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        /*
        '@font-face': [RobotoRegular, 
                      MontserratRegular, 
                      LatoRegular],
        */
      },
      body: {
        fontFamily: ['Roboto-Regular'],
      },
      'h1, h2, h3, h4, h5, h6': {
        margin: 0,
        padding: 0,
      },
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          color: paleta.fourth,
          background: paleta.third,
          '&:hover': {
            background: paleta.thirdHover
          },
          '&.activo':{
            background:'green',
            transition:'all .5s ease',
            '&:hover':{
              opacity:'.8',
              transition:'all .5s ease',
            }
          },
          '&.inactivo':{
            background:'red',
            transition:'all .5s ease',
            '&:hover':{
              opacity:'.8',
              transition:'all .5s ease',
            }
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: paleta.secondary,
          padding: '4rem'
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderRow: {
          background: paleta.tableHeader,
          fontSize:'1rem',
          fontWeight:'bolder',
          '& button':{
            color:'white'
          }
        },
        menu:{
          '& .MuiPaper-root':{
            background: paleta.primary,
            border:'1px solid white',
            '& hr':{
              backgroundColor: 'white'
            },
            '& svg': {
              color: 'white'
            }
          }
        },
        panelWrapper:{
          background: paleta.primary,
          border:'1px solid white',
          '& hr':{
            backgroundColor: 'white'
          },
          '& svg': {
            color: 'white'
          },
          '& span':{
            '&.Mui-checked':{
              '& .MuiSwitch-thumb':{
                color:'#1E1E1E'
              }
            },
            '&.MuiSwitch-track':{
              backgroundColor:'white !important'
            }
          }
        },
        row: {
            color:'black',
            cursor:'pointer',
            transition:'all .5s ease',
            '&:hover':{
              fontSize:'1rem',
              transition:'all .5s ease',
            },
            '&.even': {
              background:'#D7D7D7'
            },
            '&.odd': {
              background:'#FFFFFF'
            }
        }
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          background: paleta.neutro1,
          color: paleta.neutro2,
        },
      },
    },
    MuiDialog:{
      styleOverrides: {
        paper: {
          background: paleta.primary,
        },
      },
    },
    MuiList:{
      styleOverrides: {
        root: {
          background: '#1B2942',
          '& svg':{
            color: paleta.fourth
          }
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        option:{
          color:'black'
        }
      }
    }
  },
})
