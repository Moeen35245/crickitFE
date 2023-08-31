'use client';
import useAuthentication from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { PlusIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/solid';

const Tournament = () => {
    // const { isAuthenticated, uid, token, email } = useAuthentication();
    const router = useRouter();

    const name = router?.query?.id[0];
    const id = router?.query?.id[1];

    console.log(id, name);
    return (
        <div className='max-w-[1440px] mx-auto'>
            {/* <div className='w-[250px] h-[100px] shadow-lg rounded-lg mx-auto mt-20'>
                <Lottie animationData={loader} />
            </div> */}

            <div className='max-w-[1140px] mx-auto'>
                <h3 className='text-dark1 text-3xl font-extrabold mt-10'>{name}</h3>
                <div className='mt-6 grid grid-cols-3 items-center mx-auto gap-6'>
                    <div
                        onClick={(e) => router.push(`/admin/tournaments/match/${id}`)}
                        className='border-2 border-primary rounded-xl p-7 bg-white shadow-lg cursor-pointer'
                    >
                        <div className='flex gap-2 items-center justify-around'>
                            <h4 className='font-bold text-xl text-primary'>Matches Schedule</h4>
                            <div className='p-2 rounded-full border-2 border-primary max-w-[fit-content]'>
                                <ChevronRightIcon className='text-primary h-5 w-5' />
                            </div>
                        </div>
                    </div>
                    <div
                        // onClick={(e) => router.push('/admin/tournaments')}
                        className='border-2 border-primary rounded-xl p-7 bg-white shadow-lg'
                    >
                        {' '}
                        <div className='flex gap-2 items-center justify-around cursor-pointer'>
                            <h4 className='font-bold text-xl text-primary'>Results</h4>
                            <div className='p-2 rounded-full border-2 border-primary max-w-[fit-content]'>
                                <ChevronRightIcon className='text-primary h-5 w-5' />
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={(e) => router.push(`/admin/tournaments/team/${id}`)}
                        className='border-2 border-primary rounded-xl p-7 bg-white shadow-lg'
                    >
                        <div className='flex gap-2 items-center justify-around cursor-pointer'>
                            <h4 className='font-bold text-xl text-primary'>Teams</h4>
                            <div className='p-2 rounded-full border-2 border-primary max-w-[fit-content]'>
                                <ChevronRightIcon className='text-primary h-5 w-5' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='mt-20 grid grid-cols-3 w-[75%] items-center mx-auto gap-6'>
                <div className='border-2 border-red1 rounded-xl p-7 bg-red1/10 cursor-pointer'>
                    <div className='flex gap-2 items-center justify-around'>
                        <h4 className='font-bold text-xl text-red1'>Add Team</h4>
                        <div className='p-2 rounded-full border-2 border-red1 max-w-[fit-content]'>
                            <PlusIcon className='text-red1 h-5 w-5' />
                        </div>
                    </div>
                </div>
                <div className='border-2 border-red1 rounded-xl p-7 bg-red1/10'>
                    {' '}
                    <div className='flex gap-2 items-center justify-around cursor-pointer'>
                        <h4 className='font-bold text-xl text-red1'>All Teams</h4>
                        <div className='p-2 rounded-full border-2 border-red1 max-w-[fit-content]'>
                            <ChevronRightIcon className='text-red1 h-5 w-5' />
                        </div>
                    </div>
                </div>
                <div className='border-2 border-red1 rounded-xl p-7 bg-red1/10'>
                    <div className='flex gap-2 items-center justify-around cursor-pointer'>
                        <h4 className='font-bold text-xl text-red1'>Schedule Match</h4>
                        <div className='p-2 rounded-full border-2 border-red1 max-w-[fit-content]'>
                            <ChevronRightIcon className='text-red1 h-5 w-5' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-20 grid grid-cols-3 w-[75%] items-center mx-auto gap-6'>
                <div className='border-2 border-yellow rounded-xl p-7 bg-yellow/10 cursor-pointer'>
                    <div className='flex gap-2 items-center justify-around'>
                        <h4 className='font-bold text-xl text-yellow'>Add Player</h4>
                        <div className='p-2 rounded-full border-2 border-yellow max-w-[fit-content]'>
                            <PlusIcon className='text-yellow h-5 w-5' />
                        </div>
                    </div>
                </div>
                <div className='border-2 border-yellow rounded-xl p-7 bg-yellow/10'>
                    {' '}
                    <div className='flex gap-2 items-center justify-around cursor-pointer'>
                        <h4 className='font-bold text-xl text-yellow'>All Players</h4>
                        <div className='p-2 rounded-full border-2 border-yellow max-w-[fit-content]'>
                            <ChevronRightIcon className='text-yellow h-5 w-5' />
                        </div>
                    </div>
                </div>
                
            </div> */}
        </div>
    );
};

export default Tournament;
