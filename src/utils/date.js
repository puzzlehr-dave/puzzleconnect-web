
const format = dateString => {
    const now = new Date();
    const date = new Date(dateString);
    
    if (date.getTime() > now.getTime() - 86400000) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default { format };
