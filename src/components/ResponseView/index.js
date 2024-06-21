
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';
import { useAppState } from '../../contexts/AppState';
import chat from '../../api/chat';
import responses from '../../api/responses';
import date from '../../utils/date';
import axios from 'axios';

const ResponseView = props => {

    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([]);
    const [scroll, setScroll] = useState(null);
    const [showIndicator, setShowIndicator] = useState(false);
    const [dialog, setDialog] = useState(null);

    const { group, setGroup } = useAppState();

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data._id);
    }, [props.data]);

    const fetch = async () => {
        const prev = previous.current;
        previous.current = current;
        if (prev === current || prev === 'new') return;

        setItems([]);
        setShowIndicator(false);

        const chats = await chat.messages(current);

        if (!chats) {
            console.log('error fetching chats');
            return;
        }

        setItems(chats);
        setScroll(Math.random().toString());

        if (chats.length && chats[chats.length - 1]) {
            props.update && props.update(chats[chats.length - 1]);
        }
    };

    useEffect(() => {
        if (!current) return;
        fetch();
    }, [current]);

    useEffect(() => {
        const messages = props.updates;
        if (!messages || !messages.add.length || !current) return;

        let delay = 1000;
        
        for (const message of messages.add) {
            if (message.chat !== current) continue;
            if (items.some(item => item._id === message.message._id)) continue;

            setTimeout(() => {
                if (message.chat !== current) return;
                setItems(items => [...items, message.message]);
                setScroll(Math.random().toString());
                setShowIndicator(false);
            }, delay);

            delay += 2000;
        }
    }, [props.updates]);

    useEffect(() => {
        if (!items.length) return;
        setScroll(Math.random().toString(36));
    }, [items]);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const back = async () => {
        props.onBack();

        const chat = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if (current !== chat || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;
        setItems([]);
    };

    const remove = async () => {
        setDialog({
            title: `Delete This Response?`,
            description: `If you delete, users will no longer see this response when asking the question.`,
            main: {
                title: 'Delete',
                action: async () => {
                    const result = await responses.remove(group, current);

                    if (!result) {
                        console.log('Error removing response');
                        return;
                    }

                    const currentChat = current;
                    const identifier = Math.random().toString(36);
                    backIdentifier.current = identifier;

                    await wait(500);
                    props.onFinish && props.onFinish();
                    props.onArchive && props.onArchive();
                    setDialog(null);

                    if (current !== currentChat || backIdentifier.current !== identifier) return;
                    setCurrent(null);
                    previous.current = null;
                }
            },
            secondary: {
                title: 'Cancel',
                action: async () => {
                    setDialog(null);
                }
            }
        });
    };

    const lines = message => message.split('\n').map((line, index) => <div className={style.itemPreview} style={{ marginTop: index ? '5px' : '0px' }}>{line}</div>);
    
    const item = (item, index) => (
        <div className={conditional('item', style, { })}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: item.user ? `url(${item.user.thumbnail})` : 'url(https://cdn2.hubspot.net/hub/6444014/hubfs/PuzzleHR_October2019/images/Puzzle_favicon-150x150.png?width=108&height=108)', backgroundSize: !item.user ? '70% 70%': 'cover' }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.user ? (item.user.firstName + ' ' + item.user.lastName) : 'Harley'}</div>
                        <div className={style.itemDate}>{date.format(item.date)}</div>
                    </div>
                    {lines(item.message)}
                </div>
            </div>
        </div>
    );
    
    const chatViewClass = conditional('ResponseView', style, { visible: props.data !== null });
    const surveysClass = conditional('surveys', style, { visible: props.data !== null });
    const indicatorClass = conditional('indicator', style, { visible: showIndicator });

    if (!current) return <div className={chatViewClass} />;

    const actions = [
        {
            icon: icons.archive,
            perform: remove
        }
    ];

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

    const training = (new Date((props.data || {}).date)).getTime() > (new Date()).getTime() - 360000;
    
    return (
        <div className={chatViewClass}>
            <NavigationView secondary title={props.type === 'fragment' ? 'Reference Information' : 'Prompt Answer'} bottom scroll={scroll} onBack={back} actions={actions}>
                <div className={style.info}>
                    <div className={style.infoIcon} style={{ backgroundImage: training ? icons.progress : icons.check }} />
                    <div className={style.infoText}>{training ? 'Training in progress' : 'Training completed'}</div>
                </div>
                <div className={style.items}>
                    <div className={surveysClass}>
                        <div className={style.surveyCard}>
                            <div className={style.surveyHeader}>
                                <div className={style.featuredIcon} style={props.type === 'fragment' ? { backgroundImage: icons.bookSelected, backgroundSize: '28px 28px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : { backgroundImage: icons.surveyFeed }} />
                                <div className={style.featuredInfo}>
                                    <div className={style.featuredTitle}>{props.type === 'fragment' ? document(props.data).title : (props.data || {}).content}</div>
                                    <div className={style.featuredSubtitle}>{props.type === 'fragment' ? document(props.data).content : (props.data || {}).response}</div>
                                    <div className={style.surveyActions}>
                                        {/* <div className={style.surveyAction} onClick={() => {}}>Replace</div> */}
                                        {/* <div className={style.surveyAction}>Delete</div> */}
                                        {/* {presets.map(preset => <div className={style.surveyAction} onClick={() => ask(preset)}>{preset.message}</div>)} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {items.map(item)}
                    <div className={indicatorClass}>
                        <div className={style.indicatorDot} />
                        <div className={style.indicatorDot} />
                        <div className={style.indicatorDot} />
                    </div>
                </div>
            </NavigationView>
            <ConfirmDialog data={dialog} />
        </div>
    );

};

export default ResponseView;
