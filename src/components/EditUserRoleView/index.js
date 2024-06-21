
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons, { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import SegmentTabs from '../SegmentTabs';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import { useTabSwitcher } from '../../utils/tabSwitcher';
import groups from '../../api/groups';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';
import useSmoothState from '../../utils/useSmoothState';
import surveys from '../../api/surveys';

const actions = [];

const EditUserRoleView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);

    const [title, setTitle] = useState('');
    const [permissionTabs, selectedPermission, setSelectedPermission, permissionViews] = useTabSwitcher('page', style, ['Standard', 'Admin']);
    const [updated, setUpdated] = useState({});

    const backIdentifier = useRef(null);
    const previous = useRef(null);

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);

        setTitle((props.data.groupData || {}).title || '');
        setSelectedPermission(props.data.admin ? 1 : 0);

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

        setTitle('');
        setSelectedPermission(0);
        setUpdated({});
    };

    const save = async () => {
        // if (name.length < 1) {
        //     console.log('You need to enter the organization name');
        //     return;
        // }

        const update = Object.keys(updated).reduce((result, current) => ({ ...result, [current]: { title, admin: selectedPermission === 1 }[current] }), {});
        const result = await groups.put(current.group, current._id, update);

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setTitle('');
        setSelectedPermission(0);
        setUpdated({});
    };

    const editUserRoleViewClass = conditional('EditUserRoleView', style, { visible: props.data });

    return (
        <div className={editUserRoleViewClass}>
            <div className={style.container}>
                <NavigationView title="Edit User Role" modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                    <input
                        className={style.answer}
                        value={title}
                        onChange={e => { setUpdated(u => ({ ...u, title: true })); setTitle(e.target.value) }}
                        placeholder="Title" />
                    </div>
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Access</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <SegmentTabs selectedTab={selectedPermission} tabs={permissionTabs} onSelect={index => { setUpdated(u => ({ ...u, admin: true })); setSelectedPermission(index)}} />
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

export default EditUserRoleView;
