import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useCustomMutation, { useCustomQuery } from '@/hooks/useMutationHook';
import useAuthentication from '@/hooks/useAuth';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const Popup = ({ data, setIsPopupOpen, setFormData, formData, currKey }) => {
    //
    console.log(currKey);
    console.log(formData);
    return (
        <div className='h-[100vh] w-[100%] flex justify-center absolute -top-[20px] -left-[8px] backdrop-blur-md bg-black/5 z-[100]'>
            <div
                className={`w-[900px] bg-white z-[110] rounded-lg shadow-md max-h-[90%] mt-10 overflow-y-scroll px-5 py-2 relative`}
            >
                <div onClick={(e) => setIsPopupOpen(false)} className='absolute top-5 left-5 text-dark1 cursor-pointer'>
                    <FiX />
                </div>
                <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4'>
                    Select
                    {currKey === 'batsmanStrikeId'
                        ? ' Striker'
                        : currKey === 'batsmanNonStrikeId'
                        ? ' Non Striker'
                        : ' Bowler'}
                </h3>
                {/* <p>{}</p> */}
                <div className='grid grid-cols-2 gap-5'>
                    {data?.responseData?.data?.map((item) => (
                        <div
                            onClick={(e) => {
                                if (
                                    formData.batsmanStrikeId === item.PlayerID ||
                                    formData.batsmanNonStrikeId === item.PlayerID
                                )
                                    return;
                                // if (formData.team1Name === item.TeamName || formData.team2Name === item.TeamName) return;
                                if (currKey === 'batsmanStrikeId')
                                    setFormData((old) => ({
                                        ...old,
                                        batsmanStrikeId: item.PlayerID,
                                        batsmanStrikeName: item.FirstName + ' ' + item.LastName,
                                    }));
                                else if (currKey === 'batsmanNonStrikeId')
                                    setFormData((old) => ({
                                        ...old,
                                        batsmanNonStrikeId: item.PlayerID,
                                        batsmanNonStrikeName: item.FirstName + ' ' + item.LastName,
                                    }));
                                else
                                    setFormData((old) => ({
                                        ...old,
                                        bowlerId: item.PlayerID,
                                        bowlerName: item.FirstName + ' ' + item.LastName,
                                    }));

                                setIsPopupOpen(false);
                            }}
                            className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer  ${
                                formData.batsmanStrikeId === item.PlayerID ||
                                formData.batsmanNonStrikeId === item.PlayerID
                                    ? 'opacity-40 border-gray-200'
                                    : 'opacity-100'
                            }`}
                        >
                            <div className='flex items-center gap-3'>
                                <div className='relative h-[25px] w-[25px] rounded-full overflow-hidden'>
                                    <Image
                                        layout='fill'
                                        objectFit='cover'
                                        src={`http://localhost:5500/${item.Image}`}
                                        alt={item.FirstName}
                                    />
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
        </div>
    );
};

const AddInning = () => {
    const { uid, token } = useAuthentication();
    const router = useRouter();
    const { matchId, battingTeamId, bowlingTeamId } = router.query;

    // return (
    //     <div>
    //         <p>{matchId}</p>
    //         <p>{battingTeamId}</p>
    //         <p>{bowlingTeamId}</p>
    //     </div>
    // );

    const {
        data: battingTeamData,
        isLoading: loading1,
        error: err1,
    } = useCustomQuery(
        `/player/playing11?matchId=${matchId}&teamId=${battingTeamId}`,
        `playing11${battingTeamId?.slice(-6)}`
    );

    const {
        data: bowlingTeamData,
        isLoading: loading2,
        error: err2,
    } = useCustomQuery(
        `/player/playing11?matchId=${matchId}&teamId=${bowlingTeamId}`,
        `playing11${bowlingTeamId?.slice(-6)}`
    );

    const divRef = useRef();

    const mutation = useCustomMutation();

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currKey, setCurrKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [formData, setFormData] = useState({
        batsmanStrikeId: '',
        batsmanStrikeName: '',
        batsmanNonStrikeName: '',
        batsmanNonStrikeId: '',
        bowlerId: '',
        bowlerName: '',
    });

    useEffect(() => {
        const fieldsCheck = !(
            formData.batsmanNonStrikeId &&
            formData.batsmanNonStrikeId &&
            formData.bowlerId &&
            formData.batsmanStrikeName &&
            formData.batsmanNonStrikeName &&
            formData.bowlerName
        );

        setDisable(fieldsCheck);
    }, [formData]);

    const submitHandler = async () => {
        if (
            !(
                formData.batsmanNonStrikeId &&
                formData.batsmanNonStrikeId &&
                formData.bowlerId &&
                formData.batsmanStrikeName &&
                formData.batsmanNonStrikeName &&
                formData.bowlerName
            )
        ) {
            toast.error('All fields required', toastConfig());
        }

        console.log({
            matchId: matchId,
            battingTeamId: battingTeamId,
            bowlingTeamId: bowlingTeamId,
            playerOnStrike: formData.batsmanStrikeId,
            playerNonStrike: formData.batsmanNonStrikeId,
            bowler: formData.bowlerId,
            uid: uid,
        });

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/match/inning',
                data: {
                    matchId: matchId,
                    battingTeamId: battingTeamId,
                    bowlingTeamId: bowlingTeamId,
                    playerOnStrike: formData.batsmanStrikeId,
                    playerNonStrike: formData.batsmanNonStrikeId,
                    bowler: formData.bowlerId,
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Added successfully', toastConfig());
                router.push({
                    pathname: '/admin/tournaments/match/scorecard',
                    query: {
                        matchId: matchId,
                        inningsId: response.responseData.InningsID,
                    },
                });
                // setFormdata({
                //     team1: '',
                //     team2: '',
                //     team1Name: '',
                //     team2Name: '',
                //     ground: '',
                //     date: '',
                // });
                // queryClient.invalidateQueries(['allMatches']);
                // localStorage.setItem('user', JSON.stringify(response.responseData.data));
                // router.push('/admin/onboard');
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col gap-5 items-center'>
            <h1 className='mt-20 font-semibold text-2xl'>Please Select Players</h1>
            <div ref={divRef}>
                {isPopupOpen && (
                    <Popup
                        data={
                            currKey === 'batsmanStrikeId' || currKey === 'batsmanNonStrikeId'
                                ? battingTeamData
                                : bowlingTeamData
                        }
                        setIsPopupOpen={setIsPopupOpen}
                        setFormData={setFormData}
                        formData={formData}
                        currKey={currKey}
                    />
                )}

                <div
                    onClick={(e) => {
                        setCurrKey('batsmanStrikeId');
                        setIsPopupOpen(true);
                    }}
                >
                    <ProfileInput
                        simpleLable='Striker'
                        labelClassName='text-base ml-1 text-dark2 font-bold'
                        placeholder='ex. Rohit Sharma'
                        type='text'
                        value={formData.batsmanStrikeName}
                        required
                        pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                        inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                    />
                </div>
                <div
                    onClick={(e) => {
                        setCurrKey('batsmanNonStrikeId');
                        setIsPopupOpen(true);
                    }}
                >
                    <ProfileInput
                        simpleLable='Non Striker'
                        labelClassName='text-base ml-1 text-dark2 font-bold'
                        placeholder='ex. Virat Kohli'
                        type='text'
                        value={formData.batsmanNonStrikeName}
                        required
                        pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                        inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                    />
                </div>

                <div
                    onClick={(e) => {
                        setCurrKey('bowlerId');
                        setIsPopupOpen(true);
                    }}
                >
                    <ProfileInput
                        simpleLable='Bowler'
                        labelClassName='text-base ml-1 text-dark2 font-bold'
                        placeholder='ex. Shaheen Afridi'
                        type='text'
                        value={formData.bowlerName}
                        required
                        pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                        inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                    />
                </div>
                <CrButton
                    disabled={disable}
                    fn={submitHandler}
                    name='Start Inning'
                    loading={isLoading}
                    styles={`bg-primary font-inherit w-[340px] py-6 rounded-xl text-base font-bold`}
                />
            </div>
        </div>
    );
};

export default AddInning;
