import { makeStyles } from "@mui/styles";
import { theme } from "../../theme/theme";
import { getOrdersDelayed } from "../../utilities/allGetFetch";

const myStyles = {
    container:{
        
        
        '& svg':{
            ///height: (props) =>`${60 + (38*props.tasks)}px !important`
        },
        ///---cabezera
        '& .grid-header':{
            fill:'#1B2942'
        },
        ///---lineas verticales
        '& .tick':{
            strokeWidth:'0.8'
        },
        ///---fechas
        '& .date':{
            '& text':{
                fill:'white'
            }
        },
        ///---marcador del dia
        '& .today-highlight':{
            fill:theme.palette.neutro2.main
        },
        ///---barra-tarea
        '& .bar':{
            fill: '#353a3e',
            '& .active':{
                '& .bar-progress':{
                    fill:'#62955b !important'
                }
            }
        },
        '& .bar-progress':{
            fill: '#139300',
            '& .delayed':{
                fill:'#930003',
            }
        },
        '& .bar-wrapper ':{
            '&:hover':{
                '& .bar-progress':{
                    opacity: 0.8
                }
            },
        },
        
        ///---Botones de cambio
        '& .handle':{
            fill:'#1b2942'
        }
    },
    titlePage:{
        textAlign: 'center',
        marginTop: '0'
    },
}


export const useStyles = 
    makeStyles({...myStyles})
