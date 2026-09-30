import { List, ListItemButton, ListItemText } from '@mui/material'
import { NavLink } from 'react-router-dom'

const links = [
    { to: "/dashbaord", label: 'Dashboard' },
    { to: "/login", label: 'Login' },
] as const

export default function NavLinks() {
    return (
        <List component="nav" sx={{ px: 1 }}>
            {links.map((link) => (
                <ListItemButton
                    key={link.to}
                    component={NavLink}
                    to={link.to}
                    sx={{ borderRadius: 1, '&.active': { bgcolor: 'action.selected' } }}
                >
                    <ListItemText primary={link.label} />
                </ListItemButton>
            ))}
        </List>
    )
}
