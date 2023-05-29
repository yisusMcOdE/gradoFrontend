import { Card, Grid } from "@mui/material"
import { Gantt } from "../../../components/gantt"
import { Main } from "../../../components/main"
import { useStyles } from "../area.styles"

export const Cronograma = () => {

    const classes = useStyles();

    return (<>
        <Main>
            <Card>
                <Grid container direction='column' style={{width:'60rem'}}>
                    <Grid item>
                        <h1 className={classes.titlePage}>Cronograma</h1>
                    </Grid>
                    <Grid item className={classes.ganttContainer}>
                        <Gantt/>
                    </Grid>
                </Grid>
            </Card>
        </Main>
    </>)
}