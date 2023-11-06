import { useStyles } from "./direccion.styles";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { SuperUserBar } from "../../components/superUserBar";
import { useEffect } from "react";
import { redirectRole, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";

export const Direccion = ({isSuperUser, role}) => {

    const classes = useStyles();
    const navigator = useNavigate();

    const menu= ['Trabajos','Reportes'];
    const subMenu= {
        Trabajos:[
            {name: 'Cronograma', to:'cronograma'}
        ],
        Reportes: [
            {name: 'Uso de materiales', to:'reporteMaterial'}
        ]
        
    }

    const icons= [<AutoAwesomeMotionIcon/>,<FindInPageIcon/>];

    useEffect(()=>{
        verifyTokenWithPath('Direccion',navigator);
    },[])

    return (
        <Grid container>
            <Grid item xs='auto'>
                <SideBar role={'Direccion'} menu={menu} icons={icons} subMenu={subMenu}/>
            </Grid>
            <Grid item container direction='column' xs className={classes.containerPage}>
                {
                isSuperUser&&
                    <Grid item>
                        <SuperUserBar/>
                    </Grid>
                }
                <Grid item>
                    <Outlet/>
                </Grid>
            </Grid>
        </Grid>
    )
}