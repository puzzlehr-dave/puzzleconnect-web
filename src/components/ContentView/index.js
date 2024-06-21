
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import icons from '../../resources/icons';
import { useAppState } from '../../contexts/AppState';

const NavigationView = props => {

    const [offset, setOffset] = useState(0);
    const reloading = useRef(null);
    const scrollRef = useRef();

    const { keyboard } = useAppState();

    useEffect(() => {
        if (!props.scroll) return;
        scrollRef.current.scrollTop = 40000;
    }, [props.scroll, keyboard]);

    const updateScroll = e => {
        setOffset(e.target.scrollTop);

        if (e.target.scrollTop < -60 && !reloading.current) {
            reloading.current = (new Date()).getTime();

            setTimeout(() => {
                if (reloading.current < (new Date()).getTime() - 2000) {
                    reloading.current = null;
                }
            }, 2000);

            props.onReload && props.onReload();
        }
    };

    const action = action => {
        if (action.primary) {
            return (
                <div className={style.action + ' ' + style.primary} onClick={() => action.perform()}>
                    {/* {action.icon ? <div className={style.actionIcon} style={{ backgroundImage: action.icon }} /> : null} */}
                    {action.name ? <div className={style.actionName}>{action.name}</div> : null}
                </div>
            );
        }

        return (
            <div className={style.action} onClick={() => action.perform()}>
                {action.icon ? <div className={style.actionIcon} style={{ backgroundImage: action.icon }} /> : null}
                {action.name ? <div className={style.actionName}>{action.name}</div> : null}
            </div>
        );
    };

    const back = () => (
        <div className={style.back} onClick={() => props.onBack && props.onBack()}>
            <div className={style.backIcon} style={{ backgroundImage: icons.back }} />
        </div>
    );

    const navigationClass = conditional('NavigationView', style, {
        main: props.main,
        side: props.side,
        primary: props.primary,
        secondary: props.secondary,
        modal: props.modal
    });

    const titleVisible = offset > 60 || props.header;
    const titleClass = conditional('title', style, { visible: titleVisible || props.persistTitle });

    const contentClass = conditional('content', style, { keyboard, withAccessory: props.accessory != null });
    const headerClass = conditional('header', style, { visible: !props.hideHeader });
    const navigationBarClass = conditional('navigationBar', style, { visible: titleVisible });
    const accessoryClass = conditional('accessory', style, { keyboard });
    
    return (
        <div className={navigationClass}>
            <div ref={scrollRef} className={contentClass} onScroll={updateScroll}>
                <div className={headerClass}>
                    <div className={style.headerTitle}>{props.titleLarge || props.title}</div>
                    {props.subtitle ? <div className={style.headerSubtitle}>{props.subtitle}</div> : null}
                </div>
                <div className={style.main}>
                    {props.children}
                </div>
            </div>
            <div className={navigationBarClass}>
                {props.onBack ? back() : null}
                <div className={titleClass}>{props.title}</div>
                <div className={style.space} />
                <div className={style.actions}>
                    {(props.actions || []).map(action)}
                </div>
            </div>
            {props.accessory ? <div className={accessoryClass}>
                {props.accessory()}
            </div> : null}
        </div>
    );

};

export default NavigationView;
