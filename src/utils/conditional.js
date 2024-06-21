
export default (root, style, props, defaults = false) => {
    const propClass = (final, key) => final += props[key] ? ` ${style[key]}` : '';
    const className = Object.keys(style).reduce(propClass, style[root]);
    return !defaults ? className + ' ' + style.defaults : className;
};
