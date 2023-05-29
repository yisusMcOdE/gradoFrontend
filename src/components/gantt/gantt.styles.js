import { makeStyles } from "@mui/styles";
import { theme } from "../../theme/theme";

const tasks = require('../../__mock__/tareas.json').length;
console.log(tasks);

export const useStyles = makeStyles({
    container:{
        '& div':{
            overflow:'auto !important'
        },
        '& svg':{
            height:`${60 + (38*tasks)}px !important`
        },
        '& .gantt-container':{
            background:'gray',
            padding:'0.5rem',
            borderRadius:'10px'
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
        },
        '& .bar-wrapper ':{
            '&:hover':{
                '& .bar-progress':{
                    fill:'#62955b !important'
                }
            }
        },
        ///---Botones de cambio
        '& .handle':{
            fill:'#1b2942'
        }
        
    },
    
})