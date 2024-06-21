
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';

import ChatView from '../ChatView';
import NavigationView from '../ContentView';
import icons from '../../resources/icons';
import conditional from '../../utils/conditional';
import { useEffectGroup, useShortcut } from '../../contexts/AppState';
import chat from '../../api/chat';
import date from '../../utils/date';
import { useAppState } from '../../contexts/AppState';
import ListHeader from '../ListHeader';

const ChatList = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [updates, setUpdates] = useState(null);

    const { group, shortcuts } = useAppState();

    const groupIdentifier = useRef();

    const fetch = async group => {
        const chats = await chat.fetch(group);

        if (!chats) {
            console.log('error fetching chats');
            return;
        }
        
        setItems(chats);

        groupIdentifier.current = group;
        fetchUpdates();
    };

    useShortcut('newChat', () => {
        add();
    });

    const add = async () => {
        if (items.some(item => item._id === 'new')) {
            select(0);
            return;
        }

        const message = { _id: 'new' };
        setItems([message, ...items]);
        select(0);
    };

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const fetchUpdates = async () => {
        try {
            const results = await chat.updates(groupIdentifier.current);

            if (results) {
                const messages = results.messages;
                setUpdates(messages);

                let lastMessage = null;

                for (const message of messages.add) {
                    lastMessage = message;
                }

                setItems(items => items.map(item => {
                    if (!lastMessage) return item;
                    if (item._id !== lastMessage.chat) return item;
                    return { ...item, lastMessage: lastMessage.message.message.split('[')[0] };
                }));
            }
        } catch (e) {}

        await wait(2000);
        fetchUpdates();
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

    const updateChat = chat => {
        // setTimeout(() => {
        //     console.log('upd', items, chat);
        //     setItems(items => items.map(item => item._id === chat._id ? chat : item));
        // }, 100);
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: selected === index })} onClick={() => select(index)} key={index}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item._id !== 'new' ? item.subject : 'New Message'}</div>
                        <div className={style.itemDate}>{item._id !== 'new' ? date.format(item.updated) : ''}</div>
                    </div>
                    <div className={style.itemPreview}>{item._id !== 'new' ? item.lastMessage.split('[')[0] : 'Tell us how we can help!'}</div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className={style.ChatList}>
            {/* bigger new chat button */}
            <NavigationView primary title="Recent Chats" actions={actions}>
                <ListHeader title="New Chat" description="Tap to start chatting with Puzzle" action={add} />
                <div className={style.items}>
                    {items.map(item)}
                </div>
            </NavigationView>
            <ChatView data={selected !== null ? items[selected] : null} updates={updates} add={addChat} update={updateChat} onBack={() => setSelected(null)} onArchive={() => fetch(group)} />
        </div>
    );

};

export default ChatList;
