import React from 'react';
import Resources from '../components/Resources';

const ResourcesPage = () => {
    return (
        <div style={styles.container}>
            <Resources />
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
    },
};

export default ResourcesPage;