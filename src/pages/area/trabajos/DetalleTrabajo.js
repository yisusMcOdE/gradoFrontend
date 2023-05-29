import { Button, Card, Collapse, Dialog, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { StatusTree } from '../../../components/statusTree';
import { useStyles } from '../area.styles';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

export const DetalleTrabajo = () => {

    const data = require('../../../__mock__/pedido_listo.json')[0];
    const [modal, setModal] = useState(false);
    const [delayMenu, setDelayMenu] = useState(false);
    const [jobModal, setJobModal] = useState({trabajo:'',cantidad_solicitada:'',detalle:''});
    const classes = useStyles();
    const {id} = useParams();

    const columns= [
        { field: 'id', headerName: 'N°', flex: 0.5  },
        { field: 'trabajo', headerName: 'TRABAJO', flex: 1 },
        { field: 'cantidad_solicitada', headerName: 'CANTIDAD', flex: 1 },
      ];

    const openModal = (e) => {
        setJobModal({
            trabajo: e.row.trabajo,
            detalle: 'Parte, hecho o circunstancia que contribuye a formar o completar una cosa pero no es indispensable en ella.',
            cantidad: e.row.cantidad_solicitada
        });
        setModal(prev=>!prev)
    }


    return(
        <>
            <Grid container >
                <Grid item xs justifyContent='center' display='grid'>
                    <Card className={classes.detalleContainer}>
                        <Grid container direction='column' rowSpacing={3}>
                            <Grid item>
                                <h1 className={classes.titlePage}>Pedido</h1>
                            </Grid>
                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Id de Pedido:</label></Grid>
                                    <Grid item xs> <TextField size='small' defaultValue={id}/></Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Institucion:</label></Grid>
                                    <Grid item xs> <TextField size='small' defaultValue={data.cliente}/></Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Cliente:</label></Grid>
                                    <Grid item xs> <TextField size='small' defaultValue={data.cliente}/></Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={3}><label>Fecha de Recepcion:</label></Grid>
                                    <Grid item xs> <TextField size='small' defaultValue={data.fecha_entrega}/></Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <DataGrid
                                    onRowClick={(e)=>{openModal(e)}}
                                    rows={data.detalle}
                                    columns={columns}
                                    getRowClassName={(params) =>
                                        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>disabled
            <Dialog onClose={()=>{setModal(prev => !prev)}} open={modal}>
                <Card style={{overflowY:'scroll'}}>
                    <Grid container direction='column' rowSpacing={2}>
                        <Grid item>
                            <h1 className={classes.titlePage}>Detalle del Trabajo</h1>
                        </Grid>
                        <Grid container columnSpacing={3}>
                            <Grid item xs={8} container direction='column' rowSpacing={1}>
                                <Grid item container  alignItems='center' columnSpacing={3}>
                                    <Grid item xs={3}><label>Trabajo:</label></Grid>
                                    <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.trabajo}/></Grid>
                                </Grid>
                                <Grid item container alignItems='center' columnSpacing={3}>
                                    <Grid item xs={3}><label>Cantidad:</label></Grid>
                                    <Grid item xs> <TextField disabled size='small' defaultValue={jobModal.cantidad}/></Grid>
                                </Grid>
                                <Grid item container alignItems='flex-start' columnSpacing={3}>
                                    <Grid item xs={3}><label>Detalle:</label></Grid>
                                    <Grid item xs> <TextField disabled fullWidth multiline  size='small' defaultValue={jobModal.detalle}/></Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4}>
                                <StatusTree />
                            </Grid>
                        </Grid>
                        <Grid item container direction='column' rowSpacing={3}>
                            <Grid item display='flex' justifyContent='center'>
                                <Button 
                                    style={{background:'red'}} 
                                    startIcon={<MoreTimeIcon/>}
                                    onClick={()=>{setDelayMenu(prev => !prev)}}
                                >
                                        Crear Retraso
                                </Button>
                            </Grid>
                            <Grid item display='flex' justifyContent='center' >
                                <Collapse in={delayMenu} style={{border:'1px solid white', padding:'1rem', borderRadius:'5px'}}>
                                    <Grid container direction='column' rowSpacing={2}>
                                        <Grid item container columnGap={3}>
                                            <Grid item xs={5}>
                                                <label>Dias de retraso:</label>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField type='number' size='small' style={{width:'100px'}}/>
                                            </Grid>
                                        </Grid>
                                        <Grid item container columnGap={3}>
                                            <Grid item xs={5}>
                                                <label>Justificacion de retraso:</label>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField multiline size='small'/>
                                            </Grid>
                                        </Grid>
                                        <Grid item display='flex' justifyContent='flex-end'>
                                            <Button style={{background:'red'}}>Crear</Button>
                                        </Grid>
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Dialog>
        </>
    )
}