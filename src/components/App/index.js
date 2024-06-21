
import React, { useState, useEffect } from 'react';
import style from './style.module.css';

import { useAppState } from '../../contexts/AppState';

import Tabs from '../Tabs';
import TitleBar from '../TitleBar';

import Home from '../Home';
import ChatList from '../ChatList';
import ChatView from '../ChatView';
import ProfileView from '../ProfileView'
import ContactsList from '../ContactsList';
import Sidebar from '../Sidebar';
import SignIn from '../SignIn';
import conditional from '../../utils/conditional';
import SurveyList from '../SurveyList';
import ResponseList from '../ResponseList';
import icons from '../../resources/icons';
import OrganizationList from '../OrganizationList';
import UserList from '../UserList';
import Aggregates from '../Aggregates';
import { identifiers } from '../Home';
import surveys from '../../api/surveys';
import ShortcutsView from '../ShortcutsView';

const roleLinks = [
    {
        icon: icons.profile,
        iconSelected: icons.profileSelected,
        name: 'Personal',
        role: 'user'
    },
    {
        icon: icons.chart,
        iconSelected: icons.chartSelected,
        name: 'Analytics',
        role: 'analytics',
        groupAdmin: true
    },
    {
        icon: icons.controls,
        iconSelected: icons.controlsSelected,
        name: 'Control Panel',
        role: 'admin',
        groupAdmin: true
    }
];

const App = props => {

    const { auth, setAuth, path, setPath, role, setRole, keyboard, groupAdmin, group } = useAppState();
    const [recommendations, setRecommendations] = useState([]);
    const route = (route, content) => <div style={{ display: route === path ? 'block' : 'none' }}>{content()}</div>

    const bottomClass = conditional('bottom', style, { keyboard })

    const app = true // window.webkit && window.webkit.messageHandlers;
    const appClass = conditional('App', style, { app });

    const categoryLink = link => {
        const className = conditional('roleLink', style, {
            selected: role === link.role
        });

        return (
            <div className={className} onClick={() => setRole(link.role)}>
                <div className={style.roleIcon} style={{ backgroundImage: role === link.role ? link.iconSelected : link.icon }}></div>
                <div className={style.roleName}>{link.name}</div>
            </div>
        );
    };

    const profile = () => {
        if (!auth || !auth.user) return {};
        return auth.user;
    };

    // DECIDED ON FETCH IN ONE PLACE TO REDUCE REQUESTS ON BOTH /HOME AND /AGGREGATES PAGES
    useEffect(() => {
        if(['/', '/aggregates'].includes(path)) {
             const fetch = async () => {
            const types = {
                daily: identifiers('daily'),
                monthly: identifiers('monthly'),
                yearly: identifiers('yearly')
            };

            const reports = await surveys.recommendations(group, types);


            if (reports) setRecommendations(reports);

        }
            fetch()
        };
    }, [group, path]);

    return (
        <div className={appClass}>
            <div className={style.top}>
                <div className={style.roleLinks}>
                    <div className={style.brand} style={{ background: icons.icon }} />
                    {roleLinks.filter(link => link.admin ? (profile().admin === true) : (link.groupAdmin ? (groupAdmin) : true)).map(categoryLink)}
                </div>
                <div className={style.account} onClick={() => setPath('/profile')}>
                    <div className={style.accountPhoto} style={{ backgroundImage: `url(${profile().photo})` }} />
                    <div className={style.accountInfo}>
                        <div className={style.accountName}>{profile().firstName} {profile().lastName}</div>
                        <div className={style.accountGroup}>PuzzleHR</div>
                    </div>
                </div>
                {/* <div className={style.organization}>
                    <div className={style.organizationText}>PuzzleHR</div>
                    <div className={style.organizationIcon} style={{ backgroundImage: icons.dropdown }} />
                </div> */}
            </div>
            <div className={style.main}>
                <div className={style.sidebar}>
                    <Sidebar />
                </div>
                <div className={style.content}>
                    {route('/', () => <Home recommendations={recommendations} />)}
                    {route('/aggregates', () => <Aggregates recommendations={recommendations} />)}
                    {route('/chat', () => <ChatList />)}
                    {route('/contacts', () => <ContactsList />)}
                    {route('/responses', () => <ResponseList />)}
                    {route('/replies', () => <ResponseList type="request" />)}
                    {route('/information', () => <ResponseList type="fragment" />)}
                    {route('/surveys', () => <SurveyList />)}
                    {route('/users', () => <UserList />)}
                    {route('/organizations', () => <OrganizationList />)}
                    {route('/profile', () => <ProfileView root />)}
                    {route('/shortcuts', () => <ShortcutsView />)}
                </div>
                <div className={bottomClass}>
                    <Tabs />
                </div>
            </div>
            <SignIn />
        </div>
    );

};

export default App;
