
import { component } from './';

const request = component('/chat/responses');

const fetch = async (group, type) => {
    try {
        const results = await request('/fetch', { group, type });
        return results;
    } catch (e) {
        return null;
    }
};

const add = async (group, response) => {
    try {
        const result = await request('/add', {
            group,
            type: 'response',
            content: response.content,
            response: response.response
        });

        return result;
    } catch (e) {
        return null;
    }
};

const remove = async (group, response) => {
    try {
        const result = await request('/archive', { group, response });
        return result;
    } catch (e) {
        return null;
    }
};

export default { fetch, add, remove };
