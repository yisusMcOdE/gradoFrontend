import { Button, Card, Grid, TextField, Box, IconButton, Autocomplete } from "@mui/material"
import { useState } from "react"
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export const Finalizar = () => {

    const materialInicial = {
        material: '',
        cantidad: ''
    }

    const [sobrantes, setSobrantes] = useState([materialInicial]);

    const addDetail = () => {
        setSobrantes([...sobrantes, materialInicial])
    };

    const removeDetail = () => {
        const details = [...sobrantes];
        if(details.length>1){
            details.pop();
        }
        setSobrantes([...details]);
    }

    const DetailsBox = () => {
        return (
            <Grid container>

                <Grid item xs={12} className={classes.tableHeader} style={{borderRadius:'10px 10px 0 0'}}>
                    <h3 style={{textAlign:'center'}}>REGISTRO DE MATERIAL SOBRANTE</h3>
                </Grid>

                <Box display='flex' className={classes.addRemoveBox} columnGap={2}>
                    <IconButton size="small" onClick={addDetail}>
                        <AddIcon fontSize="inherit"/>
                    </IconButton>
                    <IconButton size="small" onClick={removeDetail}>
                        <RemoveIcon fontSize="inherit"/>
                    </IconButton>
                </Box>

                <Grid item xs={12} className={classes.tableHeader} container>
                    <Grid item xs={1}>
                        <h3>N°</h3>
                    </Grid>
                    <Grid item xs={7}>
                        <h3>Material</h3>
                    </Grid>
                    <Grid item xs={4}>
                        <h3>Cantidad</h3>
                    </Grid>
                </Grid>

                {sobrantes.map((item,index)=>{
                    return (
                    <Grid container className={classes.tableBody} style={index%2===0?{background:'#D7D7D7'}:{background:'#FFFFFF'}}>
                        <Grid item xs={1}>
                            {index+1}
                        </Grid>
                        <Grid item xs={7}> 
                            <Autocomplete
                            size='small'
                            disablePortal
                            id="combo-box-demo"
                            fullWidth
                            renderInput={(params) => <TextField {...params}/>}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField fullWidth multiline id="filled-basic" variant="filled" size='small' />
                        </Grid>
                    </Grid>
                    )
                })}
            </Grid>
        )
    }

    const classes = useStyles();
    return (
        <Main>
            <Card>
                <Grid container direction='column' rowSpacing={3}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Finalizar Trabajo</h1>
                    </Grid>
                    <Grid container item direction='column' rowSpacing={1}>
                        <Grid item container  alignItems='center'>
                            <Grid item xs={2}>
                                <label>Trabajo:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small'/>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems='center'>
                            <Grid item xs={2}>
                                <label>Para:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small'/>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems='center'>
                            <Grid item xs={2}>
                                <label>Detalle:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small'/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container direction='column' rowSpacing={2}>
                        <Grid item>
                            <h2 className={classes.titlePage}>Registro de material sobrante</h2>
                        </Grid>
                        <Grid item>
                            <DetailsBox/>
                        </Grid>
                        <Grid item justifyContent='center' display='flex'>
                            <Button>Finalizar</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
        </Main>
    )
}