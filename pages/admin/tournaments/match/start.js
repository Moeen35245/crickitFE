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
import axios from 'axios';

const MatchStart = () => {
    const router = useRouter();
    const [currScreen, setCurrScreen] = useState(0);
    const [disable, setDisable] = useState(true);
    const { team1, team2, team1Name, team2Name, id } = router.query;

    const [team1FormData, setTeam1FormData] = useState({
        playing11: [],
        wk: '',
        cap: '',
        vcap: '',
    });

    const [team2FormData, setTeam2FormData] = useState({
        playing11: [],
        wk: '',
        cap: '',
        vcap: '',
    });

    const [matchData, setMatchData] = useState({
        overs: '',
        tossWinId: '',
        choose: '',
        umpire1: '',
        umpire2: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    // const queryClient = useQueryClient();

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

    const submitHandler = async () => {
        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/match/start',
                data: {
                    teamId1: team1,
                    matchId: id,
                    wk1: team1FormData.wk,
                    cap1: team1FormData.cap,
                    vcap1: team1FormData.vcap,
                    playing1Ids: team1FormData.playing11,
                    teamId2: team2,
                    wk2: team2FormData.wk,
                    cap2: team2FormData.cap,
                    vcap2: team2FormData.vcap,
                    playing2Ids: team2FormData.playing11,
                    tossWinId: matchData.tossWinId,
                    choose: matchData.choose,
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('match started', toastConfig());
                router.push({
                    pathname: '/admin/tournaments/match/addinning',
                    query: {
                        matchId: id,
                        battingTeamId: matchData.tossWinId === team1 ? team1 : team2,
                        bowlingTeamId: matchData.tossWinId === team1 ? team2 : team1,
                    },
                });
            } else {
                if (response.status === 401) {
                    toast.error('Pls Login First', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong', toastConfig());
        } finally {
            setIsLoading(false);
        }
    };

    const togglePlayerInPlaying11 = (playerId, formData, setFormdata) => {
        // Check if the player is already in playing11
        const playerIndex = formData.playing11.indexOf(playerId);

        if (playerIndex === -1) {
            if (formData.playing11.length >= 11) {
                toast.error('Cannot select more then 11 players', toastConfig());
                return;
            }
            // Player is not in playing11, so add them
            setFormdata((prevState) => ({
                ...prevState,
                playing11: [...prevState.playing11, playerId],
            }));
        } else {
            // Player is in playing11, so remove them
            setFormdata((prevState) => ({
                ...prevState,
                playing11: prevState.playing11.filter((id) => id !== playerId),
            }));
        }
    };

    const toggleButton = (playerId, key, formData, setFormdata) => {
        setFormdata((prevState) => {
            const { wk, cap, vcap } = prevState;

            if (key === 'wk') {
                // If toggling WK or VCap, or if WK is not set
                return {
                    ...prevState,
                    wk: prevState.wk === playerId ? '' : playerId,
                };
            } else if (key === 'cap' && playerId !== vcap) {
                // If toggling Captain and it's not the same player as VCap
                return {
                    ...prevState,
                    cap: prevState.cap === playerId ? '' : playerId,
                };
            } else if (key === 'vcap' && playerId !== cap) {
                // If toggling Captain and it's not the same player as VCap
                return {
                    ...prevState,
                    vcap: prevState.vcap === playerId ? '' : playerId,
                };
            } else {
                // If none of the conditions match, don't change the state
                return prevState;
            }
        });
    };

    useEffect(() => {
        const fieldsCheck = !(
            team1FormData.playing11.length === 11 &&
            team1FormData.wk &&
            team1FormData.cap &&
            team1FormData.vcap &&
            team2FormData.playing11.length === 11 &&
            team2FormData.wk &&
            team2FormData.cap &&
            team2FormData.vcap &&
            matchData.tossWinId &&
            matchData.choose
        );

        setDisable(fieldsCheck);
    }, [team1FormData, team2FormData, matchData]);

    return (
        <div className='max-w-[1440px] mx-auto'>
            <div className='relative grid grid-cols-5 gap-5'>
                <div className='col-start-1 col-end-4 p-2 pt-6 max-h-[97vh] overflow-y-scroll'>
                    {/* screen - 1 */}
                    {currScreen == 0 && (
                        <div className={`bg-white shadow-xl mb-4 p-5 py-2 rounded-2xl`}>
                            <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4 '>
                                Select Playing 11 Of {team1Name}
                            </h3>
                            <div
                                className={`px-3 py-1 mb-2 border-2  bg-primary/10 rounded-full flex items gap-1 max-w-[fit-content] ${
                                    team1FormData?.playing11?.length
                                        ? 'border-primary text-primary'
                                        : 'border-gray-200 text-gray-400'
                                }`}
                            >
                                <p className='text-sm'>{team1FormData?.playing11?.length}</p>
                                <p className='text-sm'>Selected</p>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {team1Data?.responseData?.data?.map((item) => (
                                    <div
                                        className={`rounded-md border-2 mb-3  cursor-pointer ${
                                            team1FormData.playing11.includes(item.PlayerID)
                                                ? 'border-primary shadow-lg'
                                                : 'border-gray-200 shadow-none'
                                        }`}
                                    >
                                        <div className='flex items-center'>
                                            <div
                                                onClick={(e) =>
                                                    togglePlayerInPlaying11(
                                                        item.PlayerID,
                                                        team1FormData,
                                                        setTeam1FormData
                                                    )
                                                }
                                                className='flex items-center gap-3 py-3 px-6 grow-[1]'
                                            >
                                                <div className='relative h-[30px] w-[30px] rounded-full overflow-hidden'>
                                                    <Image
                                                        layout='fill'
                                                        objectFit='cover'
                                                        src={`http://localhost:5500/${item.Player.Image}`}
                                                    />
                                                </div>
                                                <p>{item.Player.FirstName + ' ' + item.Player.LastName}</p>
                                            </div>
                                            <div className='flex justify-center items-center ml-auto gap-1 pr-6'>
                                                <div
                                                    onClick={(e) => {
                                                        if (team1FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'wk',
                                                                team1FormData,
                                                                setTeam1FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs ${
                                                        team1FormData.wk === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
                                                    WK
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        if (team1FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'cap',
                                                                team1FormData,
                                                                setTeam1FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs  ${
                                                        team1FormData.cap === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
                                                    C
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        if (team1FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'vcap',
                                                                team1FormData,
                                                                setTeam1FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs  ${
                                                        team1FormData.vcap === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
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
                            <div
                                className={`px-3 py-1 mb-2 border-2  bg-primary/10 rounded-full flex items gap-1 max-w-[fit-content] ${
                                    team2FormData?.playing11?.length
                                        ? 'border-primary text-primary'
                                        : 'border-gray-200 text-gray-400'
                                }`}
                            >
                                <p className='text-sm'>{team2FormData?.playing11?.length}</p>
                                <p className='text-sm'>Selected</p>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                {team2Data?.responseData?.data?.map((item) => (
                                    <div
                                        className={`rounded-md border-2 mb-3  cursor-pointer ${
                                            team2FormData.playing11.includes(item.PlayerID)
                                                ? 'border-primary shadow-lg'
                                                : 'border-gray-200 shadow-none'
                                        }`}
                                    >
                                        <div className='flex items-center'>
                                            <div
                                                onClick={(e) =>
                                                    togglePlayerInPlaying11(
                                                        item.PlayerID,
                                                        team2FormData,
                                                        setTeam2FormData
                                                    )
                                                }
                                                className='flex items-center gap-3 py-3 px-6 grow-[1]'
                                            >
                                                <div className='relative h-[30px] w-[30px] rounded-full overflow-hidden'>
                                                    <Image
                                                        layout='fill'
                                                        objectFit='cover'
                                                        src={`http://localhost:5500/${item.Player.Image}`}
                                                    />
                                                </div>
                                                <p>{item.Player.FirstName + ' ' + item.Player.LastName}</p>
                                            </div>
                                            <div className='flex justify-center items-center ml-auto gap-1 pr-6'>
                                                <div
                                                    onClick={(e) => {
                                                        if (team2FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'wk',
                                                                team2FormData,
                                                                setTeam2FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs ${
                                                        team2FormData.wk === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
                                                    WK
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        if (team2FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'cap',
                                                                team2FormData,
                                                                setTeam2FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs  ${
                                                        team2FormData.cap === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
                                                    C
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        if (team2FormData.playing11.includes(item.PlayerID)) {
                                                            toggleButton(
                                                                item.PlayerID,
                                                                'vcap',
                                                                team2FormData,
                                                                setTeam2FormData
                                                            );
                                                        } else return;
                                                    }}
                                                    className={`border-2 bg-primary/10 rounded-full h-[30px] w-[30px] flex justify-center items-center p-1 text-primary text-xs  ${
                                                        team2FormData.vcap === item.PlayerID ? 'border-primary' : ''
                                                    }`}
                                                >
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
                                        onClick={(e) =>
                                            setMatchData((old) => ({
                                                ...old,
                                                tossWinId: team1,
                                            }))
                                        }
                                        className={`px-6 py-3 rounded-md border-2 mb-3 cursor-pointer  ${
                                            matchData.tossWinId === team1
                                                ? 'border-primary shadow-lg'
                                                : 'border-gray-200 shadow-none'
                                        }`}
                                    >
                                        {team1Name}
                                    </div>

                                    <div
                                        onClick={(e) =>
                                            setMatchData((old) => ({
                                                ...old,
                                                tossWinId: team2,
                                            }))
                                        }
                                        className={`px-6 py-3 rounded-md border-2 mb-3  cursor-pointer ${
                                            matchData.tossWinId === team2
                                                ? 'border-primary shadow-lg'
                                                : 'border-gray-200 shadow-none'
                                        }`}
                                    >
                                        {team2Name}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-3'>
                                <p className='mb-3'>Choose</p>

                                <div className='flex items-center gap-4'>
                                    <div
                                        onClick={(e) =>
                                            setMatchData((old) => ({
                                                ...old,
                                                choose: 'batting',
                                            }))
                                        }
                                        className={`px-6 py-3 rounded-md border-2 mb-3  cursor-pointer ${
                                            matchData.choose === 'batting'
                                                ? 'border-primary shadow-lg'
                                                : 'border-gray-200 shadow-none'
                                        } `}
                                    >
                                        <div className='relative h-[150px] w-[100px] rounded-full overflow-hidden'>
                                            <Image layout='fill' objectFit='contain' src='/batting.jpg' />
                                        </div>
                                        <p className='mt-2 text-center'>Batting</p>
                                    </div>

                                    <div
                                        onClick={(e) =>
                                            setMatchData((old) => ({
                                                ...old,
                                                choose: 'bowling',
                                            }))
                                        }
                                        className={`px-6 py-3 rounded-md border-2 mb-3  cursor-pointer ${
                                            matchData.choose === 'bowling'
                                                ? 'border-primary shadow-lg '
                                                : 'border-gray-200 shadow-none'
                                        }`}
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
                            className={`px-6 py-2 rounded-lg  text-lg font-bold ${
                                currScreen === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary/10 text-primary'
                            }`}
                        >
                            Prev
                        </button>
                        <button
                            disabled={currScreen === 2}
                            onClick={(e) => {
                                if (currScreen === 2) return;
                                setCurrScreen(currScreen + 1);
                            }}
                            className={`px-6 py-2 rounded-lg  text-lg font-bold ${
                                currScreen === 2
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary/10 text-primary'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Preview Part */}
                <div className='shadow-md w-full h-full bg-primary/10 col-start-4 col-end-6 px-8 relative'>
                    <h2 className='mt-40 text-3xl font-bold text-center'>Preview coming soon</h2>
                    <div className='absolute bottom-4 w-[90%]'>
                        <CrButton
                            disabled={disable}
                            fn={submitHandler}
                            // fn={console.log(team1FormData, team2FormData, matchData)}
                            name='Submit'
                            loading={isLoading}
                            styles={`bg-primary font-inherit py-6 rounded-xl text-base font-bold w-full`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchStart;

export async function getServerSideProps(context) {
    const { id } = context.query;
    // console.log(token);
    try {
        // Fetch the API to check user activity
        const response = await axios.get(`http://localhost:5500/match/details?matchId=${id}`);
        console.log(response);
        const isMatchStarted = response.data.data.TossWin;

        if (isMatchStarted) {
            // Redirect to /home if user is active
            return {
                redirect: {
                    destination: `/admin/tournaments/match/scorecard?inningsId=${id}`,
                    permanent: false, // Set this to true if it's a permanent redirect
                },
            };
        }

        // If user is not active, allow access to the page
        return {
            props: {},
        };
    } catch (error) {
        console.error('Error fetching user activity:', error);
        // Default behavior, don't allow access to the page
        return {
            notFound: true,
        };
    }
}
