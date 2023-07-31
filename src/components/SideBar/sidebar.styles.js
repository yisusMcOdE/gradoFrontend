import { makeStyles } from "@mui/styles"
import { theme } from "../../theme/theme"
export const useStyles = makeStyles(({
    close:{
        width:'2rem',
    },
    open:{
        width:'15rem',
    },
    slideCloseContainer:{
        background:theme.palette.secondary.main,
        height:'100%',
        '& svg':{
            fontSize:'2rem',
            cursor:'pointer',
            transition:'all .5s ease',
            color:theme.palette.fourth.main,

            '&:hover':{
                color:theme.palette.third.main,
            }
        }
    },
    iconToggle:{
        position:'absolute',
        left:'13rem',
        fontSize:'1rem',
        cursor:'pointer',
        transition:'all .5s ease',
        '&:hover':{
            color:theme.palette.third.main,
        },
        '& svg':{
            fontSize:'2rem',
        }
    },
    slideOpenContainer:{
        background:theme.palette.secondary.main,
        color:theme.palette.fourth.main,
        width:'15rem',
    },
    headerSideBar:{
        textAlign:'center',
        '& svg':{
            position:'static',
            fontSize:'5rem'
        },
        '& h2':{
            margin:' 0 auto'
        }
    },
    bodySideBar:{
        overflowY:'auto'
    },
    footerSideBar:{
        placeContent:'center',
        display: 'grid',
        '& button':{
            margin:'1rem 0rem'
        }
    }
}))