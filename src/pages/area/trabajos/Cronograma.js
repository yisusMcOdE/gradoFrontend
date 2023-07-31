import { Card, Grid, TextField, Autocomplete } from "@mui/material"
import { useState } from "react"
import { MyGantt } from "../../../components/gantt"
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles"

export const Cronograma = () => {

    const [areaType, setAreaType] = useState('Todos');

    const classes = useStyles();

    return (<>
        <Main>
            <Grid container justifyContent='center'>
                <Grid item style={{width:'80%'}}>
                    <Card>
                        <Grid container direction='column' rowSpacing={2}>
                            <Grid item xs>
                                <h1 className={classes.titlePage}>Cronograma</h1>
                            </Grid>
                            <Grid item xs container alignItems='center' columnSpacing={1}>
                                <Grid item xs={1}>
                                    <label>Area:</label>
                                </Grid>
                                <Grid item xs={3}>
                                    <Autocomplete
                                    size='small'
                                    disablePortal
                                    defaultValue='Todos'
                                    value={areaType}
                                    onChange={(e)=>{
                                        setAreaType(e.target.innerText)
                                    }}
                                    options={['Todos', 'Impresion', 'Offset', 'Empastado']}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params}/>}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs className={classes.ganttContainer}>
                                <MyGantt type={areaType}/>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Main>
    </>)
}