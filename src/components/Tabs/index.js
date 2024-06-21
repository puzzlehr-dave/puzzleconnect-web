
import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import { useAppState } from '../../contexts/AppState';
import icons from '../../resources/icons';

const Tabs = props => {

    const tabs = [
        {
            icon: icons.home,
            iconSelected: icons.homeColor,
            name: 'Home',
            path: '/'
        },
        {
            icon: icons.chat,
            iconSelected: icons.chatColor,
            name: 'Chat',
            path: '/chat'
        },
        // {
        //     icon: icons.home,
        //     name: 'Groups',
        //     path: '/goals'
        // },
        {
            icon: icons.directory,
            iconSelected: icons.directorySelected,
            name: 'Team',
            path: '/contacts'
        },
        {
            icon: icons.profile,
            iconSelected: icons.profileSelected,
            name: 'Profile',
            path: '/profile'
        },
        {
            icon: icons.shortcut,
            iconSelected: icons.shortcutSelected,
            name: 'Shortcuts',
            path: '/shortcuts'
        }
    ];

    const { path, setPath } = useAppState();

    const wait = time => new Promise(resolve => setTimeout(() => { resolve(time) }, time));

    const cycle = async () => {
        for (const tab of tabs) {
            setPath(tab.path);
            await wait(50);
        }

        setPath(tabs[0].path);
    };

    useEffect(() => { cycle() }, []);

    const tab = (tab, index) => {
        const selected = path === tab.path;

        const tabClass = conditional('tab', style, { selected });
        const iconClassNormal = conditional('iconState', style, { visible: !selected });
        const iconClassSelected = conditional('iconState', style, { visible: selected });

        return (
            <div className={tabClass} onClick={() => setPath(tab.path)}>
                <div className={style.icon}>
                    <div className={iconClassNormal} style={{ backgroundImage: tab.icon }} />
                    <div className={iconClassSelected} style={{ backgroundImage: tab.iconSelected }} />
                </div>
                <div className={style.name}>{tab.name}</div>
            </div>
        );
    };

    return (
        <div className={style.Tabs}>
            <div className={style.tabs}>
                {tabs.map(tab)}
            </div>
        </div>
    );

};

export default Tabs;
