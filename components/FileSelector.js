'use client';

import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { IconContainer } from './IconContainer';
import Image from 'next/image';

const FileSelector = ({ selectedFile, previewUrl, setSelectedFile, setPreviewUrl }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className={`w-[150px] h-[150px]  ${
                !selectedFile ? 'border-dashed border-2 rounded-lg border-primary bg-primary/10 ' : ''
            } flex flex-col items-center justify-center`}
        >
            {!selectedFile ? (
                <label className='cursor-pointer'>
                    <input type='file' className='hidden' onChange={handleFileChange} accept='image/*' />
                    <div className='flex justify-center items-center'>
                        <IconContainer color='blue' size='50px'>
                            <FiUpload />
                        </IconContainer>
                    </div>
                </label>
            ) : (
                <div className='relative group'>
                    <div className='w-[150px] h-[150px] object-cover relative rounded-lg overflow-hidden mb-2'>
                        <Image src={previewUrl} alt='Selected' layout='fill' objectFit='cover' />
                    </div>

                    {/* <p>Selected File: {selectedFile.name}</p> */}
                    <button
                        className='text-red1 text-base font-bold hidden group-hover:flex justify-center items-center w-[150px] absolute top-8 right-0'
                        onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                        }}
                    >
                        <div className='bg-red1/20 border-2 border-red1 rounded-full flex justify-center items-center'>
                            <IconContainer size='70px'>
                                <FiX />
                            </IconContainer>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FileSelector;
