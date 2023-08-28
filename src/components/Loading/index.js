'use client'
import { Spin } from 'antd';
import React from 'react';
import {LoadingOutlined} from '@ant-design/icons'

const Loading = () => {
    return (
        <div>
            <div className='flex flex-col fixed z-[99999] top-0 bottom-0 left-0 justify-center  h-screen w-screen items-center transition-opacity ease-out'>
                <div className='flex flex-col items-center justify-center p-4 bg-[#1677ff] rounded-lg gap-4 text-white'>
                    <LoadingOutlined style={{fontSize:32, color: 'white'}} spin/>
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default Loading;
