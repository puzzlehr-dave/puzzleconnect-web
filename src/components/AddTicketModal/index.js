
import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.css';
import conditional from '../../utils/conditional';
import applyStyle from '../../utils/applyStyle';
import api from '../../api';

// import { useApp } from '../../contexts/app';

const AddTicketModal = props => {

    // const { role, currentOrganization } = useApp();

    const categories = true ? [ // role === 'manager' ? [
        {
            identifier: 'payroll',
            title: 'Payroll',
            ticketTitle: 'Payroll',
            message: 'We\'d love to help you with payroll!'
        },
        {
            identifier: 'benefits',
            title: 'Benefits',
            ticketTitle: 'Benefits',
            message: 'We\'d love to help you with benefits!'
        },
        {
            identifier: 'sticky',
            title: 'Sticky Situation',
            ticketTitle: 'Sticky Situation',
            message: 'No worries, we\'ll resolve your sticky situation!'
        },
        {
            identifier: 'recruiting',
            title: 'HR',
            ticketTitle: 'HR',
            message: 'No worries, we\'ll resolve your sticky situation!'
        },
        {
            identifier: 'risk',
            title: 'Policy',
            ticketTitle: 'Policy',
            message: 'We\'d love to help you with policy!'
        },
        {
            identifier: 'other',
            title: 'Other',
            ticketTitle: 'Other',
            message: 'Tell us how we can help you reach your goals!'
        }
    ] : [
        {
            identifier: 'payroll',
            title: 'Payroll',
            ticketTitle: 'Payroll',
            message: 'We\'d love to help you with payroll!'
        },
        {
            identifier: 'benefits',
            title: 'Benefits',
            ticketTitle: 'Benefits',
            message: 'We\'d love to help you with benefits!'
        },
        {
            identifier: 'recruiting',
            title: 'HR',
            ticketTitle: 'HR',
            message: 'We\'d love to help you with HR!'
        },
        {
            identifier: 'pto',
            title: 'PTO',
            ticketTitle: 'PTO',
            message: 'We\'d love to help you with PTO!'
        },
        {
            identifier: 'other',
            title: 'Other',
            ticketTitle: 'Other',
            message: 'Tell us how we can help you reach your goals!'
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const categoriesPage = useRef();
    const messagePage = useRef();
    const confirmPage = useRef();

    const pages = { 'categories': categoriesPage, 'message': messagePage, "confirmation": confirmPage };

    const opacityLength = 0.3;
    const transformLength = 0.5;

    const pushedPages = useRef([]);
    const pageVisibilities = useRef({});

    useEffect(() => {
        if (!props.data) {
            pushedPages.current.forEach(page => hidePage(page));

            pushedPages.current = [];
            pageVisibilities.current = {};

            setSelectedCategory(null);
            setMessage('');

            return;
        }

        showPage('categories', true);
        pushedPages.current.push('categories');
    }, [props.data]);

    const back = () => {
        if (pushedPages.current.length < 2) {
            props.onDismiss();
            return;
        }

        const identifier = pushedPages.current[pushedPages.current.length - 1];
        hidePage(identifier);

        pushedPages.current.pop();

        const last = pushedPages.current[pushedPages.current.length - 1];
        showPage(last);
    };

    const push = identifier => {
        const last = pushedPages.current[pushedPages.current.length - 1];
        hidePage(last);

        showPage(identifier);
        pushedPages.current.push(identifier);
    };

    const showPage = (identifier, initial = false) => {
        const pageRef = pages[identifier];
        if (!pageRef) return;
        
        if (pageVisibilities.current[identifier]) return;
        pageVisibilities.current[identifier] = true;

        applyStyle({
            transition: initial ? 'none' : `${opacityLength}s opacity ease, ${transformLength}s transform ease`,
            opacity: '1.0',
            transform: 'translateX(0px) scale(1.0)',
            pointerEvents: 'auto'
        }, pageRef);
    };

    const hidePage = identifier => {
        const pageRef = pages[identifier];
        if (!pageRef) return;

        if (!pageVisibilities.current[identifier]) return;
        pageVisibilities.current[identifier] = false;

        applyStyle({
            transition: `${opacityLength}s opacity ease, ${transformLength}s transform ease`,
            opacity: '0.0',
            transform: 'translateX(0px) scale(1.0)',
            pointerEvents: 'none'
        }, pageRef);
    };

    const send = async () => {
        setSubmitting(true);
        
        const ticket = { title: ((selectedCategory || {}).ticketTitle || ''), content: message };
        // submit ticket
        
        try {
            // const result = await api.tickets.add(currentOrganization._id, ticket);
            push('confirmation');

            // if (type === 'call') await bridge.request('call', { number: '+14072837661' });
        } catch (e) {
            console.log(e);
        }

        setSubmitting(false);
    };

    const selectCategory = category => () => {
        setSelectedCategory(category);
        push('message');
    }

    const category = data => (
        <div key={data.identifier} className={style.category} onClick={selectCategory(data)}>
            <div className={style.icon + ' ' + style[data.identifier]} />
            <div className={style.info}>
                <div className={style.title}>{data.title}</div>
            </div>
        </div>
    );

    const addTicketClass = conditional('AddTicketModal', style, { visible: props.data });
    const sendClass = conditional('button', style, { disabled: submitting || !message.length });

    return (
        <div className={addTicketClass}>
            <div className={style.content}>
                <div className={style.page} id="categories" ref={categoriesPage}>
                    <div className={style.categoriesContent}>
                        <div className={style.header}>
                            <div className={style.back} onClick={back} />
                            <h2>How can we help?</h2>
                            <p>Real quick, which of these you need help with?</p>
                        </div>
                        <div className={style.categories}>
                            {categories.map(category)}
                        </div>
                    </div>
                </div>
                <div className={style.page} id="message" ref={messagePage}>
                    <div className={style.categoriesContent}>
                        <div className={style.header}>
                            <div className={style.back} onClick={back} />
                            <h2>{(selectedCategory || {}).message}</h2>
                            <p>Describe what you need help with and we'll get right on it!</p>
                        </div>
                        <div className={style.messages}>
                            <textarea className={style.field} value={message} placeholder={'Explain how we can help...'} style={{ height: '200px' }} onChange={e => setMessage(e.target.value)} />
                            <div className={sendClass} onClick={send}>Send</div>
                        </div>
                    </div>
                </div>
                <div className={style.page} id="confirmation" ref={confirmPage}>
                    <div className={style.categoriesContent}>
                        <div className={style.header}>
                            <div className={style.back} onClick={back} style={{opacity: '0.0', pointerEvents: 'none'}} />
                            <div className={style.checkIcon} />
                            <h2>Thanks for getting in touch!</h2>
                            <p>We've received your message and one of our service representatives will be reaching out to you. During Monday-Friday, our office hours are 8am to 8pm EST, and our response is usually within 4 hours.</p>
                            <div className={style.button} onClick={() => { props.onDismiss() }}>Done</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AddTicketModal;
