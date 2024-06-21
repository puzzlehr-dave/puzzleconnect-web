
import { component } from './';

const request = component('/chat/fragments');

const add = async (group, response) => {
    try {
        const result = await request('/add', {
            group,
            type: 'fragment',
            content: response.content,
            response: 'none'
        });

        return result;
    } catch (e) {
        return null;
    }
};

export default { add };
