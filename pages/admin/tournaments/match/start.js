import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import useCustomMutation, { useCustomQuery } from '@/hooks/useMutationHook';
import Overlay from '@/components/Overlay';
import useAuthentication from '@/hooks/useAuth';
import ProfileInput from '@/components/ProfileInput';
import inputValidations from '@/util/validaton';
import SideDrawer from '@/components/SideDrawer';
import CrButton from '@/components/CrButton';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import Image from 'next/image';

const TeamComponent = ({ data }) => {
    // const router = useRouter();
    // const { id } = router.query;

    return (
        <div className='flex justify-center'>
            <div
                className={`w-[400px] bg-white z-[110] rounded-lg shadow-md max-h-[80%] mt-6 overflow-y-scroll p-2 relative`}
            >
                <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4'>Select Team</h3>

                {data?.responseData?.data?.map((item) => (
                    <div
                        // onClick={(e) => {
                        //     if (formData.team1Name === item.TeamName || formData.team2Name === item.TeamName) return;

                        //     if (cuurTeamList === 1)
                        //         setFormdata((old) => ({
                        //             ...old,
                        //             team1Name: item.TeamName,
                        //             team1: item.TeamID,
                        //         }));
                        //     else
                        //         setFormdata((old) => ({
                        //             ...old,
                        //             team2Name: item.TeamName,
                        //             team2: item.TeamID,
                        //         }));

                        //     setIsPopupOpen(false);
                        // }}
                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='relative h-[30px] w-[30px] rounded-full overflow-hidden'>
                                <Image
                                    layout='fill'
                                    objectFit='cover'
                                    src={`http://localhost:5500/${item.Player.Image}`}
                                />
                            </div>
                            <p>{item.Player.FirstName + ' ' + item.Player.LastName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MatchStart = () => {
    const router = useRouter();
    const [currScreen, setCurrScreen] = useState(0);
    const { team1, team2, team1Name, team2Name, id } = router.query;

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const {
        data: team1Data,
        isLoading: loading1,
        error: err1,
    } = useCustomQuery(`/player?teamId=${team1}`, 'team1players');
    const {
        data: team2Data,
        isLoading: loading2,
        error: err2,
    } = useCustomQuery(`/player?teamId=${team2}`, 'team2players');

    return (
        <div>
            <div className='relative grid grid-cols-5 gap-5'>
                {/* screen - 1 */}
                <div className='col-start-1 col-end-4 p-2 pt-6 max-h-[97vh] overflow-y-scroll'>
                    {currScreen == 0 && (
                        <div className={`h-[80%] overflow-y-scroll`}>
                            <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4 '>
                                Select Playing 11 Of {team1Name}
                            </h3>
                            <div className='grid grid-cols-2 gap-3'>
                                {team1Data?.responseData?.data?.map((item) => (
                                    <div
                                        // onClick={(e) => {
                                        //     if (formData.team1Name === item.TeamName || formData.team2Name === item.TeamName) return;

                                        //     if (cuurTeamList === 1)
                                        //         setFormdata((old) => ({
                                        //             ...old,
                                        //             team1Name: item.TeamName,
                                        //             team1: item.TeamID,
                                        //         }));
                                        //     else
                                        //         setFormdata((old) => ({
                                        //             ...old,
                                        //             team2Name: item.TeamName,
                                        //             team2: item.TeamID,
                                        //         }));

                                        //     setIsPopupOpen(false);
                                        // }}
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        <div className='flex items-center'>
                                            <div className='flex items-center gap-3'>
                                                <div className='relative h-[30px] w-[30px] rounded-full overflow-hidden'>
                                                    <Image
                                                        layout='fill'
                                                        objectFit='cover'
                                                        src={`http://localhost:5500/${item.Player.Image}`}
                                                    />
                                                </div>
                                                <p>{item.Player.FirstName + ' ' + item.Player.LastName}</p>
                                            </div>
                                            <div className='flex justify-center items-center ml-auto gap-1'>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    WK
                                                </div>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    C
                                                </div>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    VC
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Screen - 2  */}
                    {currScreen == 1 && (
                        <div className={``}>
                            <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4 '>
                                Select Playing 11 Of {team2Name}
                            </h3>
                            <div className='grid grid-cols-2 gap-3'>
                                {team2Data?.responseData?.data?.map((item) => (
                                    <div
                                        // onClick={(e) => {
                                        //     if (formData.team1Name === item.TeamName || formData.team2Name === item.TeamName) return;

                                        //     if (cuurTeamList === 1)
                                        //         setFormdata((old) => ({
                                        //             ...old,
                                        //             team1Name: item.TeamName,
                                        //             team1: item.TeamID,
                                        //         }));
                                        //     else
                                        //         setFormdata((old) => ({
                                        //             ...old,
                                        //             team2Name: item.TeamName,
                                        //             team2: item.TeamID,
                                        //         }));

                                        //     setIsPopupOpen(false);
                                        // }}
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        <div className='flex items-center'>
                                            <div className='flex items-center gap-3'>
                                                <div className='relative h-[30px] w-[30px] rounded-full overflow-hidden'>
                                                    <Image
                                                        layout='fill'
                                                        objectFit='cover'
                                                        src={`http://localhost:5500/${item.Player.Image}`}
                                                    />
                                                </div>
                                                <p>{item.Player.FirstName + ' ' + item.Player.LastName}</p>
                                            </div>
                                            <div className='flex justify-center items-center ml-auto gap-1'>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    WK
                                                </div>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    C
                                                </div>
                                                <div className='border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs'>
                                                    VC
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Screen - 3 */}

                    {currScreen === 2 && (
                        <div className={`py-2`}>
                            <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4 p-2 '>Almost Done</h3>
                            <div className='mt-3'>
                                <p className='mb-3'>Toss won by</p>

                                <div className='flex items-center gap-4'>
                                    <div
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        {team1Name}
                                    </div>

                                    <div
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        {team2Name}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-3'>
                                <p className='mb-3'>Choose</p>

                                <div className='flex items-center gap-4'>
                                    <div
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        <div className='relative h-[150px] w-[100px] rounded-full overflow-hidden'>
                                            <Image layout='fill' objectFit='contain' src='/batting.jpg' />
                                        </div>
                                        <p className='mt-2 text-center'>Batting</p>
                                    </div>

                                    <div
                                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer`}
                                    >
                                        <div className='relative h-[150px] w-[100px] rounded-full overflow-hidden'>
                                            <Image layout='fill' objectFit='contain' src='/bowling.jpeg' />
                                        </div>
                                        <p className='mt-2 text-center'>Bowling</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='flex justify-between items-center'>
                        <button
                            disabled={currScreen === 0}
                            onClick={(e) => {
                                if (currScreen === 0) return;
                                setCurrScreen(currScreen - 1);
                            }}
                            className='px-6 py-2 rounded-lg bg-primary/10 text-primary text-lg font-bold '
                        >
                            Prev
                        </button>
                        <button
                            disabled={currScreen === 2}
                            onClick={(e) => {
                                if (currScreen === 2) return;
                                setCurrScreen(currScreen + 1);
                            }}
                            className='px-6 py-2 rounded-lg bg-primary/10 text-primary text-lg font-bold '
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Preview Part */}
                <div className='shadow-md w-full h-full bg-red-200 col-start-4 col-end-6'></div>
            </div>
        </div>
    );
};

export default MatchStart;
