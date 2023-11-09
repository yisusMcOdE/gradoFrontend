import { makeStyles } from "@mui/styles";
import { theme } from "../../theme/theme"

export const useStyles = makeStyles({
    containerPage:{
        background:'transparent',
        backdropFilter: 'blur(0px)',
        minHeight:'100vh'

    },
    titlePage:{
        textAlign:'center'
    },

    ///---SOLICITAR PEDIDO
    tableHeader:{
        background:'#464646',
        color:'white',
        border:'1px solid white',
        '& .MuiGrid-item':{
            border:'1px solid gray'
        },
        '& h3':{
            textAlign:'center'
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