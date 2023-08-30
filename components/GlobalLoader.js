'use client';
import { useState, useEffect } from 'react';
const Loader = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const intervel = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
        }, 600);
    }, []);
    return (
        <div className='loadingContainer'>
            {/* <div className='loadingBar' style={{ width: `${progress}%` }}></div> */}
            <div className='loadingContent'>
                <div className='loadingSpinner'></div>
                <div className='loadingText'>Loading...</div>
            </div>
        </div>
    );
};

export default Loader;
