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
    Link as RouterLink
} from 'react-router-dom';
import { Button } from '@mui/material';

export default function NavigationBar() {

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
                        <Button LinkComponent={RouterLink} color='inherit' sx={{ ml: 2 }} to='/weather-forecast'>Weather Forecast</Button>
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
