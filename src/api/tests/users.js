
import users from '../users';
import groups from '../groups';

const file = `
`

const run = async () => {
    const results = await users.fetch();
    console.log('r', results);

    const list = await users.list();
    console.log('l', list);

    const lines = file.split('\n');

    for (const line of lines) {
        const props = line.split(',');

        try {

        const data = {
            email: props[2].toLowerCase(),
            phone: '1' + props[4],
            firstName: props[0],
            lastName: props[1],
            photo: '',
            thumbnail: '',
            permissions: 'standard'
        };

        const newUser = await users.add(data);
        console.log('added user', newUser);

        if (newUser && newUser.user && newUser.user._id) {
            const put = await groups.put('65406e8bf9134425b97d7a5c', newUser.user._id, {
                title: props[3]
            });

            console.log('put user', put);
        }
    } catch (e) {
        console.log('error adding user', e);
    }

        
    }

    // const result = await users.add({
    //     email,
    //     phone,
    //     firstName,
    //     lastName,
    //     photo: profilePhoto,
    //     thumbnail: profilePhoto,
    //     permissions: selectedAccess === 1 ? 'admin' : 'standard'
    // });

    // const newUser = await users.add({
    //     email: 'timol@puzzlehr.com',
    //     phone: '16103012999',
    //     firstName: 'Chris',
    //     lastName: 'Timol',
    //     photo: 'https://puzzlehr.com/wp-content/uploads/Chris_Timol-e1667855529942.png',
    //     thumbnail: 'https://puzzlehr.com/wp-content/uploads/Chris_Timol-e1667855529942.png'
    // });

    // const newUser = await users.add({
    //     email: 'jdaggar@puzzlehr.com',
    //     phone: '15852698533',
    //     firstName: 'Joe',
    //     lastName: 'Daggar',
    //     photo: 'https://puzzlehr.com/wp-content/uploads/Joe-Daggar-1-1.png',
    //     thumbnail: 'https://puzzlehr.com/wp-content/uploads/Joe-Daggar-1-1.png'
    // });

    // const newUser = await users.add({
    //     email: 'gabe@puzzlehr.com',
    //     phone: '14072837660',
    //     firstName: 'Gabe',
    //     lastName: 'Pierannunzi',
    //     photo: 'https://ca.slack-edge.com/T0482CTN7JT-U04M5B2LDC3-c766ea8df6ef-512',
    //     thumbnail: 'https://ca.slack-edge.com/T0482CTN7JT-U04M5B2LDC3-c766ea8df6ef-512'
    // });

    // const newUser = await users.add({
    //     email: 'nina@puzzlehr.com',
    //     phone: '17275541403',
    //     firstName: 'Nina',
    //     lastName: 'Turnau',
    //     photo: '',
    //     thumbnail: ''
    // });

    // console.log('Added');
    // console.log(newUser);

    // const put = await groups.put('65406e8bf9134425b97d7a5c', newUser.user._id, {
    //     title: 'Team Supervisor'
    // });

    // console.log('Put user in group');
    // console.log(put);

    // const update = await users.update('65295a31d9a1365b842f9c4f', {
    //     email: 'admin4@puzzlehr.com'
    // })

    // console.log('Updated');
    // console.log(update);

    // const removed = await users.remove('6529526fe3ab9d56cf4c62e7');

    // console.log('Removed');
    // console.log(removed);
};

export default { run };
