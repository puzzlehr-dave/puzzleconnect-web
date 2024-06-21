
import React, { useRef, useState } from 'react';
import style from './style.module.css';

import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import { useEffectGroup } from '../../contexts/AppState';
import groups from '../../api/groups';
import date from '../../utils/date';
import { useAppState } from '../../contexts/AppState';
import ListHeader from '../ListHeader';
import OrganizationView from '../OrganizationView';
import NewOrganizationView from '../NewOrganizationView';

const OrganizationList = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updates, setUpdates] = useState(null);

    const [organization, setOrganization] = useState(null);

    const groupIdentifier = useRef();

    const { group } = useAppState();

    const fetch = async group => {
        const results = await groups.fetch();

        if (!results) {
            console.log('error fetching groups');
            return;
        }
        
        setItems(results); // .filter(result => result._id !== group));

        groupIdentifier.current = group;
    };

    const add = async () => {
        setOrganization({});

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
        setOrganization(null);
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
                        <div className={style.itemName}>{item.name}</div>
                        {/* <div className={style.itemDate}>{item._id !== 'new' ? date.format(item.updated) : ''}</div> */}
                    </div>
                    <div className={style.itemPreview}>{item.public ? 'Public' : 'Private'}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className={style.OrganizationList}>
            <NavigationView primary title="Organizations" actions={actions}>
                <ListHeader title="New Organization" description="Add organization for users" action={add} />
                <div className={style.items}>
                    {items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map(item)}
                </div>
            </NavigationView>
            <OrganizationView data={selected !== null ? items[selected] : null} updates={updates} add={addChat} update={updateChat} onBack={() => setSelected(null)} onArchive={() => {setSelected(null);fetch(group)}} onUpdate={() => fetch(group)} />
            <NewOrganizationView data={organization} onBack={() => setOrganization(null)} onSave={onSave} />
        </div>
    );

};

export default OrganizationList;
