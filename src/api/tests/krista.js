const axios = require('axios');

const run = async () => {
    try {
        const url = 'https://extension.us.krista.app/extension/api/_pufOMGMYFpT1nQgWypcEgg_e_e/puzzle-hr/fff-question';

        const data = {
            question: 'what can I use my FSA on?',
            'session-id': 1,
            user: 'gabe.pierannunzi',
            'company-Id': 'PuzzleHR'
        };

        const response = await axios.put(url, data);
        console.log(response.data);
    } catch (e) {
        console.log(e.response.data);
    }
};

run();