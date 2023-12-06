import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material"
import { clearStorage } from "../utils/storageUtils";
import { AccountInfo } from "@azure/msal-browser";

export const LogoutButton = () => {
    const { instance } = useMsal();

    const activeAccount: AccountInfo | null = instance?.getActiveAccount();

    const handleLogout = () => {
        if(activeAccount) {
            clearStorage(activeAccount);
        }

        instance.logoutPopup({
            mainWindowRedirectUri: '/', // redirects the top level app after logout
            account: instance.getActiveAccount(),
        }).catch((error) => console.log(error));
    };

    return (
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
    )
}