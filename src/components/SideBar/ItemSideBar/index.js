import { useState } from "react";
import { ListItemButton, ListItemIcon, ListItemText, Collapse, List } from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useStyles } from "./itemSideBar.styles";
import { useNavigate } from "react-router-dom";

export const ItemSideBar = ({icons, indexIcon, label , subItems}) => {

    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const navigator = useNavigate();

    return (
        <>
            <ListItemButton onClick={()=>{setOpen(prev => !prev)}}>                                    
                <ListItemIcon>
                    {icons[indexIcon]}
                </ListItemIcon>
                <ListItemText primary={label} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                {
                    subItems.map(item => {
                        return (
                            <ListItemButton 
                                sx={{ pl: 4 }} 
                                onClick={()=>{navigator(item.to)}}>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        )
                    })
                }
                </List>
            </Collapse>
        </>
    )
}