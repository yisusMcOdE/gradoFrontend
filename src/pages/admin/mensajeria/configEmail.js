import { Backdrop, Button, Card, CircularProgress, Grid, Switch, TextField } from "@mui/material"
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react"
import { Main } from "../../../components/main"
import { getStatusEmail } from "../../../utilities/allGetFetch";
import { updateConfigEmail } from "../../../utilities/allPutFetch";

export const ConfigEmail = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [editionMode, setEditionMode] = useState(false);
    const [data, setData] = useState();
    const [dataEdition, setDataEdition] = useState();
    const [editEmail, setEditEmail] = useState(false);

    const loadData = async () => {
        const response = await getStatusEmail();
        setData(response);
        setDataEdition({...response, email:{error:false, value:response.email}, password:{error:false, value:''}});
    }

    const updateConfig = async() => {
        ///validations
        let error = false;
        if(editEmail){
            if(dataEdition.email.value===''){
                setDataEdition({...dataEdition, email:{error:true, value:''}})
                error = true;
            }
            if(dataEdition.password.value===''){
                setDataEdition({...dataEdition, password:{error:true, value:''}})
                error = true;
            }
        }
        if(!error){
            const body = {
                statusEmailNotifications : dataEdition.notifications,
            }
            if(editEmail){
                body.emailNotification = dataEdition.email.value;
                body.passEmailAplication = dataEdition.password.value
            }
            console.log(body);
            setLoading(true);
            const response = await updateConfigEmail(body);
            handleResponse(response)
            await loadData();
            setLoading(false);

        }
    }

    const handleResponse = (response) => {
        if(response.status === 200)
            enqueueSnackbar('200: Actualizado Correctamente',{variant:'success'});
        else
            enqueueSnackbar('409: Conflicto',{variant:'error'});            
    }

    useEffect(()=>{
        loadData()
    },[])

    return data&&
    <Main>
        <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
        >
            <CircularProgress/>
        </Backdrop>
        <Grid container direction='column' rowGap={2} alignItems={'center'}>
            <Grid item style={{width:'80%'}}>
                <Card raised>
                    <h1 style={{textAlign:'center'}}>Configuracion de Mensajeria Email</h1>
                    <Grid container direction='column' rowSpacing={2}>
                        <Grid item container alignItems='center' justifyContent='right'>
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
                        <Grid item container>
                            <Grid xs={3}>
                                <label>Servicio Email:</label>
                            </Grid>
                            <Grid xs>
                                <Button 
                                    className = {editionMode ? (dataEdition.service ? 'activo ' : 'inactivo') : (data.service ? 'activo ' : 'inactivo')}
                                    disabled
                                >
                                    {editionMode ? (dataEdition.service ? 'Activo ' : 'Inactivo') : (data.service ? 'Activo ' : 'Inactivo')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid xs={3}>
                                <label>Envio de notificaciones:</label>
                            </Grid>
                            <Grid xs>
                                <Button 
                                    className = {editionMode ? (dataEdition.notifications ? 'activo ' : 'inactivo') : (data.notifications ? 'activo ' : 'inactivo')}
                                    disabled = {!editionMode}
                                    onClick = {()=>{setDataEdition({...dataEdition, notifications:!dataEdition.notifications})}}
                                >
                                    {editionMode ? (dataEdition.notifications ? 'Activo ' : 'Inactivo') : (data.notifications ? 'Activo ' : 'Inactivo')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid xs={3}>
                                <label>Correo para notificaciones:</label>
                            </Grid>
                            <Grid xs>
                                <TextField 
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.email.value : data.email}
                                    onChange={(e)=>{
                                        setDataEdition({...dataEdition, email:{error:false, value:e.target.value}})
                                        if(e.target.value===data.email)
                                            setEditEmail(false)
                                        else
                                            setEditEmail(true)
                                    }}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        {(editEmail && editionMode) &&
                        <Grid item container>
                            <Grid xs={3}>
                                <label>Password de aplicacion:</label>
                            </Grid>
                            <Grid xs>
                                <TextField
                                    type='password'
                                    size="small" 
                                    value={dataEdition.password.value}
                                    onChange={(e)=>{
                                        setDataEdition({...dataEdition, password:{error:false, value:e.target.value}})
                                    }}
                                />
                            </Grid>
                        </Grid>
                        }
                        {
                            editionMode&&
                            <Grid item container justifyContent='center'>
                                <Grid item>
                                    <Button 
                                        variant='contained'
                                        onClick={()=>{updateConfig()}}
                                    >
                                        Actualizar
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    </Main>
}