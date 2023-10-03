import { Alert, Backdrop, Button, Card, CircularProgress, Grid, Snackbar, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Main } from "../../../components/main";
import { getConfigBackup } from "../../../utilities/allGetFetch";
import { updateConfigBackup } from "../../../utilities/allPostFetch";
import { useStyles } from "../admin.styles";



export const Configuracion = () => {

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({open:false, severity:'', message:''});

    const [data, setData] = useState();
    const [dataEdit, setDataEdit] = useState();
    const [editionMode, setEditionMode] = useState(false);

    const handleResponse = async(response) => {
        if(response.status === 202){
            setAlert({open:true, severity:'success', message:'202: Actualizado'});
            setEditionMode(false);
            loadData();
        }
        if(response.status === 404){
            setAlert({open:true, severity:'error', message:'404: No encontrado'});
        }
        if(response.status === 409){
            setAlert({open:true, severity:'warning', message:'409: Conflicto'});
        }
        if(response.status === 304){
            setAlert({open:true, severity:'warning', message:'304: No Modificado'})
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
            status:dataEdit.status, 
            interval:dataEdit.interval
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={alert.open}
                onClose={()=>{setAlert({...alert, open:false})}}
                autoHideDuration={3000}
            >
                <Alert variant='filled' severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
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
                                            className={dataEdit.status?'activo':'inactivo'}
                                            onClick={e=>{setDataEdit({...dataEdit, status:!dataEdit.status})}}
                                        >
                                            {dataEdit.status?'Habilitado':'Suspendido'}
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
                                            value={dataEdit.interval}
                                            onChange={e=>{setDataEdit({...dataEdit,interval:e.target.value})}}
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
                                        <Button disabled className={data.status?'activo':'inactivo'}>
                                            {data.status?'Habilitado':'Suspendido'}
                                        </Button>
                                    </Grid>
                                </Grid>
                                
                                <Grid item container alignItems='center' columnGap={1}>
                                    <Grid item xs={2}>
                                        <label>Frecuencia en dias:</label>
                                    </Grid>
                                    <Grid item xs='auto'>
                                        <TextField disabled size='small' value={data.interval}/>
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