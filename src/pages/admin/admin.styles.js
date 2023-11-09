import { makeStyles } from "@mui/styles";
import { theme } from "../../theme/theme";

export const useStyles = makeStyles({
    containerPage:{
        backgroundColor:'transparent',
        backdropFilter: 'blur(0px)',
        minHeight:'100vh'
    },
    titlePage:{
        textAlign:'center'
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
        margin:'10px 0 0 10px',
        '& button':{
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
            padding:'0 15px',
            '& .MuiFormControl-root':{
                marginBottom:'5px'
            }
        }
    },
})