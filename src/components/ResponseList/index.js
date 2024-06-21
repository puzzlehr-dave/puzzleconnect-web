
import React, { useRef, useState } from 'react';
import style from './style.module.css';

import ResponseView from '../ResponseView';
import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import { useEffectGroup } from '../../contexts/AppState';
import responses from '../../api/responses';
import date from '../../utils/date';
import { useAppState } from '../../contexts/AppState';
import NewResponseView from '../NewResponseView';
import ListHeader from '../ListHeader';

const ResponseList = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updates, setUpdates] = useState(null);

    const [response, setResponse] = useState(null);

    const groupIdentifier = useRef();

    const { group } = useAppState();

    const fetch = async group => {
        const results = await responses.fetch(group, props.type || 'response');

        if (!results) {
            console.log('error fetching responses');
            return;
        }
        
        setItems(results);

        groupIdentifier.current = group;
    };

    const add = async () => {
        setResponse({});

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
        setResponse(null);
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
                        <div className={style.itemName}>{item._id !== 'new' ? (props.type === 'fragment' ? document(item).title : item.content) : 'New Message'}</div>
                        <div className={style.itemStatus} style={{ backgroundImage: (new Date(item.date)).getTime() > (new Date()).getTime() - 360000 ? icons.progress : icons.check }} />
                        {/* <div className={style.itemDate}>{item._id !== 'new' ? date.format(item.updated) : ''}</div> */}
                    </div>
                    <div className={style.itemPreview}>{item._id !== 'new' ? (props.type === 'fragment' ? document(item).content : item.response) : 'Tell us how we can help!'}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className={style.ChatList}>
            <NavigationView primary title={props.type === 'fragment' ? 'Documents' : 'Responses'} actions={actions}>
                <ListHeader title={props.type === 'fragment' ? 'New Document' : 'New Response'} description={props.type === 'fragment' ? 'Add new reference information' : 'Add an answer for a question'} action={add} />
                <div className={style.items}>
                    {items.sort((a, b) => (new Date(b.date)) - (new Date(a.date))).map(item)}
                </div>
            </NavigationView>
            <ResponseView type={props.type} data={selected !== null ? items[selected] : null} updates={updates} add={addChat} update={updateChat} onBack={() => setSelected(null)} onArchive={() => {setSelected(null);fetch(group)}} />
            <NewResponseView type={props.type} data={response} onBack={() => setResponse(null)} onSave={onSave} />
        </div>
    );

};

export default ResponseList;
