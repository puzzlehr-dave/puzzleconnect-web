
const fs = require('fs');
const axios = require('axios');

const clients = 'https://app.puzzlehr.com/api/EmployeeLists/Clients';
const employees = 'https://app.puzzlehr.com/api/EmployeeLists/';

const headers = { 'Puzzle-X-ApiKey': 'Re3Mz-FUJQRHRd4Y-YwQMdMmkufesrBv' };

const request = async url => {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (e) {
        return null;
    }
};

const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

const run = async props => {
    const list = await request(clients);
    
    if (!list) {
        console.log('Cannot fetch client list');
        return;
    }

    let results = '';
    let count = 0;

    for (const organization of list) {
        const users = await request(employees + organization.clientId);
        
        if (!users) {
            console.log('Cannot fetch employee list for ' + organization.clientId);
            continue;
        }
        
        for (const user of users) {
            const entry = props.map(prop => user[prop]).join(',');
            results += entry + '\n';
        }

        count += 1;

        console.log(`Fetched ${users.length} users for ${organization.clientId} (${count}/${list.length})`);
        await wait(50);
    }
    
    fs.writeFileSync('download.csv', results, 'utf8');
};

const props = [
    'employeeId',
    'companyId',
    'companyName',
    'firstName',
    'lastName',
    'phone',
    'emailAddress',
    'userRoll',
    'status',
    'userKey'
];

run(props);
//endpoint();

