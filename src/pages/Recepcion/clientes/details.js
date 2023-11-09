import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientById, clientExternalById, clientInternalById, employeeById } from "../../../utilities/allGetFetch";
import { updateClient, updateClientExternal, updateClientInternal, updateEmployee } from "../../../utilities/allPutFetch";
import { useStyles } from "../recepcion.styles";
export const DetailsClientRecepcion = () => {

    const {id} = useParams();

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);

    const [data, setData] = useState();
    const [dataEdition, setDataEdition] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [institution, setInstitution] = useState(false);


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

    console.log(dataEdition);

    const loadData = async() => {
        let response = await clientById(id);
        if(response!==204){
            setData(response);
            if(response.institution)
                setInstitution(true);
            if(response.institution)
                setDataEdition({
                    institution : {error : false, value : response.institution},
                    email : {error : false, value : response.email},
                    courier : {error : false, value : response.courier},
                    phone : {error : false, value : response.phone},
                    address : {error : false, value : response.address},
                    status : response.status
                })
            else
                setDataEdition({
                    title: {error : false, value : response.title},
                    ci : {error : false, value : response.ci},
                    name : {error : false, value : response.name},
                    phone : {error : false, value : response.phone},
                    email : {error : false, value : response.email},
                    status : response.status
                })
        }else
            setData(204)
        
    }

    const editUser = async () => {

        ///Validation
        let error = false;
        if(institution){
            if(dataEdition.institution.value===''){
                setDataEdition({...dataEdition, institution:{error:true, value:''}})
                error=true;
            }
            if(dataEdition.courier.value===''){
                setDataEdition({...dataEdition, courier:{error:true, value:''}})
                error=true;
            }
        }else{
            if(dataEdition.name.value===''){
                setDataEdition({...dataEdition, name:{error:true, value:''}})
                error=true;
            }
            if(dataEdition.ci.value===''){
                setDataEdition({...dataEdition, ci:{error:true, value:''}})
                error=true;
            }
        }
        if(!error){
            let newData = {}
            if(institution){
                newData = {
                    institution : dataEdition.institution.value,
                    email : dataEdition.email.value,
                    address : dataEdition.address.value,
                    courier : dataEdition.courier.value,
                    phone : dataEdition.phone.value,
                    status : dataEdition.status
                }
                setLoading(true);
                const response = await updateClientInternal(id, newData, data);
                setLoading(false);
                handleResponse(response);
            }
            else{
                newData = {
                    ci : dataEdition.ci.value,
                    name : dataEdition.name.value,
                    phone : dataEdition.phone.value,
                    email : dataEdition.email.value,
                    status : dataEdition.status
                }
                setLoading(true);
                const response = await updateClientExternal(id, newData, data);
                setLoading(false);
                handleResponse(response);
            }
        }else{
            enqueueSnackbar('Formulario Invalido * ',{variant:'error'});            
        }
    }

    useEffect(()=>{
        loadData();
    },[]);

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
            <Grid container justifyContent='center'>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>

                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    {institution?'Detalle de Institucion':'Detalle de Cliente'}
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
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {
                                ///------FIELDS------///
                            }

                            {editionMode?
                            
                            <Grid item container direction='column' rowSpacing={1}>
                                {institution?<>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Institucion</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.institution.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, institution:{error:false, value:e.target.value}})}}
                                                error={dataEdition.institution.error}
                                                required
                                                label='Requerido'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Mensajero</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.courier.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, courier:{error:false, value:e.target.value}})}}
                                                error={dataEdition.courier.error}
                                                required
                                                label='Requerido'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Correo</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.email.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, email:{error:false, value:e.target.value}})}}
                                                label='Opccional'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Telefono</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.phone.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, phone:{error:false, value:e.target.value}})}}
                                                label='Opccional'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Direccion</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.address.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, address:{error:false, value:e.target.value}})}}
                                                label='Opccional'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Estado:</label>
                                        </Grid>
                                        <Grid item >
                                            <Button 
                                                className={dataEdition.status?'activo':'inactivo'}
                                                onClick={()=>{setDataEdition({...dataEdition, status:!dataEdition.status})}}
                                            >
                                                    {dataEdition.status?'Activo':'Suspendido'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    
                                </>:<>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Titulo</label>
                                        </Grid>
                                        <Grid item xs>
                                            <Autocomplete
                                                fullWidth
                                                size='small'
                                                value={dataEdition.title.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, title:{error:false, value:e.target.value}})}}
                                                options={['Señor', 'Señora']}
                                                renderInput={(params) =><TextField
                                                                            error={dataEdition.title.error}
                                                                            required
                                                                            label='Requerido'
                                                                            variant="standard"
                                                                            {...params}
                                                                        />}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Nombre</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.name.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, name:{error:false, value:e.target.value}})}}
                                                error={dataEdition.name.error}
                                                required
                                                label='Requerido'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>C.I.</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.ci.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, ci:{error:false, value:e.target.value}})}}
                                                error={dataEdition.ci.error}
                                                required
                                                label='Requerido'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Telefono</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                value={dataEdition.phone.value}
                                                onChange={(e)=>{setDataEdition({...dataEdition, phone:{error:false, value:e.target.value}})}}
                                                label='Opccional'
                                                size='small' 
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Estado:</label>
                                        </Grid>
                                        <Grid item >
                                            <Button 
                                                className={dataEdition.status?'activo':'inactivo'}
                                                onClick={()=>{setDataEdition({...dataEdition, status:!dataEdition.status})}}
                                            >
                                                    {dataEdition.status?'Activo':'Suspendido'}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </>
                                }
                            </Grid>
                            :

                            <Grid item container direction='column' rowSpacing={1}>
                                {institution?<>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Institucion</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.institution}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Mensajero</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.courier}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Correo</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.email}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Telefono</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.phone}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Direccion</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.address}/>
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
                                </>:<>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Titulo</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.title}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Nombre</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.name}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>C.I.</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.ci}/>
                                        </Grid>
                                    </Grid>
                                    <Grid item container alignItems='center'>
                                        <Grid item xs={4}>
                                            <label>Telefono</label>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField 
                                                disabled 
                                                size='small' 
                                                value={data.phone}/>
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
                                </>
                                }
                            </Grid>}
                            {editionMode&&<Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{setDialog(true)}}>Guardar</Button>
                            </Grid>}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            
        </Main>

        ///Employees

        
        
    )
}