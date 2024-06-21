
import React, { useState, useEffect } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import { useAppState } from '../../contexts/AppState';
import icons from '../../resources/icons';

const Sidebar = props => {

    const links = [
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
            path: '/chat',
            role: 'user'
        },
        // {
        //     icon: icons.tickets,
        //     iconSelected: icons.ticketsSelected,
        //     name: 'Tickets',
        //     path: '/tickets'
        // },
        {
            icon: icons.directory,
            iconSelected: icons.directorySelected,
            name: 'Team',
            path: '/contacts',
            role: 'user'
        },
        {
            icon: icons.profile,
            iconSelected: icons.profileSelected,
            name: 'Profile',
            path: '/profile',
            role: 'user'
        },
        // {
        //     icon: icons.survey,
        //     iconSelected: icons.surveySelected,
        //     name: 'Trends',
        //     path: '/trends',
        //     groupAdmin: true,
        //     role: 'analytics'
        // },
        {
            icon: icons.chart,
            iconSelected: icons.chartSelected,
            name: 'Aggregates',
            path: '/aggregates',
            groupAdmin: true,
            role: 'analytics'
        },
        {
            icon: icons.users,
            iconSelected: icons.usersSelected,
            name: 'Users',
            path: '/users',
            admin: true,
            role: 'admin'
        },
        {
            icon: icons.organizations,
            iconSelected: icons.organizationsSelected,
            name: 'Organizations',
            path: '/organizations',
            admin: true,
            role: 'admin'
        },
        {
            icon: icons.survey,
            iconSelected: icons.surveySelected,
            name: 'Surveys',
            path: '/surveys',
            groupAdmin: true,
            role: 'admin'
        },
        {
            icon: icons.response,
            iconSelected: icons.responseSelected,
            name: 'Responses',
            path: '/responses',
            groupAdmin: true,
            role: 'admin'
        },
        // {
        //     icon: icons.response,
        //     iconSelected: icons.responseSelected,
        //     name: 'Replies',
        //     path: '/replies'
        // },
        {
            icon: icons.book,
            iconSelected: icons.bookSelected,
            name: 'Information',
            path: '/information',
            groupAdmin: true,
            role: 'admin'
        },
        // {
        //     icon: icons.badge,
        //     iconSelected: icons.badgeSelected,
        //     name: 'Badges',
        //     path: '/Badges'
        // }
    ];

    const { path, setPath, auth, groupAdmin, role } = useAppState();

    useEffect(() => {
        const link = links.filter(data => data.path === path && data.role === role)[0];
        console.log('link', link);
        
        if (!link && role === 'admin') {
            setPath('/users');
            return;
        }
        
        if (!link) {
            setPath('/');
        }
    }, [role]);

    const link = (link, index) => {
        const className = conditional('link', style, { 
            selected: path === link.path
        });

        return (
            <div className={className} onClick={() => setPath(link.path)}>
                <div className={style.icon} style={{ backgroundImage: path === link.path ? link.iconSelected : link.icon }}></div>
                <div className={style.name}>{link.name}</div>
            </div>
        );
    };

    const profile = () => {
        if (!auth || !auth.user) return {};
        return auth.user;
    };
    
    return (
        <div className={style.Sidebar}>
            <div className={style.content}>
                <div className={style.links}>
                    {/* <div className={style.brand} style={{ background: icons.icon }} /> */}
                    {links.filter(link => link.path === '/' && role === 'admin' ? false : true).filter(link => link.role ? link.role === role : true).filter(link => link.admin ? (profile().admin === true) : (link.groupAdmin ? (groupAdmin) : true)).map(link)}
                </div>
                
                {/* <div className={style.account} onClick={() => setPath('/profile')}>
                    <div className={style.accountPhoto} style={{ backgroundImage: `url(${profile().photo})` }} />
                    <div className={style.accountInfo}>
                        <div className={style.accountName}>{profile().firstName} {profile().lastName}</div>
                        <div className={style.accountGroup}>PuzzleHR</div>
                    </div>
                </div> */}
            </div>
        </div>
    );

};

export default Sidebar;
