import { Autocomplete, Box, Button, Card, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Main } from "../../../components/main"
import { AddEquipment, createClient, createEmployee, createMaterial } from "../../../utilities/allPostFetch"
import { useStyles } from "./equipment.styles"

export const CreateEquipment = () => {

    const navigator = useNavigate();

    const classes = useStyles();

    const createEquipment = () => {
        const data = {
            name: document.getElementById('nameForm').value,
            brand: document.getElementById('brandForm').value,
            status: true,
        }
        AddEquipment(data);
        navigator('/area/equipamiento');
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
                                    Crear Equipo
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
                                        <label>Marca:</label>
                                    </Grid>
                                    <Grid item >
                                        <TextField id="brandForm" size='small' />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item container justifyContent='center'>
                                <Button variant="contained" onClick={()=>{createEquipment()}}>Crear</Button>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    )
}