import { Drawer, Grid } from "@mui/material";
import { SideBar } from "../../components/SideBar"
import { Outlet, useNavigate } from "react-router-dom";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import WidgetsIcon from '@mui/icons-material/Widgets';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useStyles } from "./admin.styles";
import { useEffect, useState } from "react";
import { BackgroundPage } from "../../components/background";
import { SuperUserBar } from "../../components/superUserBar";
import { redirectRole, verifyToken, verifyTokenWithPath } from "../../utilities/pdfMake/redirectRole";


export const Admin = () => {

    const navigator = useNavigate();

    const [isSuperUser, setIsSuperUser] = useState(false);

    const menu= ['Usuarios', 'Materiales', 'Trabajos','Mensajeria', 'Backups', 'Bitacora', 'Reportes'];
    const subMenu= {
        Usuarios: [
            {name: 'Informacion de Usuario', to:'usuarios'},
            {name: 'Cuentas de Usuario', to:'cuentaUsuarios'},
            {name: 'Crear', to:'usuarios/crear'},
        ],
        Materiales: [
            {name: 'Ver', to: 'materiales'},
            {name: 'Crear', to: 'materiales/crear'}, 
        ],
        Trabajos: [
            {name: 'Ver', to: 'trabajos'},
            {name: 'Crear', to: 'trabajos/crear'}, 
        ],
        Mensajeria:[
            {name: 'Configuracion Whatsapp', to: 'configWhatsapp'},
            {name: 'Configuracion Email', to: 'configEmail'},
        ],
        Backups: [
            {name: 'Ver', to: 'backup'},
            {name: 'Configurar', to: 'backup/configurar'}, 
        ],
        Bitacora: [
            {name: 'Ver', to: 'bitacora'}
        ],
        Reportes:[
            {name:'Reporte de Bitacora', to: 'reporteBitacora'}
        ]
        
    };
    const icons= [
        <SupervisedUserCircleIcon/>,
        <WidgetsIcon/>,
        <AutoAwesomeMotionIcon/>,
        <MarkUnreadChatAltIcon/>,
        <StorageIcon/>,
        <VisibilityIcon/>,
        <FindInPageIcon/>
    ];
    const classes=useStyles();

    useEffect(()=>{
        setIsSuperUser(verifyTokenWithPath('Administracion',navigator));
    },[])

    return (
    <Grid container>
        <BackgroundPage/>
        <Grid item xs='auto'>
            <SideBar role='Administrador' menu={menu} icons={icons} subMenu={subMenu}/>
        </Grid>
        <Grid item container direction='column' xs className={classes.containerPage} >
            {
                isSuperUser&&
                    <Grid item xs='auto' style={{margin:'auto', display:'block', marginTop:'0.5rem'}}>
                        <SuperUserBar/>
                    </Grid>
                }
            <Grid item xs>
                <Outlet/>
            </Grid>
        </Grid>
    </Grid>)
}