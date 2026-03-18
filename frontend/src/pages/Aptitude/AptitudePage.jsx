import React, { useEffect } from 'react';
import AptitudeTraining from './AptitudeTraining';

const AptitudePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.page}>
      <AptitudeTraining />
    </div>
  );
};

const styles = {
  page: { maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' },
};

export default AptitudePage;
