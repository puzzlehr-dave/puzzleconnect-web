
import { component } from './';

const request = component('/chat');

const fetch = async group => {
    try {
        const results = await request('/fetch', { group });
        return results;
    } catch (e) {
        return null;
    }
};

const messages = async chat => {
    try {
        const results = await request('/messages', { chat });
        return results;
    } catch (e) {
        return null;
    }
};

const add = async (group, message) => {
    try {
        const results = await request('/add', { group, subject: message.subject, message: message.message });
        return results;
    } catch (e) {
        return null;
    }
};

const send = async (chat, message) => {
    try {
        const results = await request('/send', { chat, message });
        return results;
    } catch (e) {
        return null;
    }
};

const updates = async group => {
    try {
        const results = await request('/updates', { group });
        return results;
    } catch (e) {
        return null;
    }
};

const read = async chat => {
    try {
        const results = await request('/read', { chat });
        return results;
    } catch (e) {
        return null;
    }
};

const archive = async chat => {
    try {
        const results = await request('/archive', { chat });
        return results;
    } catch (e) {
        return null;
    }
};

const subscribers = [];

const onUpdate = (group, perform) => {
    const run = async () => {
        const updates = await updates(group);
    };

    if (!subscribers.length) {
        setInterval(() => {
            
        }, 1000);
    }
};



export default { fetch, messages, add, send, updates, read, archive };
