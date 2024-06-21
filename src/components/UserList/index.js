
import React, { useRef, useState } from 'react';
import style from './style.module.css';

import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import { useEffectGroup } from '../../contexts/AppState';
import users from '../../api/users';
import date from '../../utils/date';
import { useAppState } from '../../contexts/AppState';
import ListHeader from '../ListHeader';
import UserView from '../UserView';
import NewUserView from '../NewUserView';

const UserList = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updates, setUpdates] = useState(null);

    const [user, setUser] = useState(null);

    const groupIdentifier = useRef();

    const { group } = useAppState();

    const fetch = async group => {
        const results = await users.list();

        if (!results) {
            console.log('error fetching users');
            return;
        }
        
        setItems(results); // .filter(result => result._id !== group));

        groupIdentifier.current = group;
    };

    const add = async () => {
        setUser({});

        // if (items.some(item => item._id === 'new')) {
        //     select(0);
        //     return;
        // }

        // const message = { _id: 'new' };
        // setItems([message, ...items]);
        // select(0);
    };

    const updateChat = chat => {
        // setTimeout(() => {
        //     console.log('upd', items, chat);
        //     setItems(items => items.map(item => item._id === chat._id ? chat : item));
        // }, 100);
    };

    const onSave = () => {
        setUser(null);
        fetch(group);
    };

    const document = data => {
        if (!data) return { title: '', content: '' };

        let title = '';
        let content = '';

        const words = data.content.split(' ');

        for (const [index, word] of Object.entries(words)) {
            if (index < 5) {
                title += word + ' ';
            }

            content += word + ' ';
        }

        return {
            title,
            content
        };
    };

    useEffectGroup(fetch);

    const actions = [
        {
            icon: icons.add,
            perform: () => add(),
            // name: 'New Chat',
            // primary: true
        }
    ];

    const select = index => {
        setSelected(index);
    };

    const addChat = chat => {
        setItems(items => items.map(item => item._id === 'new' ? chat : item));
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: selected === index })} onClick={() => select(index)}>
            <div className={style.itemContent}>
                {/* <div className={style.itemPhoto} /> */}
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.firstName} {item.lastName}</div>
                        {/* <div className={style.itemDate}>{item._id !== 'new' ? date.format(item.updated) : ''}</div> */}
                    </div>
                    <div className={style.itemPreview}>{item.email}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className={style.UserList}>
            <NavigationView primary title="Users" actions={actions}>
                <ListHeader title="New User" description="Start onboarding someone" action={add} />
                <div className={style.items}>
                    {items.sort((a, b) => a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase())).map(item)}
                </div>
            </NavigationView>
            <UserView data={selected !== null ? items[selected] : null} updates={updates} add={addChat} update={updateChat} onBack={() => setSelected(null)} onArchive={() => {setSelected(null);fetch(group)}} onUpdate={() => {fetch(group)}} />
            <NewUserView data={user} onBack={() => setUser(null)} onSave={onSave} />
        </div>
    );

};

export default UserList;
