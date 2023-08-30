'use client';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import useAuthentication from '@/hooks/useAuth';
import { useCustomQuery } from '@/hooks/useMutationHook';
import TournamentCard from '@/components/TournamentCard';
import Loader from '@/components/Loading';
import TournamentLoading from './loading';

const TournamentList = () => {
    const { uid, token } = useAuthentication();
    const {
        data,
        isLoading: loading,
        error,
    } = useCustomQuery(`/organizer/alltrophies?uid=${uid}`, 'allTrophies', token);
    const router = useRouter();
    console.log(data);

    if (!data) return <div>Something went wrong</div>;
    if (data?.responseData?.allTrophies.length === 0) return <div>no data found</div>;

    return (
        <Suspense fallback={TournamentLoading}>
            <div>
                <div className='max-w-[1140px] mx-auto'>
                    <h3 className='text-dark1 text-3xl font-extrabold mt-10'>All Tournaments</h3>
                    <div className='grid grid-cols-3 gap-8 mt-6'>
                        {data?.responseData?.allTrophies?.map((item) => (
                            <div
                                className='cursor-pointer'
                                onClick={(e) => router.push(`/admin/tournaments/${item.TrophyName}/${item.TrophyID}`)}
                            >
                                <TournamentCard
                                    name={item?.TrophyName}
                                    start={item?.StartDate}
                                    end={item?.EndDate}
                                    format={item?.Format}
                                    venue={item?.Venue}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default TournamentList;
