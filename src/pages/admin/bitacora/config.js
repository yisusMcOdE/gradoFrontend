import { Backdrop, Button, Card, CircularProgress, Grid, Switch, TextField } from "@mui/material"
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react"
import { Main } from "../../../components/main"
import { getBinnacleConfig, getStatusEmail } from "../../../utilities/allGetFetch";
import { updateConfigBinnacle, updateConfigEmail } from "../../../utilities/allPutFetch";

export const ConfigBinnacle = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [editionMode, setEditionMode] = useState(false);
    const [data, setData] = useState();
    const [dataEdition, setDataEdition] = useState();

    const loadData = async () => {
        const response = await getBinnacleConfig();
        setData(response);
        setDataEdition({...response});
    }

    const updateConfig = async() => {
        setLoading(true);
        const response = await updateConfigBinnacle({...dataEdition});
        handleResponse(response)
        await loadData();
        setLoading(false);
    }

    const handleResponse = (response) => {
        if(response.status === 200){
            enqueueSnackbar('200: Actualizado Correctamente',{variant:'success'});
            setEditionMode(false);
        }
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
                    <h1 style={{textAlign:'center'}}>Configuracion de Registros de Bitacora</h1>
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
                            <Grid item xs={3}>
                                <label>Solicitudes GET :</label>
                            </Grid>
                            <Grid item xs>
                                <Button 
                                    className = {editionMode ? (dataEdition.registerGet ? 'activo ' : 'inactivo') : (data.registerGet ? 'activo ' : 'inactivo')}
                                    disabled = {!editionMode}
                                    onClick = {()=>{setDataEdition({...dataEdition, registerGet:!dataEdition.registerGet})}}

                                >
                                    {editionMode ? (dataEdition.registerGet ? 'Registrando' : 'No Registrando') : (data.registerGet ? 'Registrando' : 'No Registrando')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={3}>
                                <label>Solicitudes POST :</label>
                            </Grid>
                            <Grid item xs>
                                <Button 
                                    className = {editionMode ? (dataEdition.registerPost ? 'activo ' : 'inactivo') : (data.registerPost ? 'activo ' : 'inactivo')}
                                    disabled = {!editionMode}
                                    onClick = {()=>{setDataEdition({...dataEdition, registerPost:!dataEdition.registerPost})}}
                                >
                                    {editionMode ? (dataEdition.registerPost ? 'Registrando' : 'No Registrando') : (data.registerPost ? 'Registrando' : 'No Registrando')}
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={3}>
                                <label>Solicitudes PUT :</label>
                            </Grid>
                            <Grid item xs>
                                <Button 
                                    className = {editionMode ? (dataEdition.registerPut ? 'activo ' : 'inactivo') : (data.registerPut ? 'activo ' : 'inactivo')}
                                    disabled = {!editionMode}
                                    onClick = {()=>{setDataEdition({...dataEdition, registerPut:!dataEdition.registerPut})}}
                                >
                                    {editionMode ? (dataEdition.registerPut ? 'Registrando' : 'No Registrando') : (data.registerPut ? 'Registrando' : 'No Registrando')}
                                </Button>
                            </Grid>
                        </Grid>
                        
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