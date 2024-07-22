
import axios from 'axios';
import bridge from 'bridge-request';

export const url = 'http://localhost:9898';

let initial = false;

const authorization = () => {
    try {
        const result = localStorage.getItem('at');

        const updateBridge = async () => {
            try {
                console.log('updateToken b');
                await bridge.request('updateToken', { token: result });
            } catch (e) {}
        };
    
        if (!initial) {
            updateBridge();
            initial = true;
        }
        
        return result || null;
    } catch (e) {
        return null;
    }
};

const request = async (route, data, auth = true) => {
    try {
        const saved = auth ? authorization() : null;
        const headers = saved ? { 'Authorization': saved } : {};
        const response = await axios.post(url + route, data, { headers });
        return response.data;
    } catch (e) {
        throw e;
    }
};

export const component = base => {
    return async (route, data, auth = true) => await request(base + route, data, auth);
};
