
import surveys from '../surveys';

const run = async () => {
    const results = await surveys.fetch('652ac02dd60a19a12ebb2401');

    console.log('Surveys');
    console.log(results);

    const available = await surveys.available('652ac02dd60a19a12ebb2401');

    console.log('Surveys available');
    console.log(available);

    // const added = await surveys.add('652ac02dd60a19a12ebb2401', {
    //     name: 'survey',
    //     options: ['option a', 'option b']
    // });

    // console.log('Survey question added');
    // console.log(added);

    // const removed = await surveys.remove('6535847327fee16adf5207c8');
    // console.log('Survey removed');
    // console.log(removed);

    // const answered = await surveys.answer('653589e64a55576e3c3b99b2', 0);
    // console.log('Survey answered');
    // console.log(answered);
};

export default { run };
