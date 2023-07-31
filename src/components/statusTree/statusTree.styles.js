import { makeStyles } from "@mui/styles";
import { height, padding } from "@mui/system";
import {theme} from '../../theme/theme';

export const useStyles = makeStyles({
    titlePage:{
        textAlign:'center',
        display:'block',
        fontWeight:'bolder',
        fontSize:'1.1rem'
    },
    treeContainer:{
        backgroundColor:'#CFCFCF',
        border:'2px solid gray',
        borderRadius : '4px',
        padding : '2px',
        height: '100%'
    },
    container:{
        '& svg':{
            
        },
        '& .rd3t-label__title':{
            fill: 'black'
        },
        '& .rd3t-link':{
            stroke:'black'
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
    circle:{
        transition:'all .5s ease',
        '&:hover':{
            r:'17',
            transition:'all .5s ease'
        }
        
    },
    finalizado:{
        fill:'green',
        stroke: 'none',
        
    },
    ejecucion:{
        fill:'yellow',
        stroke: 'none'
    },
    retraso:{
        fill:'red',
        stroke: 'none'
    },
    popOver:{
        color:'black',
        padding:'0.5rem',
        '& .input':{
            width:'11rem'
        }
    }
})