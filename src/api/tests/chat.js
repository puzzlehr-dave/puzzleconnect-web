
import chat from '../chat';

const run = async () => {
    // does the austin office offer free parking?
    // does the silicon valley office offer free parking
    // const results = await chat.fetch('652ac02dd60a19a12ebb2401', 'What is the best coffee in bay area?'); // 65317d195895a1acde1645c6

    // console.log('Chat result');
    // console.log(results);

    const fetched = await chat.fetch('652ac02dd60a19a12ebb2401');
    console.log('Chat fetched');
    console.log(fetched);

    // const messages = await chat.messages('65355c1ba79de15690c1d927');
    // console.log('Chat messages');
    // console.log(messages);

    // const added = await chat.add('652ac02dd60a19a12ebb2401', {
    //     subject: 'Message subject',
    //     message: 'message content'
    // });
    // console.log('Message added');
    // console.log(added);

    // const sent = await chat.send('65355c1ba79de15690c1d927', 'another message');
    // console.log('Message sent');
    // console.log(sent);

    // const updates = await chat.updates('652ac02dd60a19a12ebb2401');

    // console.log('Updates');
    // console.log(updates);

    const read = await chat.read('65355c1ba79de15690c1d927');
    console.log('Read');
    console.log(read);
};

export default { run };
