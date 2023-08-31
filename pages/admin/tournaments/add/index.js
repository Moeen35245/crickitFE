'use client';
import CrButton from '@/components/CrButton';
import ProfileInput from '@/components/ProfileInput';
import useAuthentication from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useCustomMutation, { useCustomQuery } from '@/hooks/useMutationHook';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
const TournamentAdd = () => {
    const { isAuthenticated, uid, token, email } = useAuthentication();
    console.log(isAuthenticated, uid, token, email);

    const router = useRouter();

    const mutation = useCustomMutation();
    const [formData, setFormdata] = useState({
        name: '',
        st_dt: '',
        en_dt: '',
        format: '',
        venue: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = (e) => {
        setFormdata((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));
    };

    const submitHandler = async () => {
        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/organizer/trophy',
                data: {
                    name: formData.name,
                    st_dt: new Date(formData.st_dt),
                    en_dt: new Date(formData.en_dt),
                    format: formData.format,
                    venue: formData.venue,
                    uid: uid,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Tournament Added', toastConfig());
                console.log(response.responseData.isActive);

                setFormdata({
                    name: '',
                    st_dt: '',
                    en_dt: '',
                    format: '',
                    venue: '',
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
            toast.error('Something went wrong', toastConfig());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <main className=''>
                <div className='flex justify-center items-center min-h-[100vh] '>
                    <div className='w-[70%]'>
                        <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Add Tournament</h3>
                        <div className='grid grid-cols-2 gap-6'>
                            <ProfileInput
                                simpleLable='Name'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='name'
                                placeholder='ex. Balapeer 35'
                                type='text'
                                value={formData.name}
                                onChange={(e) => onChangeHandler(e)}
                                required
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            />
                            <ProfileInput
                                simpleLable='Format'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='format'
                                placeholder='ex. T-20'
                                value={formData.format}
                                onChange={(e) => onChangeHandler(e)}
                                required
                                type='text'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-6'>
                            <ProfileInput
                                simpleLable='Start Date'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='st_dt'
                                placeholder='ex. 23 Aug 2023'
                                value={formData.st_dt}
                                onChange={(e) => onChangeHandler(e)}
                                required
                                type='date'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            />
                            <ProfileInput
                                simpleLable='End Date'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='en_dt'
                                placeholder='ex. 23 Sep 2023'
                                value={formData.en_dt}
                                onChange={(e) => onChangeHandler(e)}
                                required
                                type='Date'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-6 items-center'>
                            <ProfileInput
                                simpleLable='Venue'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='venue'
                                placeholder='ex. India'
                                value={formData.venue}
                                onChange={(e) => onChangeHandler(e)}
                                required
                                type='text'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            />
                            <CrButton
                                fn={submitHandler}
                                name='Submit'
                                loading={isLoading}
                                styles={`bg-primary font-inherit py-6 rounded-xl text-base font-bold w-full`}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TournamentAdd;
