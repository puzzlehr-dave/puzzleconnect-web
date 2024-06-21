
const apply = (styleorStyles, ref) => {
    let css = ``;

    const styles = typeof styleorStyles === 'object' && styleorStyles.constructor === Array ? styleorStyles : [styleorStyles];
    const attributes = {};

    for (const style of styles) {
        for (const prop in style) {
            attributes[prop] = style[prop];
        }
    }

    for (const prop in attributes) {
        const attribute = prop.split('').map(c => c === c.toUpperCase() ? '-' + c.toLowerCase() : c).join('');
        css += attribute + ': ' + attributes[prop] + ';';
    }

    ref.current.style.cssText = css;
};

export default apply;
