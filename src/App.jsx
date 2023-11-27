import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate} from '@azure/msal-react';
import { Container, Button } from 'react-bootstrap';
import { PageLayout } from './components/PageLayout';
import { IdTokenData } from './components/DataDisplay';
import { loginRequest } from './authConfig';

import './styles/App.css';
import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowWrap: 'break-word',
    fontSize: '5px'
  };
/**
 * Most applications will need to conditionally render certain components based on whether a user is signed in or not. 
 * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will 
 * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const MainContent = () => {
    /**
     * useMsal is hook that returns the PublicClientApplication instance,
     * that tells you what msal is currently doing. For more, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
     */
    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const handleRedirect = () => {
        instance
            .loginRedirect({
                ...loginRequest,
                prompt: 'create',
            })
            .catch((error) => console.log(error));
    };

    const getToken = async () => {
        const currentAccount = activeAccount 
        const accessTokenRequest = {
          scopes: ["api://ea62698e-3ba6-4806-9466-1369d83bc2bf/access_as_user"],
          account: currentAccount,
        };
      
        if (currentAccount) {
          
            const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
            setOpen(true);
            setAccessToken(`Bearer ${accessTokenResponse.accessToken}`);
            console.log(`Bearer ${accessTokenResponse.accessToken}`);          
        }
      }
    const [open, setOpen] = React.useState(false);
    const [accessToken, setAccessToken] = React.useState("");

    const handleClose = () => setOpen(false);

    return (
        <div className="App">
            <AuthenticatedTemplate>
                {activeAccount ? (
                    <div>
                        <Button className="signInButton" onClick={getToken} variant="primary">
                            Get JWT Access Token
                        </Button>
                        <Container>
                            <IdTokenData idTokenClaims={activeAccount.idTokenClaims} idToken = {activeAccount.idToken} />
                        </Container>
                        
                        <div>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Access token
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    {accessToken}
                                </Typography>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                       
                ) : null}
                
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <Button className="signInButton" onClick={handleRedirect} variant="primary">
                    Sign up
                </Button>
            </UnauthenticatedTemplate>
        </div>
    );
};


/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be 
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication 
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the 
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */
const App = ({ instance }) => {
    return (
        <MsalProvider instance={instance}>
            <PageLayout>
                <MainContent />
            </PageLayout>
        </MsalProvider>
    );
};

export default App;