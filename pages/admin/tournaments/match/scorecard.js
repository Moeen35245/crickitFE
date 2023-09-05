import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCustomMutation, { useCustomQuery } from '@/hooks/useMutationHook';
import useAuthentication from '@/hooks/useAuth';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import Image from 'next/image';
import { FiChevronRight, FiX } from 'react-icons/fi';
import {
    ScoreButtonsF,
    extraButtons,
    outType,
    scoreButtonsBys,
    scoreButtonsLb,
    scoreButtonsNb,
    scoreButtonsNbe,
    scoreButtonsWd,
} from '@/util/constant';
import SideDrawer from '@/components/SideDrawer';
import Overlay from '@/components/Overlay';

const Popup = ({ setIsPopupOpen, setFormdata, formData, data, key1, key2, obj, scoreUpdateHandler }) => {
    return (
        <div className='h-[100vh] w-[110%] flex justify-center absolute -top-[20px] -left-[8px] backdrop-blur-md bg-black/5 z-[100]'>
            <div
                className={`w-[400px] bg-white z-[110] rounded-lg shadow-md max-h-[80%] mt-6 overflow-y-scroll p-2 relative`}
            >
                <div onClick={(e) => setIsPopupOpen(false)} className='absolute top-5 left-5 text-dark1 cursor-pointer'>
                    <FiX />
                </div>
                <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4'>Select Team</h3>

                {data?.map((item) => (
                    <div
                        onClick={(e) => {
                            if (key1 && key2)
                                setFormdata((state) => ({
                                    ...state,
                                    [key1]: item.PlayerID,
                                    [key2]: item.FirstName + ' ' + item.LastName,
                                }));
                            else {
                                setFormdata(item.PlayerID);
                                scoreUpdateHandler(obj.runs, obj.key, item.PlayerID);
                            }

                            setIsPopupOpen(false);
                        }}
                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer 
                       
                        `}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='relative h-[25px] w-[25px]'>
                                <Image layout='fill' objectFit='cover' src={`http://localhost:5500/${item.Image}`} />
                            </div>
                            <div>
                                <p>{item.FirstName + ' ' + item.LastName}</p>
                                {/* <p className='text-xs text-red-600 font-medium'>
                                    {item.TotalPlayers >= 11 ? '' : `need ${11 - item.TotalPlayers}  more players`}
                                </p> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OutComponent = ({
    currBall,
    inningId,
    battingPlayers,
    bowlingPlayers,
    bowlerId,
    p1Name,
    p2Name,
    p1ID,
    p2ID,
    formData,
    setFormData,
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [key1, setKey1] = useState('');
    const [key2, setKey2] = useState('');

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const outHandler = async () => {
        try {
            const response = await mutation.mutateAsync({
                url: '/match/playerout',
                data: {
                    newPlayerId: formData.newPlayerId,
                    how: formData.how,
                    playerId: formData.playerId,
                    inningId: inningId,
                    bowlerId: formData.bowlerId,
                    throwerId: formData.throwerId,
                    CatcherId: formData.catcherId,
                    runouterId: formData.runouterId,
                    runs: formData.runs,
                    ball: currBall,
                    key: formData.key,
                    position: formData.position,
                    newBowlerId: formData.newBowlerId,
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Update successfully', toastConfig());

                queryClient.invalidateQueries(['Scorecard' + inningId?.slice(-6)]);
            } else {
                if (response.status === 401) {
                    toast.error('Auth failed', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong', toastConfig());
        }
    };

    return (
        <div className='h-full w-full p-5 font-semibold overflow-y-scroll'>
            {isPopupOpen && (
                <Popup
                    setIsPopupOpen={setIsPopupOpen}
                    setFormdata={setFormData}
                    formData={formData}
                    data={key1 === 'newPlayerId' ? battingPlayers : bowlingPlayers}
                    key1={key1}
                    key2={key2}
                />
            )}
            <div>
                <p className='mb-3 font-semibold'>Select batsman who is out</p>
                <div className='flex items-center gap-5 mb-3 '>
                    <div
                        onClick={() =>
                            setFormData((old) => ({
                                ...old,
                                playerId: p1ID,
                            }))
                        }
                        className={`px-6 py-3 rounded-md border-2  cursor-pointer text-xs ${
                            formData.playerId === p1ID ? 'border-primary shadow-sm' : 'border-gray-200 shadow-none'
                        }`}
                    >
                        {p1Name}
                    </div>
                    <div
                        onClick={() =>
                            setFormData((old) => ({
                                ...old,
                                playerId: p2ID,
                            }))
                        }
                        className={`px-6 py-3 rounded-md border-2  cursor-pointer text-xs ${
                            formData.playerId === p2ID ? 'border-primary shadow-sm' : 'border-gray-200 shadow-none'
                        }`}
                    >
                        {p2Name}
                    </div>
                </div>
            </div>
            <div>
                <p className='mb-3'>How</p>
                <div className='flex items-center gap-5 mb-3'>
                    {outType.map((item) => (
                        <div
                            onClick={(e) => {
                                if (item !== 'catch') {
                                    setFormData((old) => ({
                                        ...old,
                                        how: item,
                                        catcherId: '',
                                        catcherName: '',
                                    }));
                                }
                                if (item !== 'run out') {
                                    setFormData((old) => ({
                                        ...old,
                                        how: item,
                                        runs: 0,
                                        key: '',
                                        runouterId: '',
                                        runouterName: '',
                                        throwerId: '',
                                        throwerName: '',
                                        position: '',
                                    }));
                                } else
                                    setFormData((old) => ({
                                        ...old,
                                        how: item,
                                    }));
                            }}
                            className={`px-6 py-3 rounded-md border-2  cursor-pointer text-xs ${
                                formData.how === item ? 'border-primary shadow-sm' : 'border-gray-200 shadow-none'
                            }`}
                        >
                            {item.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>

            {/* Run Out */}
            {formData.how === 'run out' && (
                <div>
                    <div className='flex gap-5 items-center mt-3'>
                        <div
                            onClick={(e) => {
                                setIsPopupOpen(true);
                                setKey1('runouterId');
                                setKey2('runouterName');
                            }}
                        >
                            <p className='mb-1'>Run Out By</p>
                            <div
                                className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs max-w-[300px] flex justify-between items-center ${
                                    formData.runouterId ? 'text-primary border-primary shadow-sm' : ''
                                }`}
                            >
                                <span className=''>{formData.runouterId ? formData.runouterName : 'Select'}</span>
                                <div className=' text-sm'>
                                    <FiChevronRight />
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={(e) => {
                                setIsPopupOpen(true);
                                setKey1('throwerId');
                                setKey2('throwerName');
                            }}
                        >
                            <p className='mb-1'>Throw By</p>
                            <div
                                className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs max-w-[300px] flex justify-between items-center ${
                                    formData.throwerId ? 'text-primary border-primary shadow-sm' : ''
                                }`}
                            >
                                <span className=''>{formData.throwerId ? formData.throwerName : 'Select'}</span>
                                <div className=' text-sm'>
                                    <FiChevronRight />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* runs */}
                    <div className='flex gap-5 items-center mt-3 '>
                        {ScoreButtonsF.map((item) => (
                            <div
                                onClick={(e) => {
                                    setFormData((old) => ({
                                        ...old,
                                        runs: Number(item.run),
                                    }));
                                }}
                                className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs ${
                                    Number(item.run) === Number(formData.runs) ? 'border-primary shadow-sm' : ''
                                }`}
                            >
                                {item.run}
                            </div>
                        ))}
                    </div>

                    {/* Balls */}
                    <div className='flex gap-5 items-center mt-3 '>
                        {extraButtons.map((item) => (
                            <div
                                onClick={(e) => {
                                    if (formData.key === item.toLowerCase()) {
                                        setFormData((old) => ({
                                            ...old,
                                            key: '',
                                        }));
                                        return;
                                    }

                                    setFormData((old) => ({
                                        ...old,
                                        key: item.toLowerCase(),
                                    }));
                                }}
                                className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs ${
                                    formData.key === item.toLowerCase() ? 'border-primary shadow-sm' : ''
                                }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className='mt-3 mb-3'>Position</p>
                        <div className='flex items-center gap-5 mb-3'>
                            {['striker', 'nonstriker'].map((item) => (
                                <div
                                    onClick={(e) => {
                                        setFormData((old) => ({
                                            ...old,
                                            position: item,
                                        }));
                                    }}
                                    className={`px-6 py-3 rounded-md border-2  cursor-pointer text-xs ${
                                        formData.position === item
                                            ? 'border-primary shadow-sm'
                                            : 'border-gray-200 shadow-none'
                                    }`}
                                >
                                    {item.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* if out is catch */}
            {formData.how === 'catch' && (
                <div
                    onClick={(e) => {
                        setIsPopupOpen(true);
                        setKey1('catcherId');
                        setKey2('catcherName');
                    }}
                >
                    <p className='mb-3'>Catcher</p>
                    <div
                        className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs max-w-[300px] flex justify-between items-center ${
                            formData.catcherId ? 'text-primary border-primary shadow-sm' : ''
                        }`}
                    >
                        <span className=''>{formData.catcherId ? formData.catcherName : 'Select'} </span>
                        <div className=' text-sm'>
                            <FiChevronRight />
                        </div>
                    </div>
                </div>
            )}

            {/* new batsman */}
            <div
                onClick={(e) => {
                    setIsPopupOpen(true);
                    setKey1('newPlayerId');
                    setKey2('newPlayerName');
                }}
            >
                <p className='my-3'>New Batsman</p>
                <div
                    className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs max-w-[300px] flex justify-between items-center ${
                        formData.newPlayerId ? 'text-primary border-primary shadow-sm' : ''
                    }`}
                >
                    <span className=''>{formData.newPlayerId ? formData.newPlayerName : 'Select'} </span>
                    <div className='text-sm'>
                        <FiChevronRight />
                    </div>
                </div>
            </div>

            {/* if currBall is 0.5 then select new bowler */}
            {currBall === 0.5 && (
                <div className='mb-3'>
                    <p className='my-3'>New Bowler {'(This is last ball)'}</p>
                    <div
                        onClick={(e) => {
                            setIsPopupOpen(true);
                            setKey1('newBowlerId');
                            setKey2('newBowlerName');
                        }}
                        className={`px-6 py-3 rounded-md border-2 border-gray-200 shadow-none cursor-pointer text-xs max-w-[300px] flex justify-between items-center ${
                            formData.newBowlerId ? 'text-primary border-primary shadow-sm' : ''
                        }`}
                    >
                        <span className=''>{formData.newBowlerId ? formData.newBowlerName : 'Select'} </span>
                        <div className=' text-sm'>
                            <FiChevronRight />
                        </div>
                    </div>
                </div>
            )}

            <CrButton
                // disabled={disable}
                fn={outHandler}
                name='Out'
                // loading={isLoading}
                styles={`bg-red1 font-inherit w-[340px] mx-auto py-6 rounded-xl text-base font-bold`}
            />
        </div>
    );
};

const Scorecard = () => {
    const router = useRouter();
    const { inningsId } = router.query;

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useCustomQuery(
        `/match/scorecard?inningId=${inningsId}`,
        `Scorecard${inningsId?.slice(-6)}`
    );
    const scr = data?.responseData?.data?.score[0];

    const {
        data: bowlingTeamData,
        isLoading: loading2,
        error: err2,
    } = useCustomQuery(
        `/player/playing11?matchId=${scr?.MatchID}&teamId=${scr?.Team2ID}`,
        `playing11${scr?.Team2ID?.slice(-6)}`
    );

    const [extraBtn, setExtraBtn] = useState('');
    const [newBowler, setNewBowler] = useState(false);
    const [bowlerId, setBowlerId] = useState('');
    const [newBatsman, setNewBatsman] = useState(false);

    const [outData, setOutData] = useState({
        playerId: '',
        how: '',
        newPlayerId: '',
        newPlayerName: '',
        throwerId: '',
        throwerName: '',
        catcherId: '',
        catcherName: '',
        runouterId: '',
        runouterName: '',
        newBowlerId: '',
        newBowlerName: '',
        runs: '',
        key: '',
        position: '', //striker,nonstriker
    });

    const [scoreWithBowler, setScoreWithBowler] = useState({
        runs: null,
        key: '',
    });

    const scoreUpdateHandler = async (runs, key, bowlerId) => {
        try {
            const response = await mutation.mutateAsync({
                url: '/match/scorecard',
                data: {
                    inningsId: inningsId,
                    runs: runs,
                    key: key,
                    bowlerId: bowlerId,
                    // (0.2-Math.floor(0.2)).toFixed(1)
                    ball: (scr?.CurrOver - Math.floor(scr?.CurrOver) + 0.1).toFixed(1),
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Update successfully', toastConfig());

                queryClient.invalidateQueries(['Scorecard' + inningsId?.slice(-6)]);
            } else {
                if (response.status === 401) {
                    toast.error('Auth failed', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong', toastConfig());
        }
    };

    // console.log(outData);
    return (
        <div>
            {newBatsman && (
                <>
                    <Overlay fn={setNewBatsman} />
                    <SideDrawer style={'w-[70%] max-w-[900px] bg-white  '} fn={setNewBatsman}>
                        <OutComponent
                            currBall={scr?.CurrOver - Math.floor(scr?.CurrOver)}
                            inningId={inningsId}
                            battingPlayers={data?.responseData?.data?.yetToBat}
                            bowlingPlayers={bowlingTeamData?.responseData?.data}
                            bowlerId={scr?.P3ID}
                            p1Name={scr?.P1Name}
                            p2Name={scr?.P2Name}
                            p1ID={scr?.P1ID}
                            p2ID={scr?.P2ID}
                            formData={outData}
                            setFormData={setOutData}
                        />
                    </SideDrawer>
                </>
            )}

            {newBowler && (
                <Popup
                    setIsPopupOpen={setNewBowler}
                    setFormdata={setBowlerId}
                    formData={bowlerId}
                    data={bowlingTeamData?.responseData?.data}
                    obj={scoreWithBowler}
                    scoreUpdateHandler={scoreUpdateHandler}
                />
            )}
            <div className='max-w-[1440px] mx-auto h-[100vh]'>
                <div className='grid grid-cols-2 gap-6 p-5 h-full'>
                    {/* Scorecard */}
                    <div className='bg-white rounded-xl h-[100%] w-[100%] p-3'>
                        <div className='p-5 bg-white/[0.08] border-2 border-primary shadow rounded-[inherit]'>
                            <p className='text-xl font-semibold '>IND</p>
                            <p className='text-2xl font-semibold'>
                                {scr?.TotalRuns}-{scr?.TotalWickets} {`(${scr?.CurrOver})`}
                            </p>
                            {/* <p className='text-3xl font-semibold'>13.2</p> */}
                            <p className='text-sm text-dark2 text-center mt-3 font-semibold'>{scr?.Result}</p>
                        </div>

                        <div className='mt-3 p-5 bg-white/[0.08] border-2 border-primary shadow rounded-[inherit]'>
                            <div className='bg-primary text-white font-semibold rounded-full px-5 py-1 flex gap-5'>
                                <p className='w-[230px]'>Batsman</p>
                                <div className='flex'>
                                    <p className='w-16'>R</p>
                                    <p className='w-16'>B</p>
                                    <p className='w-16'>4s</p>
                                    <p className='w-16'>6s</p>
                                    <p className='w-16'>SR</p>
                                </div>
                            </div>

                            <div className='mt-1 font-semibold px-5 py-1 flex gap-5'>
                                <p className='w-[230px] '>{scr?.P1Name}</p>
                                <div className='flex '>
                                    <p className='w-16'>{scr?.S1Runs}</p>
                                    <p className='w-16'>{scr?.S1Balls}</p>
                                    <p className='w-16'>{scr?.S1_4s}</p>
                                    <p className='w-16'>{scr?.S1_6s}</p>
                                    <p className='w-16'>{((scr?.S1Runs / scr?.S1Balls) * 100).toFixed(1)}</p>
                                </div>
                            </div>

                            <div className='mt-1 font-semibold px-5 py-1 flex gap-5'>
                                <p className='w-[230px] '>{scr?.P2Name}</p>
                                <div className='flex '>
                                    <p className='w-16'>{scr?.S2Runs}</p>
                                    <p className='w-16'>{scr?.S2Balls}</p>
                                    <p className='w-16'>{scr?.S2_4s}</p>
                                    <p className='w-16'>{scr?.S2_6s}</p>
                                    <p className='w-16'>{((scr?.S2Runs / scr?.S2Balls) * 100).toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-3 p-5 bg-white/[0.08] border-2 border-primary shadow rounded-[inherit]'>
                            <div className='bg-primary text-white font-semibold rounded-full px-5 py-1 flex gap-5'>
                                <p className='w-[230px]'>Bowler</p>
                                <div className='flex'>
                                    <p className='w-16'>O</p>
                                    <p className='w-16'>M</p>
                                    <p className='w-16'>R</p>
                                    <p className='w-16'>W</p>
                                    <p className='w-16'>Eco</p>
                                </div>
                            </div>

                            <div className='mt-1 font-semibold px-5 py-1 flex gap-5'>
                                <p className='w-[230px] '>{scr?.P3Name}</p>
                                <div className='flex '>
                                    <p className='w-16'>{scr?.CurrOver}</p>
                                    <p className='w-16'>2</p>
                                    <p className='w-16'>34</p>
                                    <p className='w-16'>2</p>
                                    <p className='w-16'>18.2</p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-3 p-5 bg-white/[0.08] border-2 border-primary shadow rounded-[inherit] relative overflow-hidden'>
                            <div className=' text-white font-semibold rounded-full px-5 py-1 grid grid-cols-5 gap-3'>
                                <>
                                    {extraBtn && (
                                        <div
                                            onClick={(e) => setExtraBtn('')}
                                            className='cursor-pointer absolute top-0 left-0 h-full w-full bg-black/50'
                                        ></div>
                                    )}
                                    {extraBtn === 'WD' && (
                                        <div className='w-[500px] flex justify-center absolute top-[60px] items-center gap-4 border-2 border-primary rounded-lg p-2 bg-white shadow-sm z-20'>
                                            {scoreButtonsWd.map((item) => (
                                                <div
                                                    onClick={() => {
                                                        if (scr?.CurrOver - Math.floor(scr?.CurrOver) === '0.5') {
                                                            setNewBowler(true);
                                                        }
                                                        scoreUpdateHandler(item.run, 'wd', bowlerId);
                                                    }}
                                                    className='cursor-pointer bg-primary px-3 py-2 text-sm font-bold rounded-md shadow flex justify-center items-center'
                                                >
                                                    wd + {item.run}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {extraBtn === 'NB' && (
                                        <div className='w-[500px] flex justify-center absolute top-[60px] items-center gap-4 border-2 border-primary rounded-lg p-2 bg-white shadow-sm z-20'>
                                            {scoreButtonsNb.map((item) => (
                                                <div
                                                    onClick={() => {
                                                        if (scr?.CurrOver - Math.floor(scr?.CurrOver) === '0.5') {
                                                            setNewBowler(true);
                                                        }
                                                        scoreUpdateHandler(item.run, 'nb', bowlerId);
                                                    }}
                                                    className='cursor-pointer bg-primary px-3 py-2 text-sm font-bold rounded-md shadow flex justify-center items-center'
                                                >
                                                    NB + {item.run}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {extraBtn === 'LB' && (
                                        <div className='w-[500px] flex justify-center absolute top-[60px] items-center gap-4 border-2 border-primary rounded-lg p-2 bg-white shadow-sm z-20'>
                                            {scoreButtonsLb.map((item) => (
                                                <div
                                                    onClick={() => {
                                                        if (scr?.CurrOver - Math.floor(scr?.CurrOver) === '0.5') {
                                                            setNewBowler(true);
                                                        }
                                                        scoreUpdateHandler(item.run, 'lb', bowlerId);
                                                    }}
                                                    className='cursor-pointer bg-primary px-3 py-2 text-sm font-bold rounded-md shadow flex justify-center items-center'
                                                >
                                                    LB + {item.run}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {extraBtn === 'B' && (
                                        <div className='w-[500px] flex justify-center absolute top-[60px] items-center gap-4 border-2 border-primary rounded-lg p-2 bg-white shadow-sm z-20'>
                                            {scoreButtonsBys.map((item) => (
                                                <div
                                                    onClick={() => {
                                                        if (scr?.CurrOver - Math.floor(scr?.CurrOver) === '0.5') {
                                                            setNewBowler(true);
                                                        }
                                                        scoreUpdateHandler(item.run, 'bys', bowlerId);
                                                    }}
                                                    className='cursor-pointer bg-primary px-3 py-2 text-sm font-bold rounded-md shadow flex justify-center items-center'
                                                >
                                                    B + {item.run}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {extraBtn === 'NBE' && (
                                        <div className='w-[500px] flex justify-center absolute top-[60px] items-center gap-4 border-2 border-primary rounded-lg p-2 bg-white shadow-sm z-20'>
                                            {scoreButtonsNbe.map((item) => (
                                                <div
                                                    onClick={() => {
                                                        if (scr?.CurrOver - Math.floor(scr?.CurrOver) === '0.5') {
                                                            setNewBowler(true);
                                                        }
                                                        scoreUpdateHandler(item.run, 'nbe', bowlerId);
                                                    }}
                                                    className='cursor-pointer bg-primary px-3 py-2 text-sm font-bold rounded-md shadow flex justify-center items-center'
                                                >
                                                    NBE + {item.run}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>

                                {ScoreButtonsF.map((item) => (
                                    <div
                                        onClick={() => {
                                            if (scr?.CurrOver - Math.floor(scr?.CurrOver) === 0.5) {
                                                setNewBowler(true);
                                                setScoreWithBowler({
                                                    runs: item.run,
                                                    key: 'f',
                                                });
                                                return;
                                            }
                                            scoreUpdateHandler(item.run, 'f', bowlerId);
                                        }}
                                        className='cursor-pointer bg-primary p-3 text-sm font-bold rounded-full shadow h-10 w-10 flex justify-center items-center'
                                    >
                                        {item.run}
                                    </div>
                                ))}

                                {extraButtons.map((item) => (
                                    <div
                                        onClick={(e) => setExtraBtn(item)}
                                        className='cursor-pointer bg-primary p-3 text-sm font-bold rounded-full shadow h-10 w-10 flex justify-center items-center'
                                    >
                                        {item}
                                    </div>
                                ))}

                                <div
                                    onClick={() => setNewBatsman(true)}
                                    className='cursor-pointer bg-primary p-3 text-sm font-bold rounded-full shadow h-10 w-10 flex justify-center items-center'
                                >
                                    OUT
                                </div>

                                {/* <div className='bg-primary p-3 text-sm font-bold rounded-full shadow h-10 w-10 flex justify-center items-center'>
                                   
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default Scorecard;
