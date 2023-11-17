import { makeStyles } from "@mui/styles";
import { theme } from "../../theme/theme";

export const useStyles = makeStyles({
    
    containerPage:{
        backgroundColor:'transparent',
        backdropFilter: 'blur(0px)',
        minHeight:'100vh'
    },
    areaContainer:{
        placeContent: 'center',
        display:'grid'
    },
    indexContainer:{
        margin:'5rem 0',
    },
    titlePage:{
        textAlign: 'center',
        marginTop: '0'
    },
    detalleContainer:{
        margin:'5rem 0',
        width: '50rem'
    },
    ganttContainer:{
        width:'100%'
    },
    tableHeader:{
        background:'#464646',
        color:'white',
        border:'1px solid white',
        '& .MuiGrid-item':{
            border:'1px solid gray'
        },
        '& h3':{
            textAlign:'center',
            margin:'0.4rem'
        }
    },
    addRemoveBox:{
        borderRadius:'10px',
        position: 'absolute',
        margin:'10px 0 0 10px',
        '& button':{
            background:'white',
            '&:hover':{
                background:'#BABABA',
            }
        },
    },
    tableBody:{
        color:'black',
        '& .MuiGrid-item':{
            display:'flex',
            placeContent:'center',
            padding:'0 5px',
            '& .MuiFormControl-root':{
                marginBottom:'5px'
            }
        }
    },
})