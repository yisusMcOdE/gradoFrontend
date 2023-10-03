import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientById, employeeById, materialsById } from "../../../utilities/allGetFetch";
import { updateClient, updateEmployee, updateMaterial } from "../../../utilities/allPutFetch";
import { useStyles } from "../admin.styles";
export const DetailsMaterialAdmin = () => {

    const {id} = useParams();

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({open:false, severity:'', message:''});

    const [data, setData] = useState();
    const [status, setStatus] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [dialog, setDialog] = useState(false);


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
        let response = await materialsById(id);

        setStatus(response.status);
        setData(response);

        if(response !== 204){
            setStatus(response.status);
            setData(response);
        }else {
            setData(204)
        }
    }

    const editMaterial = async () => {
        const newData = {
            "name": document.getElementById('nameForm').value,
            "unit": document.getElementById('unitForm').value,
            "status": status,
        }
        setLoading(true);
        const response = await updateMaterial(id, newData, data);
        setLoading(false);
        handleResponse(response);

    }

    useEffect(()=>{
        loadData();
    },[]);

    const classes = useStyles();

    return (
        data&&<Main>
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

            <Dialog open={dialog} onClose={()=>{setDialog(false)}}>
                <Card>
                    <h2>¿Esta seguro de editar los valores?</h2>
                    <Grid container >
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button className="activo" onClick={()=>{editMaterial(); setDialog(false);}}>Editar</Button>
                        </Grid>
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button className="inactivo" onClick={()=>{setDialog(false)}}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
            <Grid container direction={'column'} alignItems={'center'}>
                <Grid item>
                    <Card>
                        {data!==204?
                            <Grid container direction='column' rowSpacing={3}>

                                {
                                    ///------TITLE------///
                                }
                                <Grid item>
                                    <h1 className={classes.titlePage}>
                                        Detalles de Material
                                    </h1>
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
                                                setStatus(data.status);
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                {
                                    ///------FIELDS------///
                                }

                                {editionMode?
                                
                                <Grid item container direction='column' rowSpacing={1}>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Nombre:</label>
                                        </Grid>
                                        <Grid item >
                                            <TextField id="nameForm" size='small' defaultValue={data.name}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Unidad de Medida:</label>
                                        </Grid>
                                        <Grid item >
                                            <TextField id="unitForm" size='small' defaultValue={data.unit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Estado:</label>
                                        </Grid>
                                        <Grid item >
                                            <Button
                                                className={status?'activo':'inactivo'}
                                                onClick={()=>{setStatus(prev => !prev)}}
                                            >
                                                    {status?'Activo':'Suspendido'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                :

                                <Grid item container direction='column' rowSpacing={1}>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Nombre:</label>
                                        </Grid>
                                        <Grid item >
                                            <TextField disabled size='small' value={data.name}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Unidad de Medida:</label>
                                        </Grid>
                                        <Grid item >
                                            <TextField disabled size='small' value={data.unit}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Estado:</label>
                                        </Grid>
                                        <Grid item >
                                            <Button disabled={true} className={data.status?'activo':'inactivo'}>{data.status?'Activo':'Suspendido'}</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>}
                                {editionMode&&<Grid item container justifyContent='center'>
                                    <Button variant="contained" onClick={()=>{setDialog(true)}}>Guardar</Button>
                                </Grid>}
                            </Grid>
                        :
                            <h3>Material no Encontrado</h3>
                        }
                    </Card>
                </Grid>
            </Grid>
        </Main>

        ///Employees

        
        
    )
}