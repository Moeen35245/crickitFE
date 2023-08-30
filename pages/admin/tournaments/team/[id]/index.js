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
const AllTeams = () => {
    const router = useRouter();
    const { id } = router.query;

    console.log(router.query);
    const { uid, token } = useAuthentication();

    const mutation = useCustomMutation();

    const queryClient = useQueryClient();

    const { data, isLoading: loading, error } = useCustomQuery(`/team?trophyId=${id}`, 'allTeams');
    const [isOpen, setIsOpen] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const formData = new FormData();

    const divRef = useRef();

    console.log(data);

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !teamName;

        setDisable(errExist || fieldsCheck);
    }, [teamName]);

    const submitHandler = async () => {
        if (!teamName) {
            toast.error('Enter Team Name', toastConfig());
        }

        if (!selectedFile) {
            toast.error('Select Image', toastConfig());
        }

        formData.append('uid', uid);
        formData.append('name', teamName);
        formData.append('trophyId', id);
        formData.append('Image', selectedFile);

        console.log(formData);

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/team',
                data: formData,
                token: token,
                isFormData: true,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Added successfully', toastConfig());
                setTeamName('');
                setSelectedFile('');
                setPreviewUrl('');
                queryClient.invalidateQueries(['allTeams']);
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
                <SideDrawer fn={(e) => setIsOpen(false)}>
                    <div ref={divRef} className='mt-10  '>
                        <div className='flex items-center flex-col mx-auto max-w-[80%]'>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Add Team</h3>
                            <FileSelector
                                selectedFile={selectedFile}
                                previewUrl={previewUrl}
                                setSelectedFile={setSelectedFile}
                                setPreviewUrl={setPreviewUrl}
                            />
                            <ProfileInput
                                simpleLable='Name'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='teamName'
                                placeholder='ex. India'
                                type='text'
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-[340px]'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                validation={inputValidations.name}
                            />
                            <CrButton
                                disabled={disable}
                                fn={submitHandler}
                                name='Add'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
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
                            <div
                                className='cursor-pointer'
                                onClick={(e) => router.push(`/admin/tournaments/player/${item.TeamID}`)}
                            >
                                <TeamCard
                                    img={`http://localhost:5500/${item.Image}`}
                                    name={item.TeamName}
                                    player={item.TotalPlayers}
                                />
                            </div>
                        ))}
                    </div>
                    {/* <TeamCard img={}/> */}
                </div>
            </div>
        </div>
    );
};

export default AllTeams;
