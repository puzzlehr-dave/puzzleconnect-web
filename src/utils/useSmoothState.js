
import { useState } from 'react';

const useSmoothState = (state, transition = 0.0, alwaysDelay = false) => {
    const [smoothState, setSmoothState] = useState(state);

    const setState = value => {
        const update = value === 'initial' ? state : value;
        const delay = value === 'initial' || alwaysDelay ? transition * 1000 : 0;
        delay > 0 ? setTimeout(() => { setSmoothState(update) }, delay) : setSmoothState(update);
    };

    return [smoothState, setState];
};

export default useSmoothState;
