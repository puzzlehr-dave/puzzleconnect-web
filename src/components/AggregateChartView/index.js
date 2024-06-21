
import React, { useCallback, useState } from 'react';
import style from './style.module.css';

const AggregateChartView = props => {

    const [width, setWidth] = useState(0);
    const [infoIndex, setInfoIndex] = useState(null);

    const points = props.points;

    // SETS CLIENT WIDTTH BASED ON PATH FOR PROPER WIDTH
    const ref = useCallback(ref => {
        if (!ref) return;
        if (['/', '/aggregates'].includes(props.path)) {
            setWidth(ref.clientWidth);
        }

    }, [props.path]);

    const size = props.size || {};
    // const width = ref.current ? ref.current.clientWidth : 0;
    const height = size.height || 240;

    const dotSize = props.dotSize || 10;
    const lineSize = props.lineSize || 4;
    const dotRadius = dotSize / 2;

    const color = props.color || '#7ac142';
    const baseColor = props.baseColor || '#7ac1421a';

    const step = width / (Object.keys(points).length - 1);

    const x = (index) => width - (index * step) - (dotRadius / 2);

    const y = (point) => height - (point * height);

    let pathData = "";

    //constructs the path 
    Object.values(points).forEach((point, index) => {
        const monthData = Object.entries(point)[0]; // Get the month and value pair
        const average = monthData[1]; // Get the average value
        const yPos = height - (average * height); // Calculate y-coordinate for the point

        // Calculate the x-coordinate for the point, considering the offset for the first dot
        let monthIndex;

        if (index === 0) {
            monthIndex = x(index) - 2; // Adjust the value based on the offset

            pathData += `M ${monthIndex} ${yPos}`;
        } else {
            monthIndex = x(index);

            pathData += ` L ${monthIndex} ${yPos}`;
        }
    });
    const threshold = 0.1;

    // Map the data to SVG circle elements, filtering out points below the threshold
    const dots = Object.keys(points).map((index) => {
        const monthData = points[index];
        const month = Object.keys(monthData)[0];
        const average = monthData[month];

        if (average >= threshold) { // Check if the average is above the threshold
            let cxValue = x(parseInt(index));
            if (index === "0") {
                // Adjust the cx value for the first point to not get cut off
                cxValue -= 2;
            }
            return (
                <circle
                    key={index}
                    cx={cxValue}
                    cy={y(average)}
                    r={dotRadius}
                    fill={color}
                />
            );
        } else {
            return null;
        }
    });


    const dotStyle = { width: dotSize, height: dotSize, borderRadius: dotRadius, backgroundColor: color };

    const name = label => {
        const date = new Date(label);
        return date.toLocaleDateString('en-US', { month: 'short' });
    };

    const fullName = label => {
        const date = new Date(label);
        // Return the locale-specific full month name and year
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    const infoTitle = () => infoIndex !== null ? fullName(props.labels[infoIndex]) : null;

    const infoDescription = () => infoIndex !== null ? props.respondents[infoIndex] : null;

    return (
        <div className={style.ChartView} ref={ref} style={{ width: '100%' }}>
            <div className={style.chart} style={{ paddingLeft: dotRadius, paddingRight: dotRadius, height }}>
                <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <path d={`${pathData} L -2.5 160 L ${width} 160 Z`} fill={baseColor} />
                    <path d={pathData} fill="none" stroke={color} strokeWidth={lineSize} />
                    <g>{dots}</g>
                </svg>
            </div>
            <div className={style.overlay}>
                <div className={style.info} style={{ display: infoIndex !== null ? 'block' : 'none' }}>
                    <div className={style.infoTitle}>{infoTitle()}</div>
                    <div className={style.infoDescription}>{infoDescription()} {infoDescription() ? 'respondents' : 'respondents'}</div>
                </div>
            </div>
            <div className={style.overlay}>
                {props.labels.map((_, index) => <div className={style.segment} onMouseLeave={() => setInfoIndex(null)} onMouseEnter={() => setInfoIndex(index)}></div>)}
            </div>
            <div className={style.labels}>
                {props.labels.map(label => <div className={style.label}>{name(label)}</div>)}
            </div>
            {/* <div className={style.dotStart} style={{ ...dotStyle, top: y(points[0]) - dotRadius }} />
            <div className={style.dotEnd} style={{ ...dotStyle, top: y(points[points.length - 1]) - dotRadius }} /> */}
        </div>
    );

};

export default AggregateChartView;
