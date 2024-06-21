
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons, { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import SegmentTabs from '../SegmentTabs';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import { useTabSwitcher } from '../../utils/tabSwitcher';
import conditional from '../../utils/conditional';
import users from '../../api/users';
import groups from '../../api/groups';

const actions = [];

const NewUserRoleView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    const [dialog, setDialog] = useState(null);

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [title, setTitle] = useState('');
    const [permissionTabs, selectedPermission, setSelectedPermission, permissionViews] = useTabSwitcher('page', style, ['Standard', 'Admin']);

    const [appUsers, setAppUsers] = useState([]);

    const backIdentifier = useRef(null);
    const previous = useRef(null);
    const groupRef = useRef(null);

    const fetch = async (group, reload = true) => {
        groupRef.current = group;
        
        const available = await users.list();

        if (!available) {
            console.log('Error fetching available users');
            return;
        }

        setAppUsers(available);
    };

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);

        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        fetch(group);
    }, [props.data]);

    const wait = time => new Promise(resolve => setTimeout(() => { resolve() }, time));

    const back = async () => {
        props.onBack();

        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setSearch('');
        setSelected(null);
        setSuggestions([]);
        setSelectedPermission(0);
        setTitle('');
    };

    const save = async () => {
        // alert(JSON.stringify(current));
        // if (![firstName, lastName].every(field => field.length > 0)) {
        //     alert('You must enter a valid name for this user');
        //     return;
        // }

        // if (email.length < 5 || !email.includes('@') || !email.includes('.') || email.trim().includes(' ')) {
        //     alert('You must enter a valid email for this user');
        //     return;
        // }
        
        // if (phone.length < 11) {
        //     alert('You must enter a valid mobile phone for this user');
        //     return;
        // }

        if (!selected) {
            alert('You must select a user first.');
            return;
        }

        if (!title.length) {
            alert('You must enter a title first.');
            return;
        }

        // return;

        const result = await groups.put(current.group, selected._id, {
            title,
            admin: selectedPermission === 1
        });

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setSearch('');
        setSelected(null);
        setSuggestions([]);
        setSelectedPermission(0);
        setTitle('');
    };

    const finish = () => {
        setDialog(null);
    };

    const suggestionValid = data => {
        if (data.email.toLowerCase().includes(search.toLowerCase())) return true;
        if (data.firstName.toLowerCase().includes(search.toLowerCase())) return true;
        if (data.lastName.toLowerCase().includes(search.toLowerCase())) return true;
        return false;
    };

    const suggestion = data => (
        <div className={style.suggestion} onClick={() => { setSelected(data) }}>
            <div className={style.suggestionName}>{data.firstName} {data.lastName}</div>
            <div className={style.suggestionPreview}>{data.email}</div>
        </div>
    );

    const item = (item, index) => (
        <div className={conditional('item', style, { })} onClick={() => {}}>
            <div className={style.itemContent}>
                <div className={style.itemInfo}>
                    <div className={style.itemPhoto} style={{ backgroundImage: `url(${item.thumbnail})` }} />
                    <div className={style.itemNameContent}>
                        <div className={style.itemName}>{item.firstName + ' ' + item.lastName}</div>
                        <div className={style.itemPreview}>{item.email}</div>
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
                    <div className={style.delete} style={{ backgroundImage: icons.remove }} onClick={() => { setSelected(null); setSearch('') }}></div>
                </div>
            </div>
        </div>
    );

    const newUserRoleViewClass = conditional('NewUserRoleView', style, { visible: props.data });

    const userSuggestions = (search.length >= 3 ? appUsers : []).filter(suggestionValid);

    return (
        <div className={newUserRoleViewClass}>
            <div className={style.container}>
                <NavigationView title="Add User" modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                    {selected ? (
                        <div className={style.answerInput}>
                            {item(selected)}
                        </div>
                    ) : (
                        <div className={style.answerInput}>
                            <input
                                className={style.answer}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="User name or email" />
                            <div className={style.suggestions} style={{ display: userSuggestions.length ? 'block' : 'none' }}>
                                {userSuggestions.map(suggestion)}
                            </div>
                        </div>
                    )}
                    </div>
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Company info</div>
                        <div className={style.sectionContent}>
                            <input
                                className={style.answer}
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Title" />
                        </div>
                    </div>
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Access</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <SegmentTabs selectedTab={selectedPermission} tabs={permissionTabs} onSelect={index => { setSelectedPermission(index)}} />
                            <div className={style.surveyActions}>
                                <div className={style.surveyAction + ' ' + style.secondary} onClick={back}>Cancel</div>
                                <div className={style.surveyAction} onClick={save}>Save</div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: '20px'}} />
                </NavigationView>
            </div>
        </div>
    );

};

export default NewUserRoleView;
