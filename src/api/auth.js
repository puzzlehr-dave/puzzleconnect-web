
import { component } from './';
import bridge from 'bridge-request';

const request = component('/auth');

const fetch = async () => {
    try {
        const result = await request('/fetch', {});
        return result;
    } catch (e) {
        return null;
    }
};

const verify = async data => {
    const route = data.phone ? '/verify/phone' : '/verify/email';
    const auth = data.phone ? { phone: data.phone } : { email: data.email };
    
    try {
        const result = await request(route, auth, false);
        return result;
    } catch (e) {
        return null;
    }
};

const signIn = async data => {
    const route = data.phone ? '/phone' : '/email';
    const auth = data.phone ? { phone: data.phone } : { email: data.email };
    
    try {
        const result = await request(route, { ...auth, code: data.code });
        
        if (!result.token || !result.user) {
            return {
                success: false,
                invalid: result.invalidCode,
                user: null
            };
        }

        try {
            const data = JSON.stringify(result.user);
            localStorage.setItem('user', data);
            localStorage.setItem('at', result.token);

            const updateBridge = async () => {
                console.log('updateToken a');
                try {
                    await bridge.request('updateToken', { token: result.token });
                } catch (e) {}
            };
        
            updateBridge();
        } catch (e) {
            console.log(e);
        }

        return {
            success: true,
            invalid: result.invalidCode,
            user: result.user
        };
    } catch (e) {
        return null;
    }
};

export default { fetch, verify, signIn };
