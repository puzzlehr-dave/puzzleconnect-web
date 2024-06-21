
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons, { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import SegmentTabs from '../SegmentTabs';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import { useTabSwitcher } from '../../utils/tabSwitcher';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';
import useSmoothState from '../../utils/useSmoothState';
import surveys from '../../api/surveys';
import users from '../../api/users';

const actions = [];

const NewUserView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    const [dialog, setDialog] = useState(null);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');

    const [accessTabs, selectedAccess, setSelectedAccess, accessViews] = useTabSwitcher('page', style, ['User', 'Puzzle Admin']);

    const [updated, setUpdated] = useState({});

    const backIdentifier = useRef(null);
    const previous = useRef(null);
    const groupRef = useRef(null);

    const fetch = async (group, reload = true) => {
        groupRef.current = group;
    };

    useEffect(() => {
        if (!props.data) return;
        setCurrent(props.data);

        setEmail(props.data.email);
        setPhone(props.data.phone);
        setFirstName(props.data.firstName);
        setLastName(props.data.lastName);
        setProfilePhoto(props.data.photo);
        setSelectedAccess(props.data.admin ? 1 : 0);

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

        setEmail('');
        setPhone('');
        setFirstName('');
        setLastName('');
        setProfilePhoto('');
        setUpdated({});
        setSelectedAccess(0);
    };

    const save = async () => {
        if (![firstName, lastName].every(field => field.length > 0)) {
            alert('You must enter a valid name for this user');
            return;
        }

        if (email.length < 5 || !email.includes('@') || !email.includes('.') || email.trim().includes(' ')) {
            alert('You must enter a valid email for this user');
            return;
        }
        
        if (phone.length < 11) {
            alert('You must enter a valid mobile phone for this user');
            return;
        }

        console.log('updating', current);
        console.log(current);

        const update = Object.keys(updated).reduce((result, current) => ({ ...result, [current]: { email, phone, firstName, lastName, admin: selectedAccess === 1 }[current] }), {});
        const result = await users.update(current._id, update);

        if (result.emailTaken) {
            alert('Could not update this user because the updated email address is already taken');
            return;
        }

        if (result.phoneTaken) {
            alert('Could not update this user because the updated phone number is already taken');
            return;
        }

        props.onSave();
        
        const profile = current;
        const identifier = Math.random().toString(36);
        backIdentifier.current = identifier;

        await wait(500);

        if ((current && profile && current._id !== profile._id) || backIdentifier.current !== identifier) return;
        setCurrent(null);
        previous.current = null;

        setEmail('');
        setPhone('');
        setFirstName('');
        setLastName('');
        setProfilePhoto('');
        setUpdated({});
        setSelectedAccess(0);
    };

    const user = () => {
        if (!auth || !auth.user) return {};
        return auth.user;
    };

    const data = () => {
        const groups = user().groups || [];
        if (!groups.length) return {};

        const active = groups.filter(data => data._id === group)[0];
        if (!active) return {};

        return active;
    };

    const finish = () => {
        setDialog(null);
    };

    const newUserViewClass = conditional('NewUserView', style, { visible: props.data });
    
    const profileUser = current ? current : (props.root ? user() : {});
    const profileData = current ? { ...data(), data: current.groupData } : (props.root ? data() : {});

    return (
        <div className={newUserViewClass}>
            <div className={style.container}>
                <NavigationView title="Edit User" modal onClose={!props.root ? back : null} hideHeader persistTitle actions={actions}>
                    <div className={style.profile}>
                        <div className={style.answerInput} style={{ display: 'flex' }}>
                            <input
                                className={style.answer}
                                style={{ marginRight: '6px' }}
                                value={firstName}
                                onChange={e => { setUpdated(u => ({ ...u, firstName: true })); setFirstName(e.target.value) }}
                                placeholder="First Name" />
                            <input
                                className={style.answer}
                                style={{ marginLeft: '6px' }}
                                value={lastName}
                                onChange={e => { setUpdated(u => ({ ...u, lastName: true })); setLastName(e.target.value) }}
                                placeholder="Last Name" />
                        </div>
                        <div className={style.answerInput}>
                            <input
                                className={style.answer}
                                value={email}
                                onChange={e => { setUpdated(u => ({ ...u, email: true })); setEmail(e.target.value) }}
                                placeholder="Email" />
                        </div>
                        <div className={style.answerInput}>
                            <input
                                className={style.answer}
                                value={phone}
                                onChange={e => { setUpdated(u => ({ ...u, phone: true })); setPhone(e.target.value) }}
                                placeholder="Phone" />
                        </div>
                    </div>
                    {/* <div className={style.section}>
                        <div className={style.sectionTitle}>Choices</div>
                        <div className={style.sectionContent}>
                            {answers.map(answerInput)}
                            <div className={style.newAnswer} onClick={addAnswer}>
                                <div className={style.newAnswerIcon} style={{ backgroundImage: icons.addColor }} />
                                <div className={style.newAnswerText}>Add Answer</div>
                            </div>
                        </div>
                    </div> */}
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Profile Photo</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <div className={style.upload}>
                                <div className={style.uploadButton}>Upload</div>
                                <div className={style.uploadText}>None selected</div>
                            </div>
                        </div>
                    </div>
                    <div className={style.section}>
                        <div className={style.sectionTitle}>Access</div>
                        <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                            <SegmentTabs selectedTab={selectedAccess} tabs={accessTabs} onSelect={index => { setUpdated(u => ({ ...u, admin: true })); setSelectedAccess(index)}} />
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

export default NewUserView;
