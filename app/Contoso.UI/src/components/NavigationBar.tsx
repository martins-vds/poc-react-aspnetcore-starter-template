import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { LoginButton } from './LoginButton';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { LogoutButton } from './LogoutButton';
import {
    useNavigate
} from 'react-router-dom';
import { Button } from '@mui/material';

export default function NavigationBar() {
    const navigate = useNavigate();

    const handleMenuClick = (location: string) => {
        navigate(location);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        React AspNetCore Starter Template
                    </Typography>
                    <AuthenticatedTemplate>
                        <Button sx={{ ml: 2 }} onClick={() => handleMenuClick('/weather-forecast')}>Weather Forecast</Button>
                        <LogoutButton />
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <LoginButton />
                    </UnauthenticatedTemplate>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </Box>
    );
}
