
import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import auth from '../../api/auth';
import icons from '../../resources/icons';
import SegmentTabs from '../SegmentTabs';
import { useTabSwitcher } from '../../utils/tabSwitcher';

import { useAppState } from '../../contexts/AppState';

import HighFiveDialog from '../HighFiveDialog';

const SignIn = props => {

    const [status, setStatus] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [page, setPage] = useState(0);
    const [type, setType] = useState('phone');
    const [identifier, setIdentifier] = useState('+1');
    const [code, setCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    const [typeTabs, selectedType, setSelectedType, typeViews] = useTabSwitcher('page', style, ['Phone', 'Email']);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+1');

    const { setAuth, setGroup, setGroupAdmin } = useAppState();

    const load = async () => {
        console.log('load auth')
        try {
            const result = await auth.fetch();
            console.log('load auth d')
            console.log('fetched');
            console.log(result);

            if (!result) {
                setStatus(1);
                return;
            }

            // const userData = localStorage.getItem('user');
            // const atData = localStorage.getItem('at');
            // if (!userData || !atData) setStatus(1);

            // const user = JSON.parse(userData);
            // // set auth

            // TODO: refactor this
            const group = (result.user.groups[0] || {})._id || null;
            const admin = (result.user.groups[0] || {}).admin || null;
            setAuth(result);
            setGroup(group);
            setGroupAdmin(admin);
            setStatus(2);
        } catch (e) {
            console.log(e);
            // setStatus(1);
        }
        // const result = await auth.load();
        // if (!result) setStatus(1);
        // setStatus(2);

        
        // console.log('load', auth);
    };

    const verify = async () => {
        console.log('verify');
        if (phone.length <= 10) return;
        setSubmitting(true);

        const result = await auth.verify({ [type]: phone.split('+').join('') });
        setSubmitting(false);

        if (!result) {
            // show error
            return;
        }

        if (!result.success && result.userNotFound) {
            setErrorMessage('Hmm, looks like there\'s no account that matches this phone number');
            return;
        }

        setPage(page => page + 1);
        console.log(result);
    };

    const signIn = async () => {
        if (code.length < 2) {
            console.log('code too short');
            return;
        }

        setSubmitting(true);

        const result = await auth.signIn({ [type]: phone.split('+').join(''), code });
        setSubmitting(false);

        if (!result) {
            // show error
            return;
        }

        if (result.invalidCode) {
            setCode('');
            console.log('invalid code');
            return;
        }

        console.log(result.user);
        // TODO: refactor this
        const group = (result.user.groups[0] || {})._id || null;
        const admin = (result.user.groups[0] || {}).admin || null;
        setAuth(result);
        setGroup(group);
        setGroupAdmin(admin);
        setStatus(2);
    };

    const switchType = type => {
        setType(type);
        setIdentifier('');
    };

    const reset = () => {
        setPage(0);
        setIdentifier('');
        setCode('');
        setEmail('');
        setPhone('+1');
        setSelectedType(0);
    };

    useEffect(() => { load() }, []);

    const nextActions = () => {
        if (page === 0) {
            return (
                <div className={style.actions}>
                    <div className={style.button} onClick={verify}>Get Started</div>
                </div>
            );
        }

        if (page === 1) {
            return (
                <div className={style.actions}>
                    <div className={style.button} onClick={signIn}>Sign In</div>
                </div>
            );
        }
    }

    return (
        <div className={conditional('SignIn', style, { visible: status !== 2 })}>
            <div className={style.content} style={{ display: status !== 0 ? 'block' : 'none' }}>
                <div className={style.info}>
                    <div className={style.brandIcon} style={{ backgroundImage: icons.icon }} />
                    <div className={style.itemName}>Sign in</div>
                    <div className={style.itemTitle}>You can sign in with your mobile phone number or email address.</div>
                </div>
                {/* <SegmentTabs selectedTab={selectedType} tabs={typeTabs} onSelect={setSelectedType} minimal /> */}
                <div className={style.pages}>
                    
                </div>
                <div className={typeViews[0]}>
                    {page === 0 ? <div className={style.field}>
                        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={type[0].toUpperCase() + type.substring(1, 10)} />
                    </div> : null}
                    {page === 1 ? <div className={style.field}>
                        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Verification code" />
                    </div> : null}
                </div>
                
                <div className={typeViews[1]}>
                    {page === 0 ? <div className={style.field}>
                        <input value={email} style={{ pointerEvents: 'none', opacity: '0.5' }} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    </div> : null}
                    {page === 1 ? <div className={style.field}>
                        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Verification code" />
                    </div> : null}
                </div>

                {nextActions()}
                {errorMessage ? <div className={style.errorMessage}>{errorMessage}</div> : null}
            </div>
            <div className={style.loading}>
                <div className={style.icon} />
            </div>
        </div>
    );

};

export default SignIn;
