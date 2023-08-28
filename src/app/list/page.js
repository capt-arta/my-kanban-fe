'use client'
import NestableComponent from '@/components/NestableComponent';
import React from 'react'
import Nestable from 'react-nestable'

const List = () => {
  const items = [
    { id: 0, text: 'Andy' },
    {
      id: 1, text: 'Harry',
      children: [
        { id: 2, text: 'David' }
      ]
    },
    { id: 3, text: 'Lisa' }
  ];
  
  const renderItem = ({ item }) => item.text;

  return (
    <div className='w-full flex flex-col'>
        <h1>List Task</h1>
        <div>
          < NestableComponent items={items} renderItem={renderItem} />
        </div>
    </div>
  )
}

export default List