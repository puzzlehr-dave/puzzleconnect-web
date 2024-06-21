
import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from './style.module.css';

const randomChartData = n => {
    return ([...new Array(n)]).map(_ => Math.random()).sort((a, b) => a < b ? -1 : 1);
};

const ChartView = props => {

    const [width, setWidth] = useState(0);
    const [infoIndex, setInfoIndex] = useState(null);

    const testData = useRef(randomChartData(7));
    
    // SETS CLIENT WIDTTH BASED ON PATH FOR PROPER WIDTH
    const ref = useCallback(ref => {
        if (!ref) return;
        if(['/', '/aggregates'].includes(props.path)) {
            setWidth(ref.clientWidth);
        }
      
    }, [props.path]);


    //  OLD REF WAS BUGGING OUT WHEN DISPLAYING ANALYTIC CATAGORIES CHARTS
    // const ref = useCallback(ref => {
    //     if (!ref) return;
    //    setWidth(ref.clientWidth)
    //   console.log("current twidth", ref.clientWidth)
    // }, []);

    const size = props.size || {};
    // const width = ref.current ? ref.current.clientWidth : 0;
    const height = size.height || 240;

    const dotSize = props.dotSize || 10;
    const lineSize = props.lineSize || 2;
    const dotRadius = dotSize / 2;
    
    const color = props.color || '#1a1853'; // '#7ac142';
    const baseColor = props.baseColor || '#1a18531a';

    const points = testData.current; // props.points; // props.points && props.points >= 2 ? props.points : [0, 0];
    const step = width / (points.length - 1);

    const x = index => index * step;
    const y = point => height - (point * height);

    const path = points.map((point, index) => `${x(index)},${y(point)}`);


    const dots = points
        .map((point, index) => <circle cx={x(index)} cy={y(point)} r={dotRadius} fill={color} />)
        .filter((_, index) => index > 0 && index < props.points.length - 1);
    
    const dotStyle = { width: dotSize, height: dotSize, borderRadius: dotRadius, backgroundColor: color };

    const name = label => {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'short' });
    };

    const fullName = label => {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const infoTitle = () => infoIndex !== null ? fullName(props.labels[infoIndex]) : null;
    const infoDescription = () => infoIndex !== null ? props.respondents[infoIndex] : null;


    return (
        <div className={style.ChartView} ref={ref} style={{ width: '100%' }}>
            <div className={style.chart} style={{ paddingLeft: dotRadius, paddingRight: dotRadius, height }}>
                <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <path d={`M ${path} L ${width} ${height} L 0 ${height}Z`} fill={baseColor} />
                    <path d={`M ${path}`} fill="none" stroke={color} stroke-width={lineSize} />
                    <g>{dots}</g>
                </svg>
            </div>
            <div className={style.overlay}>
                <div className={style.info} style={{ display: infoIndex !== null ? 'block' : 'none' }}>
                    <div className={style.infoTitle}>{infoTitle()}</div>
                    <div className={style.infoDescription}>{infoDescription()} {infoDescription() ? 'respondents' : ''}</div>
                </div>
            </div>
            <div className={style.overlay}>
                {props.labels.map((_, index) => <div className={style.segment} onMouseLeave={() => setInfoIndex(null)} onMouseEnter={() => setInfoIndex(index)}></div>)}
            </div>
            <div className={style.labels}>
                {props.labels.map(label => <div className={style.label}>{name(label)}</div>)}
            </div>
            <div className={style.dotStart} style={{ ...dotStyle, top: y(points[0]) - dotRadius }} />
            <div className={style.dotEnd} style={{ ...dotStyle, top: y(points[points.length - 1]) - dotRadius }} />
        </div>
    );
    
};

export default ChartView;
