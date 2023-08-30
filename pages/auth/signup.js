'use client';
import Image from 'next/image';
import ProfileInput from '@/components/ProfileInput';
import CrButton from '@/components/CrButton';
import useCustomMutation from '@/hooks/useMutationHook';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { toastConfig } from '@/util/toastConfig';
import inputValidations from '@/util/validaton';
import Cookies from 'js-cookie';
// import nookies, { setCookie, destroyCookie } from 'nookies';

const SignUp = () => {
    const divRef = useRef(null);
    const router = useRouter();
    const mutation = useCustomMutation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [role, setRole] = useState('O');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [disable, setDisable] = useState(true);

    const submitHandler = async () => {
        if (password !== confirm) {
            toast.error('Password not match', toastConfig());
            return;
        }
        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/organizer',
                data: { email: email, password: password, role: role },
                method: 'POST',
            });

            if (response.status === 201) {
                toast.success('OTP sent', toastConfig());
                setIsOtpSent(true);
            } else {
                if (response.status === 422) {
                    toast.error('User alredy exist', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const otpVerify = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter 6 otp', toastConfig());
            return;
        }

        setIsLoading(true);
        try {
            const response = await mutation.mutateAsync({
                url: '/organizer/verify',
                data: { email: email, code: otp },
                method: 'POST',
            });

            if (response.status === 200) {
                toast.success('Otp has been verified', toastConfig());
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
            } else {
                if (response.status === 404) {
                    toast.error('Invalid otp', toastConfig());
                } else {
                    toast.error('Something went wrong', toastConfig());
                }
            }

            console.log(response.responseData.data);
        } catch (error) {
            toast.error('Something went wrong', toastConfig());
        } finally {
            setIsLoading(false);
        }
    };

    const resendOtp = () => {};

    useEffect(() => {
        const errExist = !!divRef.current?.getElementsByClassName('FORM_ERROR_EXISTS').length;

        const fieldsCheck = !(email && password && confirm);

        setDisable(errExist || fieldsCheck);
    }, [email, password, confirm]);

    return (
        <main className=''>
            <div className='grid grid-cols-2'>
                <div className='relative h-[100vh]'>
                    <div className='absolute top-0 left-0 bg-[#b2f5ea96] h-full w-full z-20'></div>
                    <Image alt='banner' src='/banner.jpg' layout='fill' objectFit='cover' className='z-10' />
                </div>
                {isOtpSent ? (
                    <div className='flex justify-center items-center '>
                        <div ref={divRef} className='w-[60%] '>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Enter Otp</h3>
                            <ProfileInput
                                simpleLable='Otp'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='otp'
                                placeholder='123456'
                                type='email'
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                validation={inputValidations.otp}
                            />
                            <CrButton
                                disabled={disable}
                                fn={otpVerify}
                                name='Verify'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                            />
                            <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                            <div className='flex justify-center gap-3'>
                                <span>Not get yet?</span>
                                <span className='text-primary hover:opacity-90 transition-all '>
                                    <p>resend</p>
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-center items-center '>
                        <div ref={divRef} className='w-[60%]'>
                            <h3 className='text-dark1 text-3xl font-extrabold mb-6'>Welcome! </h3>
                            <ProfileInput
                                simpleLable='Email'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='email'
                                placeholder='example@gmail.com'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            <ProfileInput
                                simpleLable='Confirm'
                                labelClassName='text-base ml-1 text-dark2 font-bold'
                                name='confirm'
                                placeholder='**********'
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                type='password'
                                pClassName='shadow-sm mb-4 border-2 px-2 py-1 border-gray-300 focus-within:border-primary rounded-xl w-full'
                                inputClassName='font-normal sm:text-[16px] py-1 h-[38px] outline-none border-none'
                                validation={inputValidations.password}
                            />
                            <CrButton
                                disabled={disable}
                                fn={submitHandler}
                                name='Sign in'
                                loading={isLoading}
                                styles={`bg-primary font-inherit w-full py-6 rounded-xl text-base font-bold`}
                            />
                            <div className='w-full h-[1px] bg-gray-400 my-6'></div>
                            <div className='flex justify-center gap-3'>
                                <span>Already registered? </span>
                                <span className='text-primary hover:opacity-90 transition-all '>
                                    <Link href='/auth/login'>Sign in here</Link>
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SignUp;
