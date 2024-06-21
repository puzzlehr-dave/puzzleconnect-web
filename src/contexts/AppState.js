
import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

const AppState = props => {

    const [auth, setAuth] = useState(null);
    const [group, setGroup] = useState(null);
    const [groupAdmin, setGroupAdmin] = useState(false);
    const [path, setPath] = useState('/');
    const [role, setRole] = useState('user');
    const [keyboard, setKeyboard] = useState(false);
    const [organizationAdmin, setOrganizationAdmin] = useState(false);

    const [shortcutIdentifier, setShortcutIdentifier] = useState('');

    const runShortcut = identifier => {
        setShortcutIdentifier(identifier + '_' + Math.random().toString(36));
    };

    const value = {
        auth,
        setAuth,
        group,
        setGroup,
        groupAdmin,
        setGroupAdmin,
        path,
        setPath,
        role,
        setRole,
        organizationAdmin,
        setOrganizationAdmin,
        keyboard,
        setKeyboard,
        shortcutIdentifier,
        runShortcut
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );

};

export const useAppState = () => useContext(AppContext);

export const useEffectAuth = perform => {
    const { auth } = useAppState();
    useEffect(() => { perform() }, [auth]);
};

export const useEffectGroup = perform => {
    const { group } = useAppState();
    useEffect(() => { perform(group) }, [group]);
};

// TODO: evaluate if this needed

export const useEffectOrganizationAdmin = perform => {
    const { organizationAdmin } = useAppState();
    useEffect(() => { perform && perform(organizationAdmin) }, [organizationAdmin]);
};

export const useShortcut = (identifier, action) => {
    const { shortcutIdentifier } = useAppState();

    const update = () => {
        const id = shortcutIdentifier.split('_')[0];
        if (id === identifier) action();
    };

    useEffect(() => { update() }, [shortcutIdentifier]);
};

export default AppState;
