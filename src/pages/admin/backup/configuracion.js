import { Alert, Backdrop, Button, Card, CircularProgress, Grid, Snackbar, Switch, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { getConfigBackup } from "../../../utilities/allGetFetch";
import { updateConfigBackup } from "../../../utilities/allPostFetch";
import { useStyles } from "../admin.styles";



export const Configuracion = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState();
    const [dataEdit, setDataEdit] = useState();
    const [editionMode, setEditionMode] = useState(false);

    const handleResponse = async(response) => {
        if(response.status === 202){
            enqueueSnackbar('202: Actualizado',{variant:'success'});            
            setEditionMode(false);
            loadData();
        }
        if(response.status === 404){
            enqueueSnackbar('404: No encontrado',{variant:'error'});            
        }
        if(response.status === 409){
            enqueueSnackbar('409: Conflicto',{variant:'warning'});            
        }
        if(response.status === 304){
            enqueueSnackbar('304: No Modificado',{variant:'warning'});            
        }
    }

    const loadData = async() => {
        const response = await getConfigBackup();
        setData(response);
        setDataEdit(response);
    }

    useEffect(()=>{
        loadData();
    },[])

    const updateConfig = async() => {
        const body = {
            statusBackups:dataEdit.statusBackups, 
            intervalBackups:dataEdit.intervalBackups
        };
        setLoading(true);
        const response = await updateConfigBackup(body);;
        setLoading(false);
        handleResponse(response);
        
    }

    const classes = useStyles();

    return (
        data&&
        <Main>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Grid container direction='column' alignItems='center'>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Configuracion de Copias de Respaldos</h1>
                            </Grid>
                            <Grid item container alignItems='center' justifyContent='flex-end'>
                                <Grid item >
                                    <label>Modo Edicion</label>
                                </Grid>
                                <Grid item >
                                    <Switch 
                                        checked = {!editionMode}
                                        onChange={()=>{
                                            setEditionMode(prev=>!prev);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                    {
                        editionMode?
                        <>
                            <Grid item container rowSpacing={1}>
                                <Grid item container alignItems='center' columnGap={1}>
                                    <Grid item xs={2}>
                                        <label>Estado:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Button 
                                            className={dataEdit.statusBackups?'activo':'inactivo'}
                                            onClick={e=>{setDataEdit({...dataEdit, statusBackups:!dataEdit.statusBackups})}}
                                        >
                                            {dataEdit.statusBackups?'Habilitado':'Suspendido'}
                                        </Button>
                                    </Grid>
                                </Grid>
                                
                                <Grid item container alignItems='center' columnGap={1}>
                                    <Grid item xs={2}>
                                        <label>Frecuencia en dias:</label>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <TextField 
                                            size='small' 
                                            value={dataEdit.intervalBackups}
                                            onChange={e=>{setDataEdit({...dataEdit,intervalBackups:e.target.value})}}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item display='grid' justifyContent='center'>
                                <Button
                                    variant="contained"
                                    onClick={()=>{updateConfig()}}
                                >
                                    Guardar Configuracion
                                </Button>
                            </Grid>
                        </>
                    :
                        <>
                            <Grid item container rowSpacing={1}>
                                <Grid item container alignItems='center' columnGap={1}>
                                    <Grid item xs={2}>
                                        <label>Estado:</label>
                                    </Grid>
                                    <Grid item xs>
                                        <Button disabled className={data.statusBackups?'activo':'inactivo'}>
                                            {data.statusBackups?'Habilitado':'Suspendido'}
                                        </Button>
                                    </Grid>
                                </Grid>
                                
                                <Grid item container alignItems='center' columnGap={1}>
                                    <Grid item xs={2}>
                                        <label>Frecuencia en dias:</label>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <TextField disabled size='small' value={data.intervalBackups}/>
                                    </Grid>
                                </Grid>
                            </Grid>
                            </>
                    }
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}