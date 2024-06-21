
import { component } from './';

const request = component('/auth');

const fetch = async () => {
    try {
        const results = await request('/fetch', {});
        return results;
    } catch (e) {
        return null;
    }
};

const list = async () => {
    try {
        const results = await request('/list', {});
        return results;
    } catch (e) {
        return null;
    }
};

/*
{
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    photo: '',
    thumbnail: ''
}
*/
// const result = await users.add({
//     email,
//     phone,
//     firstName,
//     lastName,
//     photo: profilePhoto,
//     thumbnail: profilePhoto,
//     permissions: selectedAccess === 1 ? 'admin' : 'standard'
// });

const add = async user => {
    try {
        const result = await request('/add', user);
        return result;
    } catch (e) {
        return null;
    }
};

/*
{
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    photo: '',
    thumbnail: ''
}
*/

const update = async (user, data) => {
    try {
        const result = await request('/update', { user, update: data });
        return result;
    } catch (e) {
        return null;
    }
};

const remove = async user => {
    try {
        const result = await request('/remove', { user });
        return result;
    } catch (e) {
        return null;
    }
};

export default { fetch, list, add, update, remove };
