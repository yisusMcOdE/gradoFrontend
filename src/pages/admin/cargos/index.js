import { Backdrop, Button, Card, CircularProgress, Grid, Switch, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { getCharges } from "../../../utilities/allGetFetch";
import { updateCharges } from "../../../utilities/allPutFetch";

export const Cargos = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [editionMode, setEditionMode] = useState(false);
    const [data, setData] = useState();
    const [dataEdition, setDataEdition] = useState();

    const loadData = async () => {
        const response = await getCharges();
        setData(response);
        setDataEdition({...response});
    }

    const updateConfig = async() => {
        setLoading(true);
        const response = await updateCharges(dataEdition);
        handleResponse(response);
        await loadData();
        setLoading(false);
        setEditionMode(false);
    }

    const handleResponse = (response) => {
        if(response.status === 200)
            enqueueSnackbar('200: Actualizado Correctamente',{variant:'success'});
        else
            enqueueSnackbar('409: Conflicto',{variant:'error'});            
    }

    useEffect(()=>{
        loadData();
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
                    <h1 style={{textAlign:'center'}}>Configuracion de Cargos de la Imprenta</h1>
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
                            <Grid item xs={4}>
                                <label>Director:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    error= {dataEdition.chargeDirector.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargeDirector : data.chargeDirector}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargeDirector:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Informatico:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargeIt.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargeIt : data.chargeIt}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargeIt:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Encargado de la Imprenta:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargeManager.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargeManager : data.chargeManager}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargeManager:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Recepcionista:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargeReception.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargeReception : data.chargeReception}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargeReception:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Encargado del Area Impresion:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargePrintingManager.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargePrintingManager : data.chargePrintingManager}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargePrintingManager:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Encargado del Area Empastado:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargePastingManager.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargePastingManager : data.chargePastingManager}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargePastingManager:e.target.value})}}
                                    disabled={!editionMode}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container>
                            <Grid item xs={4}>
                                <label>Encargado del Area de Typografia:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField 
                                    
                                    error= {dataEdition.chargeTypographyManager.error}
                                    type='email'
                                    size="small" 
                                    value={editionMode? dataEdition.chargeTypographyManager : data.chargeTypographyManager}
                                    onChange={(e)=>{setDataEdition({...dataEdition, chargeTypographyManager:e.target.value})}}
                                    disabled={!editionMode}
                                />
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