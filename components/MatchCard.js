import { convertDate } from '@/util/date';
import { FiCalendar, FiChevronRight, FiClock, FiEye, FiMapPin, FiShield } from 'react-icons/fi';

import { IconContainer } from './IconContainer';
const MatchCard = ({ data }) => {
    return (
        <div className='bg-white shadow-lg rounded-xl border-2 border-primary overflow-hidden relative'>
            <div className='p-3 flex justify-center items-center border-b-2 border-primary'>
                <h4 className='text-primary text-lg font-bold'>
                    {data.Team1short} V/S {data.Team2short}
                </h4>
            </div>
            <div className='grid grid-cols-2 justify-between'>
                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiCalendar />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Date:</p>
                        <p className='text-sm font-semibold'>{data.Date}</p>
                    </div>
                </div>
                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiClock />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Start:</p>
                        <p className='text-sm font-semibold'>
                            {data.Day} {data.Time}
                        </p>
                    </div>
                </div>
                <div className='p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiMapPin />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Ground:</p>
                        <p className='text-sm font-semibold text-center'>{data.Ground}</p>
                    </div>
                </div>
                <div className=' p-3 rounded-md flex  items-center gap-4'>
                    <IconContainer
                        styles={'border border-primary bg-primary/10'}
                        color={'rgb(99,102,241)'}
                        size={'15px'}
                    >
                        <FiShield />
                    </IconContainer>
                    <div className='flex items-start flex-col'>
                        <p className='text-gray-400 text-sm'>Match:</p>
                        <p className='text-base font-semibold'>{data.MatchNo}</p>
                    </div>
                </div>
            </div>
            <div className=' p-3 rounded-md flex  items-center gap-4'>
                <IconContainer styles={'border border-primary bg-primary/10'} color={'rgb(99,102,241)'} size={'15px'}>
                    <FiEye />
                </IconContainer>
                <div className='flex items-start flex-col'>
                    <p className='text-gray-400 text-sm'>Result:</p>
                    <p className='text-base font-semibold'>{data.Result}</p>
                </div>
            </div>

            {/**/}

            <button className='absolute bottom-0 right-0 p-2 bg-primary text-white rounded-tl-xl hover:text-lg transition-all'>
                <FiChevronRight />
            </button>
        </div>
    );
};

export default MatchCard;
