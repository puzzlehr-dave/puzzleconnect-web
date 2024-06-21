
import axios from 'axios';
import bridge from 'bridge-request';

const url = 'https://';

const headers = () => {
    const token = localStorage.get('at');
    if (!token) return {};
    return { 'Authorization': token };
};

export const updateAuth = token => {
    if (token === null) {
        localStorage.removeItem('at');
        return;
    }

    localStorage.setItem('at', token);
    
    const updateBridge = async () => {
        try {
            console.log('updateToken c');
            await bridge.request('updateToken', { token });
        } catch (e) {}
    };

    updateBridge();
};

export const request = async (action, data) => {
    let cred = null;

    try {
        const auth = [app, token, cred].join(':');
        const client = { id: 'admin', version: 2 };

        const request = { action, auth, data, client };
        const result = await axios.post(url, request, { headers });

        return result;
    } catch (e) {
        throw e;
    }
};
