import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientInternalById, employeeById } from "../../../utilities/allGetFetch";
import { updateClientInternal, updateEmployee } from "../../../utilities/allPutFetch";
import { useStyles } from "../admin.styles";
export const DetailsClient = () => {

    const {id} = useParams();

    const [data, setData] = useState();
    const [status, setStatus] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [dialog, setDialog] = useState(false);

    const loadData = async() => {
        let response = await clientInternalById(id);
        if(response !== 404){
            setStatus(response.status);
            console.log(response);
            setData(response);
        }else{
            response = await employeeById(id);
            setStatus(response.status);
            console.log(response);
            setData(response);
        }
    }

    const editUser = async () => {

        if(data.role==='cliente'){
            const newData = {
                "institution": document.getElementById('nameForm').value,
                "email": document.getElementById('emailForm').value,
                "address": document.getElementById('addressForm').value,
                "phone": document.getElementById('phoneForm').value,
                "status": status,
            }
            updateClientInternal(id, newData, data);
            setEditionMode(false);
            loadData();
        }else{
            const newData = {
                "name": document.getElementById('nameForm').value,
                "email": document.getElementById('emailForm').value,
                "phone": document.getElementById('phoneForm').value,
                "role": document.getElementById('roleForm').value,
                "status": status,
            }
            updateEmployee(id, newData, data);
            setEditionMode(false);
            loadData();
        }

        
        
    }

    useEffect(()=>{
        loadData();
    },[]);

    const classes = useStyles();

    return (
        data&&
        <Main>
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
                    <Grid container direction='column' rowSpacing={3}>
                        {
                            ///------TITLE------///
                        }
                        <Grid item>
                            <h1 className={classes.titlePage}>
                                {data.role==='cliente'?'Detalles de Cliente': 'Detalles de empleado'}
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
                                    <label>Nombre Completo:</label>
                                </Grid>
                                <Grid item >
                                    <TextField id="nameForm" size='small' defaultValue={data.name || data.institution}/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Correo Electronico:</label>
                                </Grid>
                                <Grid item >
                                    <TextField id="emailForm" size='small' defaultValue={data.email}/>
                                </Grid>
                            </Grid>
                            {data.role==='cliente'&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Direccion:</label>
                                </Grid>
                                <Grid item >
                                    <TextField id='addressForm'  size='small' defaultValue={data.address}/>
                                </Grid>
                            </Grid>}
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Telefono:</label>
                                </Grid>
                                <Grid item >
                                    <TextField id='phoneForm'  size='small' defaultValue={data.phone}/>
                                </Grid>
                            </Grid>
                            {data.role!=='cliente'&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Role:</label>
                                </Grid>
                                <Grid item >
                                    <Autocomplete
                                    size='small'
                                    id="roleForm"
                                    options={['area','recepcion','direccion','admin']}
                                    sx={{ width: 150 }}
                                    renderInput={(params) => <TextField {...params}/>}
                                    defaultValue={data.role}
                                    />
                                </Grid>
                            </Grid>}
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Estado:</label>
                                </Grid>
                                <Grid item >
                                    <Button 
                                        className={status?'activo':'inactivo'}
                                        onClick={()=>{setStatus(prev => !prev)}}
                                    >
                                            {status?'Activo':'Inhabilitado'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>


                        :


                        <Grid item container direction='column' rowSpacing={1}>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Nombre Completo:</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.name || data.institution}/>
                                </Grid>
                            </Grid>
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Correo Electronico:</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.email}/>
                                </Grid>
                            </Grid>
                            {data.role==='cliente'&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Direccion:</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.address}/>
                                </Grid>
                            </Grid>}
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Telefono:</label>
                                </Grid>
                                <Grid item >
                                    <TextField disabled size='small' value={data.phone}/>
                                </Grid>
                            </Grid>
                            {data.role!=='cliente'&&<Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Role:</label>
                                </Grid>
                                <Grid item >
                                    <Autocomplete
                                    size='small'
                                    disabled
                                    id="combo-box-demo"
                                    options={['area','recepcion','direccion','admin']}
                                    sx={{ width: 150 }}
                                    renderInput={(params) => <TextField {...params}/>}
                                    defaultValue={data.role}
                                    />
                                </Grid>
                            </Grid>}
                            <Grid item container alignItems='center'>
                                <Grid item xs={4}>
                                    <label>Estado:</label>
                                </Grid>
                                <Grid item >
                                    <Button className={data.status?'activo':'inactivo'}>{data.status?'Activo':'Inhabilitado'}</Button>
                                </Grid>
                            </Grid>
                        </Grid>}
                        {editionMode&&<Grid item container justifyContent='center'>
                            <Button variant='contained' onClick={()=>{setDialog(true)}}>Guardar</Button>
                        </Grid>}
                    </Grid>
                </Card>
                </Grid>

            </Grid>
            
        </Main>

        ///Employees

        
        
    )
}