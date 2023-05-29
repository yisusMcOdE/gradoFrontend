import { makeStyles } from "@mui/styles";
import {theme} from '../../theme/theme';

export const useStyles = makeStyles({
    container:{
        '& .rd3t-label__title':{
            fill: theme.palette.neutro1.main
        },
        '& .rd3t-link':{
            stroke:'white'
        },
        height:'100%',
        /*
        '& .rd3t-node':{
            fill:'green',
            stroke: 'none'
        },
        
        '& .rd3t-leaf-node':{
            fill:'yellow',
            stroke: 'none'
        }*/
    },
    finalizado:{
        fill:'green',
        stroke: 'none'
    },
    ejecucion:{
        fill:'yellow',
        stroke: 'none'
    },
    espera:{
        fill:'yellow',
        stroke: 'none'
    },
})