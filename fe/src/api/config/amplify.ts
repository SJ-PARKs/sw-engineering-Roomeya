import { Amplify } from 'aws-amplify';

// Amplify 설정
Amplify.configure(
    {
        Auth: {
            Cognito: {
                userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
                userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
            },
        },
    },
    {
        ssr: true,
    }
);

export default Amplify;

