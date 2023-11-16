import { createTheme, merge } from '@mui/material';
import kanit_Regular from '../assets/fonts/Kanit/Kanit-Regular.ttf';


const paleta={
  primary:    '#FFFFFF',

  secondary:  '#E8E8E8',

  third:      '#DBC8AC',
  thirdHover: '#1A1A1B',

  fourth:     '#000000',

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
const kanitRegular = {
  fontFamily : 'Kanit',
  src: `url(${kanit_Regular})`
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Kanit'
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
        '@font-face': [kanitRegular],
      },
      body: {
        fontFamily: ['Kanit','Roboto-Regular'],
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
          //color: paleta.fourth,
          //background: paleta.third,
          '&:hover': {
            //background: paleta.thirdHover
          },
          '&.activo':{
            background:'green',
            transition:'all .5s ease',
            '&:disabled':{
              color:'#004F00'
            },
            '&:hover':{
              opacity:'.8',
              transition:'all .5s ease',
            }
          },
          '&.inactivo':{
            background:'red',
            transition:'all .5s ease',
            '&:disabled':{
              color:'#4F0000'
            },
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
          padding: '2rem'
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaderRow: {
          background: paleta.tableHeader,
          color:'white',
          fontSize:'1.1rem',
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
          background: 'paleta.primary',
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
          ///background: paleta.neutro1,
          ///color: paleta.neutro2,
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
          '& svg':{
            color: 'paleta.fourth'
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
    },
    MuiSnackbar: {
      styleOverrides:{
        root:{
          position:'sticky',
          top:'20px',
          justifyContent:'flex-end'
        }
      }
    }
  },
})
