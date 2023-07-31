import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientExternalById, clientInternalById, employeeById } from "../../../utilities/allGetFetch";
import { updateClient, updateClientExternal, updateEmployee } from "../../../utilities/allPutFetch";
import { useStyles } from "../recepcion.styles";
export const DetailsClientRecepcion = () => {

    const {id} = useParams();

    const [data, setData] = useState();
    const [status, setStatus] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [clientInternal, setClientInternal] = useState(false);

    const loadData = async() => {
        let response = await clientInternalById(id);
        if(response !== 404){
            setClientInternal(true);
            setStatus(response.status);
            setData(response);
        }else{
            response = await clientExternalById(id);
            setClientInternal(false);
            setStatus(response.status);
            setData(response);
        }
    }

    const editUser = async () => {
        const newData = {
            "name": document.getElementById('nameForm').value,
            "email": document.getElementById('emailForm').value,
            "phone": document.getElementById('phoneForm').value,
            "status": status,
        }
        updateClientExternal(id, newData, data);
        setEditionMode(false);
        loadData();
        
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
            <Grid container justifyContent='center'>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>

                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Detalle de Cliente
                                </h1>
                            </Grid>


                            {!clientInternal&&<Grid item container alignItems='center' justifyContent='flex-end'>
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
                            </Grid>}

                            {
                                ///------FIELDS------///
                            }

                            {editionMode?
                            
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre Completo</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="nameForm" size='small' defaultValue={data.name}/>
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
                                        <label>{clientInternal?'Institucion :':'Nombre Completo:'}</label>
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
                                <Button onClick={()=>{setDialog(true)}}>Guardar</Button>
                            </Grid>}
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            
        </Main>

        ///Employees

        
        
    )
}