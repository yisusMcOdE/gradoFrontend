import { useStyles } from "./cliente.styles";
import TopicIcon from '@mui/icons-material/Topic';
import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { SuperUserBar } from "../../components/superUserBar";
import { useEffect } from "react";
import { redirectRole, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";

export const Cliente = ({isSuperUser, role}) => {

    const classes = useStyles();
    const navigator = useNavigate();

    const menu= ['Pedidos'];
    const subMenu= {
        Pedidos: [
            {name: 'Mis Pedidos', to:'pedidos'}, 
            {name: 'Solicitar Pedido', to:'pedidos/nuevo'}
        ]
    }

    const icons= [<TopicIcon/>];

    useEffect(()=>{
        verifyTokenWithPath('Cliente',navigator);
    },[])

    return (
        <Grid container>
            <Grid item xs='auto'>
                <SideBar role={'Cliente'} menu={menu} icons={icons} subMenu={subMenu}/>
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