
import { request } from './';

export const organization = '619d0f5cbba38a6743eb309e';

const fetch = async (organization, uid = null) => {
    const data = {
        organization,
        type: 'ticket',
        query: uid ? { uid } : {}
    };

    const result = await request('/documents/fetch', data);
    return result;
};

const fetchUpdates = async (organization, identifier) => {
    const data = {
        organization,
        identifier,
        type: 'ticket',
        query: { data: {} }
    };

    const result = await request('/documents/updates', data);
    return result;
};

const add = async (organization, ticket) => {
    const data = {
        organization,
        type: 'ticket',
        document: {
            data: {
                status: 'active',
                type: ticket.type,
                title: ticket.title,
                content: ticket.content,
                unread: 0,
                lastReply: new Date(),
                app: true
            }
        }
    };

    const result = await request('/documents/add', data);
    return result;
};

const read = async (organization, ticket) => {
    const data = {
        organization,
        type: 'ticket',
        document: {
            _id: ticket,
            data: {
                unread: 0
            }
        }
    };

    const result = await request('/documents/update', data);
    return result;
};

export default { fetch, fetchUpdates, add, read };
