
import { Button, Card, Dialog, Grid, Switch, TextField, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { clientById, employeeById, getEquipmentById, materialsById } from "../../../utilities/allGetFetch";
import { updateClient, updateEmployee, updateEquipment, updateMaterial } from "../../../utilities/allPutFetch";
import { useStyles } from "./equipment.styles";
export const DetailsEquipment = () => {

    const {id} = useParams();

    const [data, setData] = useState();
    const [status, setStatus] = useState();
    const [editionMode, setEditionMode] = useState(false);
    const [dialog, setDialog] = useState(false);

    const loadData = async() => {
        let response = await getEquipmentById(id);
        setStatus(response.status);
        setData(response);
    }

    const editEquipment = async () => {
        const newData = {
            "name": document.getElementById('nameForm').value,
            "brand": document.getElementById('brandForm').value,
            "status": status,
        }
        updateEquipment(id, newData, data);
        setEditionMode(false);
        loadData();
    }

    useEffect(()=>{
        loadData();
    },[]);

    const classes = useStyles();

    return (
        data&&<Main>
            <Dialog open={dialog} onClose={()=>{setDialog(false)}}>
                <Card>
                    <h2>¿Esta seguro de editar los valores?</h2>
                    <Grid container >
                        <Grid item xs display='flex' justifyContent='center'>
                            <Button className="activo" onClick={()=>{editEquipment(); setDialog(false);}}>Editar</Button>
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
                        <Grid container direction='column' rowSpacing={3}>

                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Detalles de Equipo
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
                                        <label>Marca:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="brandForm" size='small' defaultValue={data.brand}/>
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
                                        <label>Marca:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField disabled size='small' value={data.brand}/>
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
                    </Card>
                </Grid>
            </Grid>
        </Main>

        ///Employees

        
        
    )
}