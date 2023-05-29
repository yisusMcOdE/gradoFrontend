import { makeStyles } from "@mui/styles"
import { theme } from "../../theme/theme"
export const useStyles = makeStyles(({
    close:{
        width:'2rem',
        '& .MuiDrawer-paperAnchorDockedLeft':{
            border:'none'
        }
    },
    open:{
        width:'12rem',
        '& .MuiDrawer-paperAnchorDockedLeft':{
            border:'none'
        }
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
        left:'10rem',
        fontSize:'2rem',
        cursor:'pointer',
        transition:'all .5s ease',
        '&:hover':{
            color:theme.palette.third.main,
        }
    },
    slideOpenContainer:{
        background:theme.palette.secondary.main,
        color:theme.palette.fourth.main,
        width:'12rem',
    },
    headerSideBar:{
        textAlign:'center',
        height:'25%',
        '& svg':{
            position:'static',
            fontSize:'5rem'
        },
        '& h2':{
            margin:' 0 auto'
        }
    },
    bodySideBar:{
        height:'65%'
    },
    footerSideBar:{
        height:'10%',
        placeContent:'center',
        display: 'grid'
    }
}))