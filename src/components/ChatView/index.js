
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import axios from 'axios';

import NavigationView from '../ContentView';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';
import { useAppState } from '../../contexts/AppState';
import chat from '../../api/chat';
import date from '../../utils/date';
import ConfirmDialog from '../ConfirmDialog';
import ChatFeedbackDialog from '../ChatFeedbackDialog';
import HighFivePromptDialog from '../HighFivePromptDialog';

const ChatView = props => {

    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');
    const [scroll, setScroll] = useState(null);
    const [sending, setSending] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [scale, setScale] = useState(null);
    const [highFive, setHighFive] = useState(null);

    const textField = useRef();

    const { group, setGroup, setKeyboard, setPath } = useAppState();

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

        const updates = [];

        let delay = 1000;
        
        for (const message of messages.add) {
            if (message.chat !== current) continue;
            if (items.some(item => item._id === message.message._id)) continue;
            // updates.push(message.message);

            setTimeout(() => {
                if (message.chat !== current) return;
                setItems(items => [...items, message.message]);
                setScroll(Math.random().toString());
                setShowIndicator(false);

                if (message.message.message.toLowerCase().includes('thanks for reaching out')) {
                    setTimeout(() => {
                        setScale({});
                    }, 2000);
                }
            }, delay);

            delay += 2000;
        }
    }, [props.updates]);

    useEffect(() => {
        if (!items.length) return;
        setScroll(Math.random().toString(36));
    }, [items]);

    useEffect(() => {
        setInput('');
        
        // textField.current.style.height = '0px';
        // textField.current.style.height = textField.current.scrollHeight + 'px';
    }, []);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const presets = [
        {
            subject: 'Leave of Absence',
            message: 'How can I take a leave of absence?'
        },
        {
            subject: 'Holiday Info',
            message: 'Are we closed on New Years?'
        },
        {
            subject: 'Pay Stubs',
            message: 'How do I get my paystub?'
        },
        {
            subject: 'Income Verification',
            message: 'Who can I contact for verification of income?'
        },
        {
            subject: 'PTO',
            message: 'How much time off can I take?'
        }
    ];

    const transfers = [
        {
            subject: 'Talk to a human',
            message: 'Yes please'
        },
        {
            subject: 'Talk to a human',
            message: 'No thanks'
        },
    ];

    const ask = async (preset = null) => {
        // return;

        if (!current) return;
        if (sending) return;
        setSending(true);

        const question = preset ? preset.message : input;
        if (!question.length && !preset) return;
        setInput('');

        textField.current.style.height = '0px';
        textField.current.style.height = textField.current.scrollHeight + 'px';

        if (current === 'new') {
            const result = await chat.add(group, {
                subject: preset ? preset.subject : question,
                message: preset ? preset.message : question
            });

            console.log('result', result);

            if (!result) {
                setSending(false);
                // error
                return;
            }

            props.add && props.add(result.chat);
            setCurrent(result.chat._id);

            setItems(items => [...items, result.message]);
            setSending(false);
            setShowIndicator(true);
        } else {
            const result = await chat.send(current, question);

            if (!result) {
                setSending(false);
                // error
                return;
            }

            setItems(items => [...items, result]);
            setSending(false);
            setShowIndicator(true);
        }
    };

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
            title: `Archive This Chat?`,
            description: `Once you archive, the Puzzle team will no longer receive your messages.`,
            main: {
                title: 'Archive',
                action: async () => {
                    const result = await chat.archive(current);

                    if (!result) {
                        console.log('Error archiving chat');
                        return;
                    }

                    props.onBack();
                    props.onArchive();
                    setDialog(null);

                    const currentChat = current;
                    const identifier = Math.random().toString(36);
                    backIdentifier.current = identifier;

                    await wait(500);

                    if (current !== currentChat || backIdentifier.current !== identifier) return;
                    setCurrent(null);
                    previous.current = null;
                    setItems([]);
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

    const component = (content, identifier) => {
        const after = content.split(`[component:${identifier}]`)[1];
        if (!after) return null;

        const before = after.split(`[component:${identifier}:]`)[0];
        if (!before) return null;

        let data = null;

        try {
            data = JSON.parse(before);
        } catch (e) {}

        if (!data) return null;

        const firstBadge = badgeData => {
            if (!badgeData || !badgeData.length) return '';
            return badgeData[0].name;
        };

        return (
            <div className={style.itemTopBadges}>
                {data.map(item => (
                    <div className={style.itemTopBadge}>
                        <div className={style.itemTopRow}>
                            <div className={style.itemTopPhoto} style={{ backgroundImage: `url('${item.thumbnail}')` }} />
                            <div className={style.itemTopInfo}>
                                <div className={style.itemTopName}>{item.firstName} {item.lastName}</div>
                                <div className={style.itemTopDescription}>{firstBadge(item.badgeData)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const lines = message => {
        return message.split('\n').map((line, index) => {
            const topBadges = component(line, 'topBadges');
            if (topBadges) return topBadges;
            return <div className={style.itemPreview} style={{ marginTop: index ? '5px' : '0px' }}>{line}</div>
        });
    };
    
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
                    {item.transfer ? <div className={style.surveyActions} style={{ pointerEvents: index === items.length - 1 ? 'auto' : 'none', opacity: index === items.length - 1 ? '1.0' : '0.8' }}>
                        {transfers.map(preset => <div className={style.surveyAction} onClick={() => ask(preset)}>{preset.message}</div>)}
                    </div> : null}
                </div>
            </div>
        </div>
    );
    
    const actions = [
        {
            icon: icons.archive,
            perform: remove
        }
    ];

    const updateInput = e => {
        setInput(e.target.value);
        
        e.target.style.height = '0px';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const accessory = () => {
        return (
            <div className={style.newChatInput}>
                <textarea 
                    className={style.itemInput}
                    ref={textField}
                    value={input} 
                    placeholder="Message..." 
                    onChange={updateInput} 
                    onFocus={() => setKeyboard(true)}
                    onBlur={() => { setTimeout(() => { setKeyboard(false) }, 50) }}
                    />
                    {/*  onKeyDown={e => e.key === 'Enter' && ask()} */}
                <div className={style.sendAction} style={{ backgroundImage: icons.send }} onClick={e => {e.stopPropagation();e.preventDefault();ask()}} />
            </div>
        );
    };

    const showHighFive = () => {
        setDialog({
            title: `Want to recognize someone?`,
            description: `Give a high five to a teammate!`,
            main: {
                title: 'Sure!',
                action: async () => {
                    // const result = await surveys.remove(current);

                    // if (!result) {
                    //     console.log('Error removing survey');
                    //     return;
                    // }

                    // const currentChat = current;
                    // const identifier = Math.random().toString(36);
                    // backIdentifier.current = identifier;

                    // await wait(500);
                    // props.onFinish && props.onFinish();
                    // props.onArchive && props.onArchive();
                    setDialog(null);
                    setPath('/contacts');


                    // if (current !== currentChat || backIdentifier.current !== identifier) return;
                    // setCurrent(null);
                    // previous.current = null;
                }
            },
            secondary: {
                title: 'No',
                action: async () => {
                    setDialog(null);
                }
            }
        });
    }

    const chatViewClass = conditional('ChatView', style, { visible: props.data !== null });
    const surveysClass = conditional('surveys', style, { visible: current === 'new' });
    const indicatorClass = conditional('indicator', style, { visible: showIndicator });

    if (!current) return <div className={chatViewClass} />;
    
    return (
        <div className={chatViewClass}>
            <NavigationView secondary title={'Chat'} bottom scroll={scroll} onBack={back} actions={actions} accessory={accessory}>
                <div className={style.items}>
                    <div className={surveysClass}>
                        <div className={style.surveyCard}>
                            <div className={style.surveyHeader}>
                                <div className={style.featuredIcon} style={{ backgroundImage: icons.surveyFeed }} />
                                <div className={style.featuredInfo}>
                                    <div className={style.featuredTitle}>Hey there! Here's some things you can ask me.</div>
                                    <div className={style.surveyActions}>
                                        {presets.map(preset => <div className={style.surveyAction} onClick={() => ask(preset)}>{preset.message}</div>)}
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
                    {/* <div style={{ width: '200px', height: '50px', backgroundColor: 'gray' }} onClick={() => setScale({})}>CLICK HERE</div> */}
                </div>
            </NavigationView>
            <ConfirmDialog data={dialog} />
            <ChatFeedbackDialog data={scale} onFinish={() => {setScale(null); showHighFive()}} />
        </div>
    );

};

export default ChatView;
