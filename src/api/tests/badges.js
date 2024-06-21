
import badges from '../badges';

const run = async () => {
    const results = await badges.fetch('65406e8bf9134425b97d7a5c');
    const awards = await badges.fetchAwards('65406e8bf9134425b97d7a5c');

    console.log('Badges');
    console.log(results);

    console.log('Awards');
    console.log(awards);

    // const archived = await badges.remove('65513cfc75ba228b45e69821');
    // console.log('Archived');
    // console.log(archived);

    // for (const badge of results) {
    //     if (badge.name !== 'badge test') continue;
    //     const removed = await badges.remove(badge._id);

    //     console.log('Removed');
    //     console.log(removed);
    // }

    // const added = await badges.addAwardedBadge('65406e8bf9134425b97d7a5c', {
    //     name: 'another five on 11/10',
    //     description: ''
    // }, [
    //     {
    //         badge: '65513ce075ba228b45e69820',
    //         value: 1,
    //         from: '2023-11-10T17:37:38.480Z',
    //         to: '2023-11-13T17:37:38.480Z'
    //     }
    // ]);

    const types = [
        'Customer Service',
        'Team Player',
        'Extra Mile',
        'Problem Solver',
        'Training',
        'Integrity',
        'Excellence',
        'Team Spirit'
    ];

    // for (const type of types) {
    //     const added = await badges.addAward('65406e8bf9134425b97d7a5c', {
    //         name: type,
    //         description: ''
    //     });

    //     console.log('Added type');
    //     console.log(added);
    // }

    // for (const award of awards) {
    //     const added = await badges.addAwardedBadge('65406e8bf9134425b97d7a5c', {
    //         name: award.name,
    //         description: 'Gold'
    //     }, [
    //         {
    //             badge: award._id,
    //             value: 7,
    //             from: '2023-11-10T17:37:38.480Z',
    //             to: '2029-11-13T17:37:38.480Z'
    //         }
    //     ]);

    //     console.log('Added badge');
    //     console.log(added);
    // }

    

    // const added = await badges.add('65406e8bf9134425b97d7a5c', 'badge', {
    //     name: 'High Five',
    //     description: ''
    // }, {
    //     awards: {
    //         // awardIdentifier: {
    //             value: 4,
    //             from: '',
    //             to: ''
    //         // }
    //     }
    // });

    // const earned = await badges.earned('65406e8bf9134425b97d7a5c');
    // console.log('Earned');
    // console.log(earned);

    const awarded = await badges.award('65406e8bf9134425b97d7a5c', '65526368f793d4c06bc75539', '65406c2621bb5d229f9e6cae');
    console.log('Awarded');
    console.log(awarded);

    // console.log('Added');
    // console.log(added);

    // const updated = await badges.update('652ae693ff2ebab3a3427ec3', {
    //     name: 'badge test up',
    //     description: 'something'
    // });

    // console.log('Updated');
    // console.log(updated);

    const removed = await badges.remove('652ae942ff2ebab3a3427f79');

    console.log('Removed');
    console.log(removed);
};

export default { run };
