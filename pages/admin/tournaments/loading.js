'use client';
import Loader from '@/components/Loading';
const TournamentLoading = () => {
    return (
        <div className=''>
            <div>
                <div className='text-6xl font-bold'>Tournaments loading...</div>
                <div className='w-[400px] h-[400px] shadow-lg rounded-lg mx-auto mt-20'>
                    <Loader />
                </div>
            </div>
        </div>
    );
};

export default TournamentLoading;
