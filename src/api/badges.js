
import { component } from './';

const request = component('/badges');

const fetch = async group => {
    try {
        const results = await request('/fetch', { group, type: 'badge' });
        return results;
    } catch (e) {
        return null;
    }
};

const fetchAwards = async group => {
    try {
        const results = await request('/fetch', { group, type: 'award' });
        return results;
    } catch (e) {
        return null;
    }
};

const addAwardedBadge = async (group, badge, awards) => {
    try {
        const result = await request('/add', {
            group,
            type: 'badge',
            name: badge.name,
            query: { awards },
            secondaryInfo: {
                description: badge.description,
                thumbnail: badge.thumbnail,
                photo: badge.photo
            }
        });

        return result;
    } catch (e) {
        return null;
    }
};

const addAward = async (group, badge) => {
    try {
        const result = await request('/add', {
            group,
            type: 'award',
            name: badge.name,
            query: {},
            secondaryInfo: {
                description: badge.description,
                thumbnail: badge.thumbnail,
                photo: badge.photo
            }
        });

        return result;
    } catch (e) {
        return null;
    }
};

const earned = async (group, user = null) => {
    try {
        const result = await request('/earned', { group, user: user || '' });
        return result;
    } catch (e) {
        return null;
    }
};

const awarded = async (group, user = null) => {
    try {
        const result = await request('/awards', { group, user: user || '' });
        return result;
    } catch (e) {
        return null;
    }
};

const compliments = async (group, user = null) => {
    try {
        const result = await request('/compliments', { group, user: user || '' });
        return result;
    } catch (e) {
        return null;
    }
};

const award = async (group, badge, to) => {
    try {
        const result = await request('/award', {
            group,
            badge,
            to
        });

        return result;
    } catch (e) {
        return null;
    }
};

const compliment = async (group, content, to) => {
    try {
        const result = await request('/compliment', {
            group,
            content,
            to
        });

        return result;
    } catch (e) {
        return null;
    }
};

const leaderboard = async group => {
    try {
        const result = await request('/leaderboard', { group });
        return result;
    } catch (e) {
        return null;
    }
};

const update = async (badge, data) => {
    try {
        const update = {};

        if (data.name) update.name = data.name;

        const secondaryInfo = {};

        if (data.description) secondaryInfo.description = data.description;
        if (data.thumbnail) secondaryInfo.thumbnail = data.thumbnail;
        if (data.photo) secondaryInfo.photo = data.photo;
        
        update.secondaryInfo = secondaryInfo;

        const result = await request('/update', { badge, update });
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
};

const remove = async badge => {
    try {
        const result = await request('/archive', { badge });
        return result;
    } catch (e) {
        return null;
    }
};

export default { fetch, fetchAwards, earned, awarded, award, compliments, compliment, addAwardedBadge, addAward, leaderboard, update, remove };
