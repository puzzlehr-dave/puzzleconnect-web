
import responses from '../responses';
import fragments from '../fragments';

const run = async () => {
    const results = await responses.fetch('65406e8bf9134425b97d7a5c', 'fragment'); // 65317d195895a1acde1645c6

    console.log('Responses');
    console.log(results);

    const added = await responses.add('65406e8bf9134425b97d7a5c', {
        content: 'Are we closed the day after thanksgiving?',
        response: 'Yes, PuzzleHR is closed on the day after thanksgiving.'
    });

    console.log('Response added');
    console.log(added);

    // const content = `PuzzleHR is closed the day after Thanksgiving`;
    
    // const ingested = await fragments.add('65406e8bf9134425b97d7a5c', {
    //     content,
    //     response: 'none'
    // });

    // console.log('Response ingested');
    // console.log(ingested);

    const deleted = await responses.remove('65406e8bf9134425b97d7a5c', '6543f6b0fc7f1607ef496688');

    console.log('Response deleted');
    console.log(deleted);
};

export default { run };
