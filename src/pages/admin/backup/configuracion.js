import { Button, Card, Grid, TextField } from "@mui/material"
import { Main } from "../../../components/main"
import { useStyles } from "../admin.styles";


export const Configuracion = () => {

    const classes = useStyles();

    return (
        <Main>
            <Card>
                <Grid container direction='column' rowSpacing={2}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Configuracion de Copias de Respaldos</h1>
                    </Grid>
                    <Grid item container rowSpacing={1}>
                        <Grid item container alignItems='center' columnGap={1}>
                            <Grid item xs={2}>
                                <label>Estado:</label>
                            </Grid>
                            <Grid item xs>
                                <Button className="activo">
                                    Habilitado
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems='center' columnGap={1}>
                            <Grid item xs={2}>
                                <label>Tipo:</label>
                            </Grid>
                            <Grid item xs>
                                <TextField size='small' value='Completo'/>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems='center' columnGap={1}>
                            <Grid item xs={2}>
                                <label>Frecuencia:</label>
                            </Grid>
                            <Grid item xs='auto'>
                                <TextField size='small' value='10'/>
                            </Grid>
                            <Grid item xs='auto'>
                                <TextField size='small' value='Dias'/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item display='grid' justifyContent='center'>
                        <Button>
                            Guardar Configuracion
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Main>
    )
}