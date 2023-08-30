'use client';
import { Suspense } from 'react';
import CrButton from '@/components/CrButton';
import ProfileInput from '@/components/ProfileInput';
import useAuthentication from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useCustomMutation, { useCustomQuery } from '@/hooks/useMutationHook';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import axios from 'axios';
const Home = () => {
    const { isAuthenticated, uid, token, email } = useAuthentication();
    console.log(isAuthenticated, uid, token, email);

    const router = useRouter();

    const mutation = useCustomMutation();
    const [formData, setFormdata] = useState({
        fname: '',
        lname: '',
        phone: '',
        pin: '',
        address: '',
        city: '',
        state: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    // const {
    //     data,
    //     isLoading: loading,
    //     error,
    // } = useCustomQuery(`/organizer/onboard?uid=${uid}`, uid?.trim(0, 10) + 'Organizer', token);

    // if (loading) {
    //     return <div>loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    // if (data.responseData.isActive) {
    //     router.push('/admin');
    // }

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
                url: '/organizer/onboard',
                data: {
                    firstName: formData.fname,
                    lastName: formData.lname,
                    phone: formData.phone,
                    uid: uid,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pin,
                },
                token: token,
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('Congratulations', toastConfig());
                console.log(response.responseData.isActive);

                if (response.responseData.isActive) {
                    router.push('/admin');
                }
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
            <Suspense fallback={<p>Loading feed...</p>}>
                <main className=''>
                    <div className='flex justify-center items-center min-h-[100vh] '>
                        <div className='w-[70%]'>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Fill Your Details</h3>
                            <div className='grid grid-cols-2 gap-6'>
                                <ProfileInput
                                    simpleLable='FIrst Name'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='fname'
                                    placeholder='ex. Moeen'
                                    type='text'
                                    value={formData.fname}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                                <ProfileInput
                                    simpleLable='Last Name'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='lname'
                                    placeholder='ex. Ali'
                                    value={formData.lname}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    type='text'
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <ProfileInput
                                    simpleLable='Phone No.'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='phone'
                                    placeholder='ex. 8766549278'
                                    value={formData.phone}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    type='text'
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                                <ProfileInput
                                    simpleLable='Pin Code'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='pin'
                                    placeholder='ex. 341021'
                                    value={formData.pin}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    type='text'
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6'>
                                <ProfileInput
                                    simpleLable='Address'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='address'
                                    placeholder='House No. landmark street'
                                    value={formData.address}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    type='text'
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                                <ProfileInput
                                    simpleLable='City / Town'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='city'
                                    placeholder='ex. Basni Belima'
                                    value={formData.city}
                                    onChange={(e) => onChangeHandler(e)}
                                    required
                                    type='text'
                                    pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                    inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-6 items-center'>
                                <ProfileInput
                                    simpleLable='State'
                                    labelClassName='text-base ml-1 text-dark2 font-bold'
                                    name='state'
                                    placeholder='ex. Rajasthan'
                                    value={formData.state}
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
            </Suspense>
        </div>
    );
};

export default Home;

export async function getServerSideProps(context) {
    const { token, uid } = context.req.cookies;
    // console.log(token);
    try {
        // Fetch the API to check user activity
        const response = await axios.get(`http://localhost:5500/organizer/onboard?uid=${uid}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in headers
            },
        });

        const userIsActive = response.data.isActive;

        if (userIsActive) {
            // Redirect to /home if user is active
            return {
                redirect: {
                    destination: '/admin',
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
