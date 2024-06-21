
import { component } from './';

const request = component('/questions');

const list = async group => {
    try {
        const results = await request('/fetch', { group });
        return results;
    } catch (e) {
        return null;
    }
};

const fetch = async (group, question, identifiers) => {
    try {
        const results = await request('/results', { group, question, query: { identifiers } });
        return results;
    } catch (e) {
        return null;
    }
};

const recommendations = async (group, identifiers) => {
    try {
        const results = await request('/recommendations', { group, query: { identifiers } });
        return results;
    } catch (e) {
        return null;
    }
};

const add = async (group, survey) => {
    try {
        const result = await request('/add', {
            group,
            name: survey.name,
            request: {
                options: survey.options.map(content => ({ content })),
                reminder: survey.timing
            }
        });

        return result;
    } catch (e) {
        return null;
    }
};

const remove = async survey => {
    try {
        const result = await request('/archive', { question: survey });
        return result;
    } catch (e) {
        return null;
    }
};

const answer = async (survey, index, identifier) => {
    try {
        const result = await request('/answer', { 
            question: survey,
            answer: { index, identifier }
        });

        return result;
    } catch (e) {
        return null;
    }
};

const digit = value => value.toString().padStart(2, '0');

const available = async group => {
    const local = new Date();

    // to test surveys from different times
    // local.setMonth(local.getMonth() - 1);

    const date = `${digit(local.getFullYear())}-${digit(local.getMonth() + 1)}-${digit(local.getDate())}`;

    try {
        const result = await request('/available', { group, query: { date } });
        return result;
    } catch (e) {
        return null;
    }
};

export default { list, fetch, add, remove, answer, available, recommendations };
