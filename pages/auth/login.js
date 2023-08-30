'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
// import nookies, { setCookie, destroyCookie } from 'nookies';
import useCustomMutation from '@/hooks/useMutationHook';
import Cookies from 'js-cookie';
import inputValidations from '@/util/validaton';

const Login = () => {
    const divRef = useRef(null);

    const router = useRouter();
    const mutation = useCustomMutation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [disable, setDisable] = useState(true);

    const onSubmitHandler = async () => {
        if (!email || !password) {
            toast.error('Enter credentials', toastConfig());
        }

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/organizer/login',
                data: { email: email, password: password },
                method: 'POST',
            });

            if (response.status === 200) {
                toast.success('Login successfully', toastConfig());

                new Promise((resolve, reject) => {
                    // Remove Token
                    Cookies.remove('token');
                    Cookies.remove('uid');
                    Cookies.remove('email');
                    // Add Token
                    Cookies.set('token', response.responseData.data.token, { expires: 3600 * 24 * 7 });
                    Cookies.set('uid', response.responseData.data.uid, { expires: 3600 * 24 * 7 });
                    Cookies.set('email', response.responseData.data.email, { expires: 3600 * 24 * 7 });
                    resolve();
                })
                    .then(() => router.push('/admin/onboard'))
                    .catch((err) => console.log(err));

                // localStorage.setItem('user', JSON.stringify(response.responseData.data));
                // router.push('/admin/onboard');
            } else {
                if (response.status === 401) {
                    toast.error('Invalid credentials', toastConfig());
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

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(email && password);

        setDisable(errExist || fieldsCheck);
    }, [email, password]);

    console.log(disable);

    return (
        <main className=''>
            <div className='grid grid-cols-2'>
                <div className='relative h-[100vh]'>
                    <div className='absolute top-0 left-0 bg-[#b2f5ea96] h-full w-full z-20'></div>
                    <Image alt='banner' src='/banner.jpg' layout='fill' objectFit='cover' className='z-10' />
                </div>
                <div ref={divRef} className='flex justify-center items-center '>
                    <div className='w-[60%]'>
                        <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Sign in to your account </h3>
                        <ProfileInput
                            simpleLable='Email'
                            labelClassName='text-base ml-1 text-dark2 font-bold'
                            name='email'
                            placeholder='example@gmail.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            required
                            pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                            inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            validation={inputValidations.email}
                        />
                        <ProfileInput
                            simpleLable='Password'
                            labelClassName='text-base ml-1 text-dark2 font-bold'
                            name='password'
                            placeholder='**********'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            type='password'
                            pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                            inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                            validation={inputValidations.password}
                        />
                        <CrButton
                            disabled={disable}
                            loading={isLoading}
                            fn={onSubmitHandler}
                            name='Sign in'
                            styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                        />
                        <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                        <div className='flex justify-center gap-3'>
                            <span>Not yet a user?</span>
                            <span className='text-primary hover:opacity-90 transition-all '>
                                <Link href='/auth/signup'>Sign up here</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
