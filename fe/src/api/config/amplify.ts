import { Amplify } from 'aws-amplify';

// 환경 변수 확인
// ⚠️ Vite에서는 import.meta.env를 사용해야 합니다!
// process.env는 Node.js 환경에서만 사용 가능하며, 브라우저에서는 작동하지 않습니다.
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;

if (!userPoolId || !userPoolClientId) {
    console.error('❌ Cognito 환경 변수가 설정되지 않았습니다!');
    console.error('다음 환경 변수를 설정해주세요:');
    console.error('- VITE_COGNITO_USER_POOL_ID');
    console.error('- VITE_COGNITO_APP_CLIENT_ID');
    console.error('\n현재 값:');
    console.error(`VITE_COGNITO_USER_POOL_ID: ${userPoolId || 'undefined'}`);
    console.error(`VITE_COGNITO_APP_CLIENT_ID: ${userPoolClientId || 'undefined'}`);
    throw new Error('Cognito 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

console.log(`VITE_COGNITO_USER_POOL_ID: ${userPoolId || 'undefined'}`);
console.log(`VITE_COGNITO_APP_CLIENT_ID: ${userPoolClientId || 'undefined'}`);

// Amplify 설정
Amplify.configure(
    {
        Auth: {
            Cognito: {
                userPoolId: userPoolId,
                userPoolClientId: userPoolClientId,
            },
        },
    },
    {
        ssr: true,
    }
);

console.log('✅ Amplify Cognito 설정 완료');

export default Amplify;

