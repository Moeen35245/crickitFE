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
import FileSelector from '@/components/FileSelector';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import TeamCard from '@/components/TeamCard';
import { battingSTyle, bowlingStyle, playerRole } from '@/util/constant';
import PlayerCard from '@/components/PlayerCard';

const Badge = ({ text, isSelected }) => {
    return (
        <div
            className={`cursor-pointer px-2 py-1 bg-primary/20 border-2 rounded-[4px] ${
                isSelected ? 'border-primary' : ''
            }`}
        >
            <p className='text-[12px] font-medium text-primary'>{text}</p>
        </div>
    );
};

const AllTeams = () => {
    const router = useRouter();
    const { id } = router.query;

    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const { data, isLoading: loading, error } = useCustomQuery(`/player?teamId=${id}`, 'allPlayers');
    const [isOpen, setIsOpen] = useState(false);
    const [playerData, setPlayerData] = useState({
        fname: '',
        lname: '',
        phone: '',
        dob: '',
        battingSTyle: '',
        bowlingStyle: '',
        role: '',
    });
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const formData = new FormData();

    const divRef = useRef();

    console.log(data);

    const onChangeHandler = (e) => {
        setPlayerData((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(playerData.fname && playerData.lname && playerData.phone);

        setDisable(errExist || fieldsCheck);
    }, [playerData]);

    const submitHandler = async () => {
        if (!playerData.fname || !playerData.lname || !playerData.phone) {
            toast.error('All fields required', toastConfig());
        }

        formData.append('fname', playerData.fname);
        formData.append('lname', playerData.lname);
        formData.append('phone', playerData.phone);
        formData.append('role', playerData.role);
        formData.append('battingStyle', playerData.battingSTyle);
        formData.append('bowlingStyle', playerData.bowlingStyle);
        formData.append('dob', playerData.dob);
        formData.append('teamId', id);
        formData.append('uid', uid);
        formData.append('Image', selectedFile);

        console.log(formData);

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/player',
                data: formData,
                token: token,
                isFormData: true,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Added successfully', toastConfig());
                setPlayerData({
                    fname: '',
                    lname: '',
                    phone: '',
                    dob: '',
                    battingSTyle: '',
                    bowlingStyle: '',
                    role: '',
                });
                setSelectedFile('');
                setPreviewUrl('');
                queryClient.invalidateQueries(['allPlayers']);
                // localStorage.setItem('user', JSON.stringify(response.responseData.data));
                // router.push('/admin/onboard');
            } else {
                if (response.status === 401) {
                    toast.error('Auth failed', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log('Request:', {
                url: response.url,
                method: response.method,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: formData, // Log the FormData object for reference
            });
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
                    <div ref={divRef} className=''>
                        <div className='flex items-center flex-col mx-auto '>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Add Player</h3>

                            <div className='flex items-center w-[80%] gap-10'>
                                <div className='mt-10'>
                                    <FileSelector
                                        selectedFile={selectedFile}
                                        previewUrl={previewUrl}
                                        setSelectedFile={setSelectedFile}
                                        setPreviewUrl={setPreviewUrl}
                                    />
                                </div>
                                <div>
                                    <div className='mt-3'>
                                        <p className='text-base ml-1 mb-2 text-dark2 font-bold'>Player Role</p>
                                        <div className='flex gap-2 flex-wrap'>
                                            {playerRole.map((item) => (
                                                <div
                                                    onClick={(e) => {
                                                        if (playerData.role === item)
                                                            setPlayerData((state) => ({ ...state, role: '' }));
                                                        else setPlayerData((state) => ({ ...state, role: item }));
                                                    }}
                                                >
                                                    <Badge isSelected={playerData.role === item} text={item} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-base ml-1 mb-2 text-dark2 font-bold'>Batting Style</p>
                                        <div className='flex gap-2 flex-wrap'>
                                            {battingSTyle.map((item) => (
                                                <div
                                                    onClick={(e) => {
                                                        if (playerData.battingSTyle === item)
                                                            setPlayerData((state) => ({ ...state, battingSTyle: '' }));
                                                        else
                                                            setPlayerData((state) => ({
                                                                ...state,
                                                                battingSTyle: item,
                                                            }));
                                                    }}
                                                >
                                                    <Badge isSelected={playerData.battingSTyle === item} text={item} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='mt-3'>
                                        <p className='text-base ml-1 mb-2 text-dark2 font-bold'>Bowling Style</p>
                                        <div className='flex gap-2 flex-wrap'>
                                            {bowlingStyle.map((item) => (
                                                <div
                                                    onClick={(e) => {
                                                        if (playerData.bowlingStyle === item)
                                                            setPlayerData((state) => ({ ...state, bowlingStyle: '' }));
                                                        else
                                                            setPlayerData((state) => ({
                                                                ...state,
                                                                bowlingStyle: item,
                                                            }));
                                                    }}
                                                >
                                                    <Badge isSelected={playerData.bowlingStyle === item} text={item} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 items-start mt-5 w-[80%]'>
                                <ProfileInput
                                    simpleLable='First Name'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='fname'
                                    placeholder='ex. Virat'
                                    type='text'
                                    value={playerData.fname}
                                    onChange={onChangeHandler}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    validation={inputValidations.name}
                                />
                                <ProfileInput
                                    simpleLable='Last Name'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='lname'
                                    placeholder='ex. Kohli'
                                    type='text'
                                    value={playerData.lname}
                                    onChange={onChangeHandler}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    validation={inputValidations.name}
                                />
                                <ProfileInput
                                    simpleLable='Phone no.'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='phone'
                                    placeholder='ex. 8822675678'
                                    type='text'
                                    value={playerData.phone}
                                    onChange={onChangeHandler}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                    validation={inputValidations.phone}
                                />

                                <ProfileInput
                                    simpleLable='DOB'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='dob'
                                    placeholder='ex. 11/01/1999'
                                    type='date'
                                    value={playerData.dob}
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
                                ? 'All Teams'
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
                    <div className='mt-10 grid grid-cols-3 gap-6'>
                        {data?.responseData?.data?.map((item) => (
                            <PlayerCard data={item.Player} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTeams;
