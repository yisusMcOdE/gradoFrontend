import { Backdrop, Button, Card, CircularProgress, Dialog, Grid, IconButton, Switch, TextField } from "@mui/material"
import { Main } from "../../../components/main"
import QRCode from 'qrcode.react';
import { getAuthenticated, getIsReady, getQRCode, getQRCodeAuto } from "../../../utilities/allGetFetch";
import { useEffect, useState } from "react";
import { Replay, RestartAlt } from "@mui/icons-material";
import { logoutWWeb, updateNotificationsWWeb } from "../../../utilities/allPutFetch";

export const ConfigWhatsapp = () => {

    const [loading, setLoading] = useState(false);
    const [qr, setQr] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [data, setData] = useState();
    const [service, setService] = useState ();
    const [notifications, setNotifications] = useState();
    const [modal, setModal] = useState(false);

    const generateCode = async() => {
        setLoading(true);
        const response = await getQRCode();
        setLoading(false);
        setQr(response);
        isReady();
        while(response!=='Limit QR'){
            const response = await getQRCodeAuto();
            setQr(response);
        }
    }

    const verifyAutenticated = async () => {
        const response = await getAuthenticated();
        console.log(response);
        if(response.whatsapp === false){
            generateCode();
            setData(response);
        }
        else{
            setData(response);
            setService(response.whatsapp);
            setNotifications(response.notifications);
        }
    }

    const isReady = async () => {
        const response = await getIsReady();
        setData(response);
        setService(response.whatsapp);
        setNotifications(response.notifications);
    }

    const editConfig = async() => {
        if(service === false && data.whatsapp===true){
            setModal(true);
        }
        if(notifications!==data.notifications){
            await updateNotificationsWWeb(notifications);
            await verifyAutenticated();
        }
        setEditionMode(false);
    }

    const closeService = async() => {
        await logoutWWeb();
        await verifyAutenticated();
        setModal(false);
    }

    useEffect(()=>{
        verifyAutenticated();
    },[])

    return(
        data&&
        <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Grid container direction='column' alignContent='center'>
                    <Grid item xs alignSelf='center'>
                        <CircularProgress color="inherit" />
                    </Grid>
                    <Grid item >
                        <Button 
                            className="inactivo" 
                            startIcon={<RestartAlt/>}
                            onClick={()=>{setModal(true)}}
                        >
                            Reinicio Forzado
                        </Button>
                    </Grid>
                </Grid>
            </Backdrop>
            <Dialog 
                open={modal}
                onClose={()=>{setModal(false)}}
            >
                <Card>
                    <Grid container direction='column'>
                        <Grid item>
                            <h3>¿Seguro que desea cerrar el servicio de whatsapp?</h3>
                        </Grid>
                        <Grid item container justifyContent='space-around'>
                            <Grid item >
                                <Button
                                    className="inactivo" 
                                    variant='contained'
                                    onClick={()=>{closeService()}}
                                >
                                    Si
                                </Button>
                            </Grid>
                            <Grid item >
                                <Button 
                                    className="activo" 
                                    variant='contained'
                                    onClick={()=>{setModal(false)}}
                                >
                                    No
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
            <Grid container direction='column' rowGap={2} alignItems='center'>
                <Grid item style={{width:'80%'}}>
                    <Card raised>
                        <Grid container direction='column'>
                            <Grid item>
                                <h1 style={{textAlign:'center'}}>Configuracion de mensajeria Whastapp</h1>
                            </Grid>
                        </Grid>
                        {!data.whatsapp?
                            <Grid container direction='column' alignItems='center'>
                                <Grid item>
                                    <p style={{textAlign:'center'}}>
                                        No existe un servicio de whatsapp habilitado.
                                    </p>
                                    <p style={{textAlign:'center'}}>
                                        Por favor iniciar sesion mediante el siguiente codigo QR.
                                    </p>
                                </Grid>
                                {
                                qr==='Limit QR' ?
                                    <>
                                        <Grid item>
                                            <IconButton size='large' onClick={generateCode}>
                                                <Replay fontSize="inherit" color='error'/>
                                            </IconButton>
                                        </Grid>
                                    </>
                                :
                                    <Grid>
                                        <QRCode 
                                            value={qr} 
                                            includeMargin={true}
                                            level='L'
                                            size={384}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        :
                        <>
                            <Grid container direction='column' alignItems='end'>
                                <Grid item>
                                    <Button 
                                        className="inactivo" 
                                        startIcon={<RestartAlt/>}
                                        onClick={()=>{setModal(true)}}
                                    >
                                        Reinicio Forzado
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid container direction='column' rowGap={2} alignItems='center'>
                                <Grid item container alignItems='center' justifyContent='center'>
                                    <Grid item >
                                        <label>Modo Edicion</label>
                                    </Grid>
                                    <Grid item >
                                        <Switch 
                                            checked = {editionMode}
                                            onChange={()=>{
                                                setEditionMode(prev=>!prev);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}>
                                        <label> Servicio de whatsapp:</label>
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            className = {editionMode ? (service ? 'activo ' : 'inactivo') : (data.whatsapp ? 'activo ' : 'inactivo')}
                                            disabled = {!editionMode}
                                            onClick = {()=>{setService(prev=>!prev)}}
                                        >
                                            {editionMode ? (service ? 'Activo ' : 'Inactivo') : (data.whatsapp ? 'Activo ' : 'Inactivo')}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}>
                                        <label> Envio de notificaciones:</label>
                                    </Grid>
                                    <Grid item>
                                        <Button 
                                            className = {editionMode ? (notifications ? 'activo ' : 'inactivo') : (data.notifications ? 'activo ' : 'inactivo')}
                                            disabled = {!editionMode}
                                            onClick = {()=>{setNotifications(prev=>!prev)}}
                                        >
                                            {editionMode ? (notifications ? 'Activo ' : 'Inactivo') : (data.notifications ? 'Activo ' : 'Inactivo')}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}>
                                        <label> WID de Cliente:</label>
                                    </Grid>
                                    <Grid item>
                                        <TextField disabled size='small' value={data.wid}/>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}>
                                        <label> Plataforma de Cliente:</label>
                                    </Grid>
                                    <Grid item>
                                        <TextField disabled size='small' value={data.platform}/>
                                    </Grid>
                                </Grid>
                                {editionMode&&
                                <Grid item container alignItems='center' justifyContent='center'>
                                    <Grid item >
                                        <Button 
                                            variant='contained'
                                            onClick={editConfig}
                                        >
                                            Guardar
                                        </Button>
                                    </Grid>
                                </Grid>
                                }
                            </Grid>
                        </>
                        }
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}