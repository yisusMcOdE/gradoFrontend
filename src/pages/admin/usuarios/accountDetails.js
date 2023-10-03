import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete, Backdrop, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientInternalById, employeeById, getUserById } from "../../../utilities/allGetFetch";
import { updateClientInternal, updateEmployee, updateUser } from "../../../utilities/allPutFetch";
import { useStyles } from "../admin.styles";


export const AccountDetails = () => {

    const {id} = useParams();
    const initialInput = {error:false, value:''}

    const [loading, setLoading] = useState(false);
    const [alert,setAlert] = useState({open:false, severity:'', message:''});

    const [data, setData] = useState();
    const [dataEdit, setDataEdit] = useState();
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
        let response = await getUserById(id);

        if(response !== 204){
            setData({...response});
            setDataEdit({
                ...response,
                user:{error:false, value : response.user},
                password:{error:false, value : response.password},
                role:{error:false, value : response.role}
            });
        }else {
            setData(204)
        }
    }

    console.log(dataEdit);

    const editUser = async () => {

        ///Validacion
        let error = false

        if(dataEdit.user.value===''){
            setDataEdit({...dataEdit, user:{error:true, value:''}})
            error = true
        }
        if(dataEdit.password.value===''){
            setDataEdit({...dataEdit, password:{error:true, value:''}})
            error = true
        }
        if(dataEdit.role.value===''){
            setDataEdit({...dataEdit, role:{error:true, value:''}})
            error = true
        }

        if(!error){
            console.log('sin errores')
            const newData = {
                user:dataEdit.user.value,
                password:dataEdit.password.value,
                role:data.role==='Cliente'?'Cliente':dataEdit.role.value,
                status:dataEdit.status
            }
            setLoading(true);
            const response = await updateUser(id, newData, data);
            setLoading(false);
            handleResponse(response);
        }else{
            setAlert({open:true, severity:'error', message:'Formulario Invalido*'})
        }
    }

    useEffect(()=>{
        loadData();
    },[]);

    const classes = useStyles();

    return (
        (data&&dataEdit) &&
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

            <Dialog open={dialog} onClose={()=>{setDialog(false)}}>
                <Card>
                    <h2>¿Esta seguro de editar los valores?</h2>
                    <Grid container >
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button className="activo" onClick={()=>{editUser(); setDialog(false);}}>Editar</Button>
                        </Grid>
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button className="inactivo" onClick={()=>{setDialog(false)}}>Cancelar</Button>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
            <Grid container direction='column' alignItems={'center'}>
                <Grid item >
                <Card>
                    {data!==204?
                        <Grid container direction='column' rowSpacing={3}>
                        {
                            ///------TITLE------///
                        }
                        <Grid item>
                            <h1 className={classes.titlePage}>
                                Detalles de Cuenta
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
                                    <label>Usuario</label>
                                </Grid>
                                <Grid item >
                                    <TextField
                                        value={dataEdit.user.value}
                                        onChange={(e)=>{setDataEdit({...dataEdit, user:{error:false, value:e.target.value}})}}
                                        error={dataEdit.user.error}
                                        required
                                        label='Requerido'
                                        size='small' 
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Password</label>
                                </Grid>
                                <Grid item >
                                <TextField
                                        value={dataEdit.password.value}
                                        onChange={(e)=>{setDataEdit({...dataEdit, password:{error:false, value:e.target.value}})}}
                                        error={dataEdit.password.error}
                                        required
                                        label='Requerido'
                                        size='small' 
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Role:</label>
                                </Grid>
                                <Grid item >
                                    <Autocomplete
                                        size='small'
                                        value={dataEdit.role.value}
                                        onChange={(e)=>{setDataEdit({...dataEdit, role:{error:false, value:e.target.textContent}})}}
                                        disabled = {(data.role==='Cliente')}
                                        options={['Area','Recepcion','Direccion','Administracion']}
                                        sx={{ width: 150 }}
                                        renderInput={(params) => <TextField
                                            error={dataEdit.role.error}
                                            required
                                            label='Requerido'
                                            {...params}
                                        />}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Estado:</label>
                                </Grid>
                                <Grid item >
                                    <Button 
                                        className={dataEdit.status?'activo':'inactivo'}
                                        onClick={()=>{setDataEdit({...dataEdit, status:!dataEdit.status})}}
                                    >
                                            {dataEdit.status?'Activo':'Suspendido'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>


                        :


                        <Grid item container direction='column' rowSpacing={1}>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Usuario</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.user}/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Password</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.password}/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Role:</label>
                                </Grid>
                                <Grid item >
                                    <Autocomplete
                                        size='small'
                                        disabled
                                        options={['area','recepcion','direccion','admin']}
                                        sx={{ width: 150 }}
                                        renderInput={(params) => <TextField {...params}/>}
                                        defaultValue={data.role}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Estado:</label>
                                </Grid>
                                <Grid item >
                                    <Button className={data.status?'activo':'inactivo'}>{data.status?'Activo':'Suspendido'}</Button>
                                </Grid>
                            </Grid>
                        </Grid>}
                        {editionMode&&<Grid item container justifyContent='center'>
                            <Button variant='contained' onClick={()=>{setDialog(true)}}>Guardar</Button>
                        </Grid>}
                        </Grid>
                    :
                        <h3>Usuario no Encontrado</h3>
                    }
                </Card>
                </Grid>

            </Grid>
            
        </Main>

        ///Employees

        
        
    )
}