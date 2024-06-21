
import { component } from './';

const request = component('/groups');

const fetch = async () => {
    try {
        const results = await request('/fetch', {});
        return results;
    } catch (e) {
        return null;
    }
};

/*
{
    name: ''
}
*/

const add = async group => {
    try {
        const result = await request('/add', { name: group.name, options: { public: group.public ? true : false } });
        return result;
    } catch (e) {
        return null;
    }
};

const remove = async group => {
    try {
        const result = await request('/delete', { group });
        return result;
    } catch (e) {
        return null;
    }
};

/*
{
    search: ''
}
*/

const search = async query => {
    try {
        const result = await request('/search', { search: query });
        return result;
    } catch (e) {
        return null;
    }
};

const members = async group => {
    try {
        const results = await request('/members', { group });
        return results;
    } catch (e) {
        return null;
    }
};

const update = async (group, update) => {
    try {
        await request('/update', { group, update });
        return true;
    } catch (e) {
        return false;
    }
};

const put = async (group, user, data) => {
    try {
        const result = await request('/put', { group, user, data });
        return result;
    } catch (e) {
        return null;
    }
};

const join = async group => {
    try {
        await request('/join', { group });
        return true;
    } catch (e) {
        return false;
    }
};

const accept = async (group, user) => {
    try {
        await request('/accept', { group, user });
        return true;
    } catch (e) {
        return false;
    }
};

const leave = async group => {
    try {
        await request('/leave', { group });
        return true;
    } catch (e) {
        return false;
    }
};

const kick = async (group, user) => {
    try {
        await request('/kick', { group, user });
        return true;
    } catch (e) {
        return false;
    }
};

const promote = async (group, user) => {
    try {
        await request('/promote', { group, user });
        return true;
    } catch (e) {
        return false;
    }
};

const demote = async (group, user) => {
    try {
        await request('/demote', { group, user });
        return true;
    } catch (e) {
        return false;
    }
};

const posts = async (group, type, to = null) => {
    try {
        const results = await request('/posts', { group, type, filter: to ? { to } : {} });
        return results;
    } catch (e) {
        return null;
    }
};

const post = async (group, content, badge = null) => {
    try {
        const result = await request('/post', {
            group,
            type: badge ? 'badge' : 'post',
            content,
            badge: badge ? { _id: badge.badge, to: badge.to } : {}
        });
        
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const archive = async post => {
    try {
        await request('/archive', { post });
        return true;
    } catch (e) {
        return false;
    }
};

export default {
    fetch,
    add,
    remove,
    search,
    members,
    update,
    put,
    join,
    accept,
    leave,
    kick,
    promote,
    demote,
    posts,
    post,
    archive
};
