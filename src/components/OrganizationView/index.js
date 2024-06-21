
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import EditOrganizationView from '../EditOrganizationView';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import ProfileView from '../ProfileView';
import { useAppState } from '../../contexts/AppState';
import chat from '../../api/chat';
import groups from '../../api/groups';
import date from '../../utils/date';
import formatPhone from '../../utils/formatPhone';
import axios from 'axios';
import EditUserRoleView from '../EditUserRoleView';
import NewUserRoleView from '../NewUserRoleView';

const OrganizationView = props => {

    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([]);
    const [scroll, setScroll] = useState(null);
    const [showIndicator, setShowIndicator] = useState(false);
    const [dialog, setDialog] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [add, setAdd] = useState(null);

    const { group, setGroup } = useAppState();

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data._id);
        setUser(null);
        setRole(null);
        setAdd(null);
    }, [props.data]);

    const fetch = async () => {
        const prev = previous.current;
        previous.current = current;
        if (prev === current || prev === 'new') return;

        setItems([]);
        setShowIndicator(false);


        const users = await groups.members(current);

        if (!users) {
            console.log('error fetching users');
            return;
        }

        setItems(users);
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
        
        setUser(null);
        setRole(null);
        setAdd(null);
    };

    const remove = async () => {
        setDialog({
            title: `Delete This Organization?`,
            description: `If you delete, every user will no longer access this organization or it's data.`,
            main: {
                title: 'Delete',
                action: async () => {
                    const result = await groups.remove(current);

                    if (!result) {
                        console.log('Error removing organization');
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

    const refresh = async () => {
        const users = await groups.members(current);

        if (!users) {
            console.log('error fetching users');
            return;
        }

        setItems(users);
    };

    const onSave = () => {
        setUser(null);
        setRole(null);
        setAdd(null);
        fetch();

        props.onUpdate && props.onUpdate();
        refresh();
    };

    const organizationViewClass = conditional('OrganizationView', style, { visible: props.data !== null });
    const surveysClass = conditional('surveys', style, { visible: props.data !== null });
    const indicatorClass = conditional('indicator', style, { visible: showIndicator });

    if (!current) return <div className={organizationViewClass} />;

    const actions = [
        {
            icon: icons.edit,
            perform: () => setUser(props.data)
        },
        {
            icon: icons.add,
            perform: () => setAdd({ group: current })
        }
    ];

    const userRow = data => (
        <tr onClick={() => setRole({ ...data, group: current })}>
            <td>{data.firstName}</td>
            <td>{data.lastName}</td>
            <td>{data.email}</td>
            {/* <td>{formatPhone(data.phone)}</td> */}
            <td>{(data.groupData || {}).title || ''}</td>
            <td>{data.admin ? 'Admin' : 'Standard'}</td>
        </tr>
    );
    
    return (
        <div className={organizationViewClass}>
            <NavigationView secondary title={props.data.name} bottom scroll={scroll} onBack={back} actions={actions}>
                <div className={style.info}>
                    <div className={style.infoIcon} style={{ backgroundImage: props.data.public ? icons.publicSelected : icons.privateSelected }} />
                    <div className={style.infoText}>{props.data.public ? 'Public organization' : 'Private organization'}</div>
                </div>
                <div className={style.items}>
                    <div className={surveysClass}>
                        <div className={style.sectionContent}>
                            <table className={style.table}>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        {/* <th>Phone</th> */}
                                        <th>Title</th>
                                        <th>Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(userRow)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={style.delete}>
                        <div className={style.deleteButton} style={{ pointerEvents: group === current ? 'none' : 'auto', opacity: group === current ? '0.5' : '1.0' }} onClick={remove}>Delete Organization</div>
                    </div>
                </div>
            </NavigationView>
            <ConfirmDialog data={dialog} />
            <EditOrganizationView data={user} onBack={() => setUser(null)} onSave={onSave} />
            <EditUserRoleView data={role} onBack={() => setRole(null)} onSave={onSave} />
            <NewUserRoleView data={add} onBack={() => setAdd(null)} onSave={onSave} />
        </div>
    );

};

export default OrganizationView;
