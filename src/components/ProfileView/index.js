
import React, { useState, useRef, useEffect } from 'react';
import style from './style.module.css';
import icons, { awardIcon } from '../../resources/icons';

import NavigationView from '../ContentView';
import ConfirmDialog from '../ConfirmDialog';
import { useAppState, useEffectGroup } from '../../contexts/AppState';
import groups from '../../api/groups';
import badges from '../../api/badges';
import conditional from '../../utils/conditional';
import AwardView from '../AwardView';
import date from '../../utils/date';

const actions = [];

const ProfileView = props => {

    const { auth, group } = useAppState();

    const [current, setCurrent] = useState(null);
    
    // const [badges, setBadges] = useState([]);
    // const [fives, setFives] = useState([]);

    const [awards, setAwards] = useState([]);
    const [earned, setEarned] = useState([]);
    const [compliments, setCompliments] = useState([]);
    const [dialog, setDialog] = useState(null);

    const backIdentifier = useRef(null);
    const previous = useRef(null);
    const groupRef = useRef(null);

    const fetch = async (group, reload = true) => {
        groupRef.current = group;

        setAwards([]);
        setEarned([]);
        setCompliments([]);

        if (reload) {
            // setBadges([]);
            // setFives([]);

            // return;
        }

        fetchAwards();


        // const data = await groups.posts(group, 'badge'); // '652abf68d60a19a12ebb23fc');

        // if (!data) {
        //     console.log('error loading badges');
        //     return;
        // }

        // const items = {};
        // const counts = {};

        // for (const item of data) {
        //     if (props.data && props.data._id !== item.to._id) continue;
        //     if (!props.data && auth.user._id !== item.to._id) continue;

        //     const id = `${item.badge._id}_${item.user._id}`;
        //     const count = (counts[id] || 0) + 1;
        //     counts[id] = count;
        //     items[id] = { ...item, count };
        // }

        // setBadges(Object.values(items));
    };

    const fetchAwards = async () => {
        const user = current ? current : (props.root && auth ? auth.user : null);
        if (!user) return;

        console.log('fetch awards for user', user);

        const [awarded, badged, compliments] = await Promise.all([
            badges.awarded(group, user._id),
            badges.earned(group, user._id),
            badges.compliments(group, user._id)
        ]);

        if (!awarded || !badged || !compliments) {
            console.log('error fetching awards', awarded, badged, compliments);
            return;
        }
        
        setAwards(awarded);
        setEarned(badged);
        setCompliments(compliments);
    };

    useEffect(() => {
        if (!current) return;
        setDialog(null);
        fetchAwards();
    }, [current]);

    useEffectGroup(fetch); // for badges

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

        setAwards([]);
        setEarned([]);
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
        fetchAwards();
        setDialog(null);
    };

    const signOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('at');
        window.location.reload();
    };

    const award = (item, index) => (
        <div className={conditional('awardItem', style, { selected: false })}>
            <div className={style.awardItemContent}>
                <div className={style.awardItemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
                <div className={style.awardItemInfo}>
                    <div className={style.awardItemNameContent}>
                        <div className={style.awardItemName}>{item.name}</div>
                        <div className={style.awardItemDate}>{item.count}x</div>
                    </div>
                    {/* <div className={style.awardItemPreview}>{item.secondaryInfo.description || 'Serving customers'}</div> */}
                </div>
            </div>
        </div>
    );

    const postItem = item => (
        <div className={conditional('postItem', style, { selected: false })} onClick={() => { }}>
            <div className={style.postItemContent}>
                <div className={style.postItemInfo}>
                    <div className={style.postItemPhoto}>
                        {item.user.photo ? <img src={item.user.photo} /> : null}
                    </div>
                    <div className={style.postItemNameContent}>
                        <div className={style.postItemNameContainer}>
                            <div className={style.postItemName}>{item.user.firstName} {item.user.lastName}</div>
                            <div className={style.postItemDate}>{date.format(item.date)}</div>
                        </div>
                        <div className={style.postItemPreview}>{item.content}</div>
                        {item.image ? <div className={style.postItemMedia}>
                            <img src={item.image} />
                        </div> : null}
                        {/* <div className={style.itemDate}>{item.title}</div> */}
                    </div>
                </div>

                {/* <div className={style.itemActions}>
                    <div className={style.itemShare}>Share</div>
                </div> */}
            </div>
        </div>
    );

    const compliment = (item, index) => (
        <div className={conditional('awardItem', style, { selected: false })}>
            {JSON.stringify(item)}



            <div className={style.awardItemContent}>

                <div className={style.awardItemInfo}>
                    <div className={style.awardItemNameContent}>
                        <div className={style.awardItemName}>{item.user.firstName + ' ' + item.user.lastName}</div>
                        <div className={style.awardItemDate}>{item.count}x</div>
                    </div>
                </div> 
                {/* <div className={style.awardItemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
                <div className={style.awardItemInfo}>
                    <div className={style.awardItemNameContent}>
                        <div className={style.awardItemName}>{item.name}</div>
                        <div className={style.awardItemDate}>{item.count}x</div>
                    </div>
                </div> */}
            </div>
        </div>
    );

    const badge = (item, index) => (
        <div className={conditional('badgeItem', style, { selected: false })}>
            <div className={style.badgeItemContent}>
                <div className={style.badgeItemPhoto} style={{ backgroundImage: awardIcon(item.name) }} />
                <div className={style.badgeItemInfo}>
                    <div className={style.badgeItemNameContent}>
                        <div className={style.badgeItemName}>{item.name}</div>
                        {/* <div className={style.badgeItemDate}>{(item.secondaryInfo || {}).description}</div> */}
                    </div>
                    <div className={style.badgeItemPreview}>{(item.secondaryInfo || {}).description}</div>
                </div>
            </div>
        </div>
    );

    const profileViewClass = conditional('ProfileView', style, { visible: props.data || props.root, secondary: !props.root });
    
    const profileUser = current ? current : (props.root ? user() : {});
    const profileData = current ? { ...data(), data: current.groupData } : (props.root ? data() : {});

    if (!Object.keys(profileUser).length) return <div className={profileViewClass} />;

    return (
        <div className={profileViewClass}>
            <NavigationView secondary={!props.root} title="Profile" onBack={!props.root ? back : null} hideHeader actions={actions}>
                <div className={style.profile}>
                    <div className={style.itemPhoto}>
                        {profileUser.photo && profileUser.photo.length ? <img src={profileUser.photo} /> : null}
                    </div>
                    <div className={style.itemName}>{`${profileUser.firstName} ${profileUser.lastName}`}</div>
                    <div className={style.itemTitle} style={{ opacity: ((profileData || {}).data || {}).title ? '1.0' : '0.0' }}>{`${((profileData || {}).data || {}).title} at ${profileData.name}`}</div>
                </div>
                {props.root ? (
                    null
                    // <div className={style.actions}>
                    //     <div className={style.action}>
                    //         <div className={style.actionIcon} style={{ backgroundImage: icons.highFive }} />
                    //         <div className={style.actionTitle}>Edit Profile</div>
                    //     </div>
                    // </div>
                ) : (
                    <div className={style.actions}>
                        <div className={style.action} onClick={() => setDialog(current)}>
                            <div className={style.actionIcon} style={{ backgroundImage: icons.highFive }} />
                            <div className={style.actionTitle}>High Five</div>
                        </div>
                        {/* <div className={style.actionSecondary}>
                            <div className={style.actionIcon} />
                            <div className={style.actionTitle}>Give Badge</div>
                        </div> */}
                    </div>
                )}
                <div className={style.section}>
                    <div className={style.sectionTitle}>Badges</div>
                    <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                        <div className={style.badgeItems}>
                            {earned.map(badge)}
                        </div>
                    </div>
                </div>
                <div className={style.section}>
                    <div className={style.sectionTitle}>Compliments</div>
                    <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                        <div className={style.awardItems}>
                            {compliments.map(postItem)}
                        </div>
                    </div>
                </div>
                <div className={style.section}>
                    <div className={style.sectionTitle}>High Fives</div>
                    <div className={style.sectionContent} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                        <div className={style.awardItems}>
                            {awards.map(award)}
                        </div>
                    </div>
                </div>
                
                {/* <div className={style.section}> */}
                    <div className={style.surveyActions}>
                        {/* <div className={style.surveyAction} onClick={signOut}>Sign Out</div> */}
                        {/* <div className={style.surveyAction}>Delete</div> */}
                        {/* {presets.map(preset => <div className={style.surveyAction} onClick={() => ask(preset)}>{preset.message}</div>)} */}
                    </div>
                {/* </div> */}
                <div style={{ height: '16px' }} />
            </NavigationView>
            <AwardView award={dialog} onBack={() => setDialog(null)} onFinish={finish} />
        </div>
    );

};

export default ProfileView;
