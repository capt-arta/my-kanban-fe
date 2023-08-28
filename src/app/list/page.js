'use client'
import NestableComponent from '@/components/NestableComponent';
import { Table, Tag } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Nestable from 'react-nestable'

const List = () => {
  const [data, setData] = useState([]);
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

  const fetchData = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/task-list');
        const fetchedData = response.data.data;
        setData(fetchedData);
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

  useEffect(() => {
    fetchData()
  }, [])
  
  console.log(data);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Person',
      dataIndex: 'person',
      key: 'person',
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'REQUESTED':
            color = '#000000';
            text = 'Requested';
            break;
          case 'TO DO':
            color = '#507ccb';
            text = 'To Do';
            break;
          case 'IN PROGGRESS':
            color = '#f8b444';
            text = 'In Proggress';
            break;
          case 'DONE':
            color = '#4ec455';
            text = 'Done';
            break;
          default:
            color = 'gray';
            text = 'Unknown';
        }

        return (
          <Tag color={color} style={{ padding: '5px 10px' }}>
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className='w-full flex flex-col'>
        <h1>List Task</h1>
        <div>
          {/* < NestableComponent items={items} renderItem={renderItem} /> */}
          <Table dataSource={data} columns={columns} />
        </div>
    </div>
  )
}

export default List