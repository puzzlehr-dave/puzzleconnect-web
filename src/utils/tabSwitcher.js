
import { useRef, useState, useEffect } from 'react';
import conditional from './conditional';

export const useTabSwitcher = (className, style, tabs) => {

    const loaded = useRef(false);
    const transitionIdentifier = useRef(Math.random().toString());

    const [selectedTab, setSelectedTab] = useState(0);

    const [displays, setDisplays] = useState(tabs.map((_, i) => i === 0));
    const [visibilities, setVisibilities] = useState(tabs.map((_, i) => i === 0));

    useEffect(() => {
        if (!loaded.current) {
            loaded.current = true;
            return;
        }

        // setVisibilities(tabs.map(_ => false));
        setVisibilities(tabs.map((_, i) => i === selectedTab))

        const update = Math.random().toString(36);
        transitionIdentifier.current = update;

        setTimeout(() => {
            if (transitionIdentifier.current !== update) return;
            setDisplays(tabs.map((_, i) => i === selectedTab));
            // setTimeout(() => setVisibilities(tabs.map((_, i) => i === selectedTab)), 0);
        }, 500);
    }, [selectedTab]);

    const classStyle = i => ({ display: displays[i] || false, visible: visibilities[i] || false })
    const classNames = tabs.map((_, i) => conditional(className, style, classStyle(i)));

    return [tabs, selectedTab, setSelectedTab, classNames];

};
