import { Card, Grid, TextField, Dialog } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Main } from "../../../components/main";
import { StatusTree } from "../../../components/statusTree";
import { getOrderById, orderExternalById, orderInternalById } from "../../../utilities/allGetFetch";

import { useStyles } from "./pedidos.styles";

export const Details = () => {


    const classes = useStyles();

    const [data, setData] = useState();
    const [modal, setModal] = useState(false);
    const [jobModal, setJobModal] = useState({trabajo:'',cantidad_solicitada:'',detalle:''});
    const {id} = useParams();

    console.log(jobModal);

    const columns= [
        { field: 'index', headerName: 'N°', flex: 0.5  },
        { field: 'job', headerName: 'TRABAJO', flex: 1 },
        { field: 'requiredQuantity', headerName: 'CANTIDAD', flex: 1 },
        { field: 'status', headerName: 'ESTADO', flex: 1 },
      ];

    const openModal = (e) => {
        setJobModal({
            trabajo: e.row.job,
            detalle: data.details[(e.row.index)-1].detail,
            cantidad: e.row.requiredQuantity,
            ultimo: data.details[(e.row.index)-1].steps.slice(-1)[0].type,
            steps:data.details[(e.row.index)-1].steps
        });
        setModal(prev=>!prev)
    }

    const loadData = async() => {
        let response = await getOrderById(id);
        let details = response.details.map(item => {
            if(item.status === false)
                item.status = 'CANCELADO'
            else if(item.confirmed === false)
                item.status = 'NO CONFIRMADO'
            else 
                item.status = 'ACTIVO'
            return item                
        })
        response = {...response, details:details}
        setData(response);
    }

    console.log(data);

    useEffect(()=>{
        loadData();
    },[])
    
    return(data&&
        <Main>
            <Grid container justifyContent='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Detalle de Pedido</h1>
                            </Grid>
                            <Grid item container direction='column' rowSpacing={1}>
                                {data.confirmed!==undefined?<Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Institution</label></Grid>
                                    <Grid item xs> <TextField size='small' value={data.client}/></Grid>
                                </Grid>:
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Cliente:</label></Grid>
                                    <Grid item xs> <TextField size='small' value={data.client}/></Grid>
                                </Grid>}
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Fecha de Recepcion:</label></Grid>
                                    <Grid item xs> <TextField size='small' value={data.details[0].createdAt.slice(0,10)}/></Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                {(data!==204)?
                                    <DataGrid
                                        onRowClick={(e)=>{openModal(e)}}
                                        rows={data.details}
                                        columns={columns}
                                        getRowClassName={(params) =>
                                            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                        }
                                    />
                                    :
                                    <h3 style={{textAlign:'center'}}>No existen detalles para mostrar</h3>
                                }
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
                <Card>
                    <Grid container direction='column'>
                        <Grid item>
                            <h1 className={classes.titlePage}>Detalle del Trabajo</h1>
                        </Grid>
                        <Grid container columnSpacing={3}>
                            <Grid item xs={7} container direction='column' rowSpacing={1}>
                                <Grid item container  alignItems='center' columnSpacing={3}>
                                    <Grid item xs={3}><label>Trabajo:</label></Grid>
                                    <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.trabajo}/></Grid>
                                </Grid>
                                <Grid item container alignItems='center' columnSpacing={3}>
                                    <Grid item xs={3}><label>Cantidad:</label></Grid>
                                    <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.cantidad}/></Grid>
                                </Grid>
                                <Grid item container alignItems='flex-start' columnSpacing={3}>
                                    <Grid item xs={3}><label>Ultimo estado:</label></Grid>
                                    <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.ultimo}/></Grid>
                                </Grid>
                                {jobModal.detalle!==''&&
                                    <Grid item container alignItems='flex-start' columnSpacing={3}>
                                        <Grid item xs={3}><label>Detalle:</label></Grid>
                                        <Grid item xs> <TextField disabled multiline  size='small' defaultValue={jobModal.detalle}/></Grid>
                                    </Grid>
                                }
                            </Grid>
                            <Grid item xs={5}>
                                <StatusTree steps={jobModal.steps}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
        </Main>
    )
}