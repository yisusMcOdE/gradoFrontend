import { Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { createClient, createEmployee, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "../admin.styles"

export const CreateMaterial = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const createUser = () => {
        const data = {
            name: document.getElementById('nameForm').value,
            unit: document.getElementById('unitForm').value,
            status: true,
        }
        createMaterial(data);
        navigator('/admin/materiales');
    }

    return(
        <Main>
            <Grid container direction={'column'} rowGap={2} alignItems={'center'}>
                <Grid item>
                    <Card>
                        <Grid container direction='column' rowSpacing={3}>
                            {
                                ///------TITLE------///
                            }
                            <Grid item>
                                <h1 className={classes.titlePage}>
                                    Crear Material
                                </h1>
                            </Grid>

                            <Grid item container direction='column' rowSpacing={1}>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Nombre:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="nameForm" size='small' />
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems='center'>
                                    <Grid item xs={4}>
                                        <label>Unidad de medida:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="unitForm" size='small' />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{createUser()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}