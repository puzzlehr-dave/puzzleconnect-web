
import groups from '../groups';

const run = async () => {
    const results = await groups.fetch();
    console.log(results);

    // const added = await groups.add({
    //     name: 'PuzzleHR',
    //     public: false
    // });

    // console.log('Added group');
    // console.log(added);

    // const removed = await groups.remove('652a98313f4d028ce44059ef');

    // console.log('Removed group');
    // console.log(removed);

    const search = await groups.search('test p');

    console.log('Search results');
    console.log(search);

    const members = await groups.members('65406e8bf9134425b97d7a5c');

    console.log('Members');
    console.log(members);

    // const updated = await groups.update('652abb793c5a8e9dcb5a4f06', {
    //     name: 'name 2',
    //     public: true
    // });

    // console.log('Updated group');
    // console.log(updated);

    // const joined = await groups.join('652a986b3f4d028ce44059f0');

    // console.log('Joined group');
    // console.log(joined);

    // const put = await groups.put('65406e8bf9134425b97d7a5c', '65406c2621bb5d229f9e6cae', {
    //     title: 'Chief Technology Officer'
    // });

    // console.log('Put user in group');
    // console.log(put);

    // const kicked = await groups.kick('65406e8bf9134425b97d7a5c', '653816eef28712bcf2c9b17f');

    // console.log('Kicked user in group');
    // console.log(kicked);

    // const accepted = await groups.accept('groupid', 'userid');
    // console.log('Accepted user');
    // console.log(accepted);

    // const left = await groups.leave('groupid');

    // console.log('Left group');
    // console.log(left);

    // const kicked = await groups.kick('groupid', 'userid');

    // console.log('Kicked user');
    // console.log(kicked);

    // const posts = await groups.posts('652ac02dd60a19a12ebb2401', 'post');

    // console.log('Group posts');
    // console.log(posts);

    // const awarded = await groups.posts('652ac02dd60a19a12ebb2401', 'badge');

    // console.log('Group awarded');
    // console.log(awarded);

    // const promoted = await groups.promote('65406e8bf9134425b97d7a5c', '65406c2621bb5d229f9e6cae');
    // console.log('promoted', promoted);

    // const demoted = await groups.demote('65406e8bf9134425b97d7a5c', '65406c2621bb5d229f9e6cae');
    // console.log('demoted', demoted);

    // const post = await groups.post('652ac02dd60a19a12ebb2401', 'test');

    // console.log('Posted');
    // console.log(post);

    // const badged = await groups.post('652ac02dd60a19a12ebb2401', 'content', {
    //     badge: '652ae747ff2ebab3a3427ef2',
    //     to: '652abfced60a19a12ebb23ff'
    // });

    // console.log('Badged');
    // console.log(badged);

    // const deleted = await groups.archive('652aec2771c261b5d0f3ea0c');

    // console.log('Deleted');
    // console.log(deleted);

    // const newUser = await users.add({
    //     email: 'admin3@puzzlehr.com',
    //     phone: '2000000',
    //     firstName: '',
    //     lastName: '',
    //     photo: '',
    //     thumbnail: ''
    // });

    // console.log('Added');
    // console.log(newUser);

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
