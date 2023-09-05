'use client';
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
import MatchCard from '@/components/MatchCard';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';

const Popup = ({ setIsPopupOpen, setFormdata, formData, cuurTeamList }) => {
    const router = useRouter();
    const { id } = router.query;

    const { data, isLoading: loading, error } = useCustomQuery(`/team?trophyId=${id}`, 'allTeams');
    return (
        <div className='h-[100vh] w-[110%] flex justify-center absolute -top-[20px] -left-[8px] backdrop-blur-md bg-black/5 z-[100]'>
            <div
                className={`w-[400px] bg-white z-[110] rounded-lg shadow-md max-h-[80%] mt-6 overflow-y-scroll p-2 relative`}
            >
                <div onClick={(e) => setIsPopupOpen(false)} className='absolute top-5 left-5 text-dark1 cursor-pointer'>
                    <FiX />
                </div>
                <h3 className='text-dark1 text-2xl font-bold mb-4 text-center mt-4'>Select Team</h3>

                {data?.responseData?.data?.map((item) => (
                    <div
                        onClick={(e) => {
                            if (item.TotalPlayers < 11) return;
                            if (formData.team1Name === item.TeamName || formData.team2Name === item.TeamName) return;

                            if (cuurTeamList === 1)
                                setFormdata((old) => ({
                                    ...old,
                                    team1Name: item.TeamName,
                                    team1: item.TeamID,
                                }));
                            else
                                setFormdata((old) => ({
                                    ...old,
                                    team2Name: item.TeamName,
                                    team2: item.TeamID,
                                }));

                            setIsPopupOpen(false);
                        }}
                        className={`px-6 py-3 rounded-md border-2 mb-3 border-gray-400 cursor-pointer ${
                            item.TotalPlayers < 11 ||
                            formData.team1Name === item.TeamName ||
                            formData.team2Name === item.TeamName
                                ? 'opacity-40'
                                : ''
                        }`}
                    >
                        <div className='flex items-center gap-3'>
                            <div className='relative h-[25px] w-[25px]'>
                                <Image layout='fill' objectFit='cover' src={`http://localhost:5500/${item.Image}`} />
                            </div>
                            <div>
                                <p>{item.TeamName}</p>
                                <p className='text-xs text-red-600 font-medium'>
                                    {item.TotalPlayers >= 11 ? '' : `need ${11 - item.TotalPlayers}  more players`}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AllTeams = () => {
    const router = useRouter();
    const { id } = router.query;

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const { data, isLoading: loading, error } = useCustomQuery(`/match?trophyId=${id}`, 'allMatches');
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormdata] = useState({
        team1: '',
        team2: '',
        team1Name: '',
        team2Name: '',
        ground: '',
        date: '',
    });
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [cuurTeamList, setCurrTeamList] = useState(0);

    const divRef = useRef();

    console.log(data);

    const onChangeHandler = (e) => {
        setFormdata((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(formData.team1 && formData.team2 && formData.ground && formData.date);

        setDisable(errExist || fieldsCheck);
    }, [formData]);

    const submitHandler = async () => {
        if (!(formData.team1 && formData.team2 && formData.ground && formData.date)) {
            toast.error('All fields required', toastConfig());
        }

        console.log(formData);

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/match',
                data: {
                    team1: formData.team1,
                    team2: formData.team2,
                    trophyId: id,
                    ground: formData.ground,
                    date: formData.date,
                    time: formData.date,
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Added successfully', toastConfig());
                setFormdata({
                    team1: '',
                    team2: '',
                    team1Name: '',
                    team2Name: '',
                    ground: '',
                    date: '',
                });
                queryClient.invalidateQueries(['allMatches']);
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
        <div>
            {isOpen && <Overlay fn={(e) => setIsOpen(false)} />}
            {isOpen && (
                <SideDrawer style={`w-[75vw]`} fn={(e) => setIsOpen(false)}>
                    {isPopupOpen && (
                        <Popup
                            setIsPopupOpen={setIsPopupOpen}
                            setFormdata={setFormdata}
                            formData={formData}
                            cuurTeamList={cuurTeamList}
                        />
                    )}
                    <div ref={divRef} className=''>
                        <div className='flex items-center flex-col mx-auto '>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Add Player</h3>

                            <div className='grid grid-cols-2 items-start mt-5 w-[80%]'>
                                <div
                                    onClick={(e) => {
                                        setIsPopupOpen(true);
                                        setCurrTeamList(1);
                                    }}
                                >
                                    <ProfileInput
                                        simpleLable='Team1'
                                        labelClassName='text-base ml-1 text-dark2 font-bold'
                                        placeholder='ex. India'
                                        type='text'
                                        value={formData.team1Name}
                                        required
                                        pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                        inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    />
                                </div>

                                <div
                                    onClick={(e) => {
                                        setIsPopupOpen(true);
                                        setCurrTeamList(2);
                                    }}
                                >
                                    <ProfileInput
                                        simpleLable='Team2'
                                        labelClassName='text-base ml-1 text-dark2 font-bold'
                                        placeholder='ex. Pakistan'
                                        type='text'
                                        value={formData.team2Name}
                                        required
                                        pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                        inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    />
                                </div>
                                <ProfileInput
                                    simpleLable='Ground'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='ground'
                                    placeholder='ex. Wankede'
                                    type='text'
                                    value={formData.ground}
                                    onChange={onChangeHandler}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    validation={inputValidations.name}
                                />

                                <ProfileInput
                                    simpleLable='Date & Time'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='date'
                                    placeholder='ex. 8822675678'
                                    type='datetime-local'
                                    value={formData.date}
                                    onChange={onChangeHandler}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                            </div>

                            {/* <div className='grid grid-cols-2 mt-2 w-[80%]'>
                                
                            </div> */}

                            <CrButton
                                disabled={disable}
                                fn={submitHandler}
                                name='Add'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-[340px] py-6 rounded-xl text-base font-bold`}
                            />
                        </div>
                    </div>
                </SideDrawer>
            )}
            <div className='max-w-[1140px] mx-auto mt-8'>
                <div>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-dark1 text-3xl font-extrabold mb-6'>
                            {data && data?.status === 200
                                ? 'All Matches'
                                : data?.status === 404
                                ? 'No Data Found'
                                : 'Something wrong'}
                        </h3>

                        <button
                            onClick={(e) => setIsOpen(true)}
                            className='px-6 py-2 rounded-lg bg-primary/10 text-primary text-lg font-bold '
                        >
                            Add
                        </button>
                    </div>
                    <div className='w-full h-[1px] bg-gray-400 my-6'> </div>
                    <div className='mt-10 grid grid-cols-3 gap-6 mb-10'>
                        {data?.responseData?.data?.map((item) => (
                            <div
                                onClick={(e) =>
                                    router.push({
                                        pathname: `/admin/tournaments/match/start`,
                                        query: {
                                            id: item.MatchID,
                                            team1: item.Team1ID,
                                            team2: item.Team2ID,
                                            team1Name: item.Team1name,
                                            team2Name: item.Team2name,
                                        },
                                    })
                                }
                            >
                                <MatchCard data={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTeams;
