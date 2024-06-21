
import React, { useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import bridge from 'bridge-request';

import NavigationView from '../ContentView';
import FeedView from '../FeedView';
import icons from '../../resources/icons';
import groups from '../../api/groups';
import { useEffectGroup, useAppState } from '../../contexts/AppState';
import ConfirmDialog from '../ConfirmDialog';
import ProfileView from '../ProfileView';
import HighFiveDialog from '../HighFiveDialog';
import AwardView from '../AwardView';

const ShortcutsView = props => {

    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);
    const [dialog, setDialog] = useState(null);
    const [profile, setProfile] = useState(null);
    const [award, setAward] = useState(null);

    const { auth, group } = useAppState();

    const actions = [];

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

    const fetch = async group => {
        const members = await groups.members(group);

        if (!members) {
            console.log('error fetching members');
            return;
        }

        setItems(members.filter(member => member._id !== ((auth || {}).user || {})._id));
    };

    useEffectGroup(fetch);

    const select = index => {
        setProfile(items[index]);
        setSelected(index);
    };

    const wait = time => new Promise(resolve => setTimeout(() => { resolve(time);
    }, time));

    const highFive = user => {
        console.log('highFive');
        console.log(user);
        setAward(user);

        /*
        setDialog({
            title: 'High five ' + user.firstName.trim(),
            description: 'What do you want to recognize ' + user.firstName.trim() + ' for?',
            main: {
                title: 'High Five',
                action: async () => {
                    try {
                        const badge = {
                            badge: '65411f2ef61fc63c2b05b51d',
                            to: user._id
                        };

                        await groups.post(group, 'highFive', badge);
                        setDialog(null);

                        await wait(800);

                        setDialog({
                            title: 'Awarded High Five to ' + user.firstName.trim() + '!',
                            description: 'Your high five is now visible on ' + user.firstName.trim() + '\'s profile.',
                            main: {
                                title: 'Show Profile',
                                action: async () => {
                                    setProfile(user);
                                    setDialog(null);
                                }
                            },
                            secondary: {
                                title: 'Done',
                                action: () => {
                                    setDialog(null);
                                }
                            }
                        })
                    } catch (e) {}
                }
            },
            secondary: {
                title: 'Cancel',
                action: async () => {
                    setDialog(null);
                }
            }
        }); 
        */
    };

    const open = async url => {
        try {
            await bridge.request('openLink', { url });
        } catch (e) {
            console.log('Could not make request to bridge application');
        }
    };

    const item = (item, index) => (
        <div className={conditional('item', style, { selected: selected === index })} onClick={() => select(index)}>
            <div className={style.itemContent}>
                <div className={style.itemInfo}>
                    <div className={style.itemPhoto} style={{ backgroundImage: `url(${item.thumbnail})` }} />
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.firstName + ' ' + item.lastName}</div>
                        <div className={style.itemPreview}>{item.groupData.title}</div>
                        {/* <div className={style.itemActions}>
                            <div className={style.itemAction} onClick={(e) => {e.stopPropagation();e.preventDefault(); highFive(item)}}>
                                <div className={style.itemActionIcon} style={{ backgroundImage: icons.highFive }} />
                                <div className={style.itemActionTitle}>High Five</div>
                            </div>
                            <div className={style.itemActionSecondary}>
                                <div className={style.itemActionIcon} />
                                <div className={style.itemActionTitle}>Give Badge</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );

    const shortcut = (item, index) => (
        <div className={conditional('item', style, { selected: false })} onClick={() => open(item.url)}>
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
    
    return (
        <div className={style.FeedList}>
            <NavigationView primary title="Shortcuts" actions={actions}>
                <div className={style.items}>
                    {(shortcuts || []).map(shortcut)}
                </div>
            </NavigationView>
        </div>
    );

};

export default ShortcutsView;
