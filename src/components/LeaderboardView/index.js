
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import axios from 'axios';
import bridge from 'bridge-request';

import NavigationView from '../ContentView';
import conditional from '../../utils/conditional';
import icons, { awardIcon } from '../../resources/icons';
import ProfileView from '../ProfileView';
import badges from '../../api/badges';
import { useAppState } from '../../contexts/AppState';

const NotificationsView = props => {

    const test = [
        {
            name: 'Employee Satisfaction',
            preview: 'Chris Timol invited you to take a survey.',
            date: 'Yesterday'
        },
        {
            name: 'Compliance Report',
            preview: 'Time to submit your weekly survey.',
            date: 'Oct 8'
        },
        {
            name: 'Manager Approval Rating',
            preview: 'Joe Daggar invited you to take a survey.',
            date: 'Oct 4'
        },
        {
            name: 'Workplace Environment',
            preview: 'Geeky Interactive invited you to take a survey.',
            date: 'Oct 3'
        }
    ];

    const shortcuts = [
        {
            name: 'Front Dashboard',
            description: 'Catch up on your tickets',
            icon: 'test',
            url: 'https://front.com/'
        },
        {
            name: 'PuzzleHR Website',
            description: 'Visit our official website',
            icon: 'test',
            url: 'https://puzzlehr.com/'
        }
    ];

    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');

    const { group, role } = useAppState();

    const fetch = async () => {
        const leaderboard = await badges.leaderboard(group);
        if (leaderboard) setItems(leaderboard);

        console.log(leaderboard);
        console.log('leaderboard');
    };

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);
    }, [props.data]);

    useEffect(() => {
        fetch();
    }, [group]);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));
    
    const response = item => (
        <div className={style.response}>
            <div className={style.responseInfo}>
                <div className={style.responsePhoto} />
                <div className={style.responseName}>{'Gabe The Coder'}</div>
            </div>
            <div className={style.responseText}>{item.preview}</div>
        </div>
    );

    const select = index => {
        
    };

    const itemBadge = data => (
        <div className={style.itemBadge}>
            <div className={style.itemBadgeIcon} style={{ backgroundImage: awardIcon(data.name) }} />
            <div className={style.itemBadgeName}>{data.secondaryInfo ? data.secondaryInfo.description + ' ' : ''}{data.name}</div>
        </div>
    );
    
    const item = (item, index) => (
        <div className={conditional('item', style, { selected: false })} >
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: `url('${item.thumbnail || 'https://cdn2.hubspot.net/hub/6444014/hubfs/PuzzleHR_October2019/images/Puzzle_favicon-150x150.png?width=108&height=108'}` }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.firstName} {item.lastName}</div>
                        <div className={style.itemBadges}>
                            {item.badgeData.map(itemBadge)}
                        </div>
                        <div className={style.surveyActions}>
                            <div className={style.surveyAction} onClick={() => props.onSelectUser(item)}>High Five</div>
                            <div className={style.surveyAction} onClick={() => props.onSelectUserCompliment(item)}>Give Compliment</div>
                            {/* <div className={style.surveyAction}>Give Compliment</div> */}
                            {/* {presets.map(preset => <div className={style.surveyAction} onClick={() => ask(preset)}>{preset.message}</div>)} */}
                        </div>
                        <div className={style.itemDate}>{item.date}</div>
                    </div>
                    <div className={style.itemPreview}>{item.preview}</div>
                </div>
            </div>
        </div>
    );

    const open = async url => {
        try {
            await bridge.request('openLink', { url });
        } catch (e) {
            console.log('Could not make request to bridge application');
        }
    };

    const shortcut = (item, index) => (
        <div className={conditional('item', style, { selected: false })} onClick={() => window.open(item.url, '_blank')}>
            <div className={style.itemContent}>
                <div className={style.itemPhoto} style={{ backgroundImage: `url('${item.thumbnail || 'https://cdn2.hubspot.net/hub/6444014/hubfs/PuzzleHR_October2019/images/Puzzle_favicon-150x150.png?width=108&height=108'}` }} />
                <div className={style.itemInfo}>
                    <div className={style.itemNameContent}>
                        <div className={style.itemName} style={{ marginBottom: '0px' }}>{item.name}</div>
                        <div className={style.itemDate} style={{ marginLeft: '0px' }}>{item.description}</div>
                    </div>
                    {/* <div className={style.itemPreview}>{item.preview}</div> */}
                </div>
            </div>
        </div>
    );

    const notificationsViewClass = conditional('NotificationsView', style, { visible: props.data !== null });
    
    const actions = [];

    return (
        <div className={notificationsViewClass}>
            <NavigationView title={role === 'analytics' ? 'Top Performers' : 'Shortcuts'} side onBack={() => props.onBack()} actions={actions}>
                <div className={style.items}>
                    {role === 'analytics' ? (
                        (items || []).filter((data, index) => data.badgeData.length && index < 5).map(item)
                    ) : (
                        (shortcuts || []).map(shortcut)
                    )}
                </div>
            </NavigationView>
        </div>
    );

};

export default NotificationsView;
