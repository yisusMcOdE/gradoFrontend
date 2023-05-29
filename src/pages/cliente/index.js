import { useStyles } from "./cliente.styles";
import TopicIcon from '@mui/icons-material/Topic';
import { Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar";
import { Outlet } from "react-router-dom";

export const Cliente = () => {

    const classes = useStyles();

    const menu= ['Pedidos'];
    const subMenu= {
        Pedidos: [
            {name: 'Buscar', to:'pedidos'}, 
            {name: 'Solicitar', to:'pedidos/solicitar'}
        ]
    }

    const icons= [<TopicIcon/>];

    return (
        <Grid container>
            <Grid item xs='auto'>
                <SideBar role={'Cliente'} menu={menu} icons={icons} subMenu={subMenu}/>
            </Grid>
            <Grid item xs className={classes.containerPage}>
                <Outlet/>
            </Grid>
        </Grid>
    )
}