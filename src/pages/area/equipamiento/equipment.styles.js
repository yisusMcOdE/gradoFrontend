import { makeStyles } from "@mui/styles"


export const useStyles = makeStyles(theme=>({
    titlePage:{
        textAlign:'center'
    },

    ///----SOLICITAR MATERIALES
    textField:{
        width:'100px'
    },
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

    ///----SOLICITAR MATERIALES

    
}))