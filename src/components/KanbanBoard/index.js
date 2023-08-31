'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Loading from '../Loading';
import axios from 'axios';
import { Button, Modal, Form, Input, DatePicker, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment/moment';
import dayjs from 'dayjs';
const { confirm } = Modal;

const itemsFromBackend = [
    {
        id: '1',
        content: {
            recipient: 'Arta',
            description: 'First task',
            color: '#deebff',
        },
    },
    {
        id: '2',
        content: {
            recipient: 'Syifa',
            description: 'Second task',
            color: '#eae6ff',
        },
    },
    {
        id: '3',
        content: {
            recipient: 'Syifa',
            description: 'Third task',
            color: '#eae6ff',
        },
    },
    {
        id: '4',
        content: {
            recipient: 'Arta',
            description: 'Fourth task',
            color: '#deebff',
        },
    },
    {
        id: '5',
        content: {
            recipient: 'Arta',
            description: 'Fifth task',
            color: '#deebff',
        },
    },
    {
        id: '6',
        content: {
            recipient: 'Syifa',
            description: 'Sixth task',
            color: '#eae6ff',
        },
    },
];

const columnsFromBackend = {
    1: {
        name: 'REQUESTED',
        items: itemsFromBackend,
    },
    2: {
        name: 'TO DO',
        items: [],
    },
    3: {
        name: 'IN PROGRESS',
        items: [],
    },
    4: {
        name: 'DONE',
        items: [],
    },
};

const KanbanBoard = () => {
    // console.log('kanban online');
    const [columns, setColumns] = useState(columnsFromBackend);
    const [loading, setLoading] = useState(true);
    const [detailTask, setDetailTask] = useState(null);
    const [modalCreateOpen, setModalCreateOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

    const boardCheck = (val) => {
        // console.log(val);
        let color;
        switch (val) {
            case 'TO DO':
                color = '#507ccb';
                break;
            case 'IN PROGRESS':
                color = '#f8b444';
                break;
            case 'DONE':
                color = '#4ec455';
                break;
            default:
                color = 'black';
                break;
        }
        return color;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/task');
            const fetchedData = response.data.data;
            // setTaskData(fetchedData);
            setColumns(fetchedData);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const showModal = () => {
        setModalCreateOpen(true);
    };

    const handleCancel = () => {
        setModalCreateOpen(false);
        setModalEditOpen(false);
        setEditMode(false);
        setDetailTask(null)
        form.resetFields();
    };

    const detailTaskData = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api /task/${id}`);
            setDetailTask(response.data.data);
            setTimeout(() => {
                setLoading(false)
            }, 300);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleModalEdit = async (val) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/task/${val.id}`);
            const fetchedDetailTask = response.data.data;
            console.log({
                date: [dayjs(fetchedDetailTask.start_date), dayjs(fetchedDetailTask.end_date)],
                description: fetchedDetailTask.description,
                name: fetchedDetailTask.name,
                person: fetchedDetailTask.person
            }, 'response');
            form.setFieldsValue({
                date: [dayjs(fetchedDetailTask.start_date), dayjs(fetchedDetailTask.end_date)],
                description: fetchedDetailTask.description,
                name: fetchedDetailTask.name,
                person: fetchedDetailTask.person
            });
            setDetailTask(fetchedDetailTask);
            setModalEditOpen(true);

            setLoading(false);
        } catch (error) {
            console.error('An error occurred:', error);
            setLoading(false);
        }
    };

    const createTaskData = async (data) => {
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/task', data);
            setTimeout(() => {
                fetchData();
                setLoading(false);
            }, 500);
            message.success('Data Created!');
        } catch (error) {
            console.error('An error occurred:', error);
            message.error(error)
        }
    }

    const editTaskData = async (data) => {
        setLoading(true);
        try {
            await axios.put(`http://127.0.0.1:8000/api/task/${detailTask.id}`, data);
            setTimeout(() => {
                setLoading(false);
            }, 500);
            message.success('Data Updated!');
        } catch (error) {
            console.error('An error occurred:', error);
            message.error(error)
        }
    }

    const kanbanDragEnd = async (id,data) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/task/${id}`, data);
            // message.success('Data Updated!');
        } catch (error) {
            console.error('An error occurred:', error);
            // message.error(error)
        }
    }

    const deleteTaskData = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/task/${id}`);
            setTimeout(() => {
                fetchData();
                handleCancel
                setLoading(false);
            }, 500);
            message.info('Data Deleted!');
        } catch (error) {
            console.error('An error occurred:', error);
            message.error(error);
        }
    }

    const handleEditTask = (values) => {

        const [startDate, endDate] = values?.date.map((it)=>dayjs(it).format('YYYY-MM-DD'));
        const finalData = {
            ...values,
            start_date: startDate,
            end_date: endDate
        };
        delete finalData.date;
        editTaskData(finalData);
        setTimeout(() => {
            setModalEditOpen(false);
            setEditMode(false);
            setDetailTask(null)
            form.resetFields();
            fetchData();
        }, 500);
    }

    const handleCreateTask = (values) => {
        const [startDate, endDate] = values.date;

        const formattedStartDate = moment(startDate.toISOString()).format('YYYY-MM-DD');
        const formattedEndDate = moment(endDate.toISOString()).format('YYYY-MM-DD');

        const finalData = {
            ...values,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
        };
        delete finalData.date;

        createTaskData(finalData);
        setModalCreateOpen(false);
    };

    const handleDeleteTask = (id) => {
        deleteTaskData(id);
    }

    useEffect(() => {
        fetchData();
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleFilled />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleDeleteTask(id);
            },
            onCancel() {
                handleCancel;
            },
        });
    };

    
    const onDragEnd = (result, columns, setColumns) => {

        if (!result.destination) return;
        const { source, destination } = result;
        console.log(result, columns, 'dragEnd');
        let status = "";
        switch (destination.droppableId) {
            case '0':
                status = 'REQUESTED';
                break;
            case '1':
                status = 'TO DO';
                break;
            case '2':
                status = 'IN PROGRESS';
                break;
            case '3':
                status = 'DONE';
                break;
            default:
                break;
        }

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems,
                },
            });

            // if ((result.draggableId != 0) || (result.draggableId !=  1) || (result.draggableId !=  2) || (result.draggableId !=  3)) {
            //     return message.error('Not Valid')
            // } else {
                kanbanDragEnd(result.draggableId, {status: status})
            // }
            console.log({id:result.draggableId, data:{status: status}}, 'dragEnddiff');
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems,
                },
            });
            console.log(copiedItems,'dragEnd');
        }
    };

    console.log({columns, },'dragEnd');

    return loading && columns ? (
        <Loading />
    ) : (
        <div className='flex flex-col gap-2'>
            <div className='flex'>
                <Button
                    type='primary'
                    style={{ backgroundColor: '#1677ff' }}
                    onClick={showModal}
                >
                    Add Task
                </Button>
                {/* modal create */}
                <Modal
                    title='Add Task'
                    open={modalCreateOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form form={form} layout='vertical' onFinish={handleCreateTask}>
                        <Form.Item
                            label='Title'
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Please input the title!',
                                },
                            ]}
                        >
                            <Input autoComplete='off' />
                        </Form.Item>
                        <Form.Item name='description' label='Description'>
                            <Input type='textarea' autoComplete='off' />
                        </Form.Item>
                        <Form.Item name='person' label='Person'>
                            <Input type='textarea' autoComplete='off' />
                        </Form.Item>
                        <Form.Item name='date' label='Date' rules={[
                            {
                                required: true,
                                message:
                                    'Please input the date range!',
                            },
                        ]}>
                            <RangePicker className='w-full' />
                        </Form.Item>

                        <div className='pt-6 flex gap-4 justify-end h-fit'>
                            <Form.Item>
                                <Button onClick={handleCancel} >Cancel</Button>
                            </Form.Item>
                            <Form.Item >
                                <Button type="primary" style={{ backgroundColor: '#1677ff' }} htmlType='submit'>Create</Button>
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
                {/* modal edit */}
                <Modal
                    title='Task'
                    open={modalEditOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form form={form} layout='vertical' onFinish={handleEditTask} >
                        <Form.Item
                            label='Title'
                            name='name'
                        >
                            <Input autoComplete='off' disabled={!editMode} />
                        </Form.Item>
                        <Form.Item name='description' label='Description'>
                            <Input autoComplete='off' disabled={!editMode} type='textarea' />
                        </Form.Item>
                        <Form.Item name='person' label='Person'>
                            <Input autoComplete='off' disabled={!editMode} />
                        </Form.Item>
                        <Form.Item name='date' label='Date'>
                            <RangePicker disabled={!editMode} className='w-full' />
                        </Form.Item>

                        <div className='pt-6 flex gap-4 justify-between h-fit'>
                            <div>
                                {!editMode && <Form.Item>
                                    <Button type='primary' danger onClick={() => { showDeleteConfirm(detailTask.id) }} >Delete</Button>
                                </Form.Item>}
                            </div>
                            <div className='flex gap-4'>
                                <Form.Item>
                                    <Button onClick={handleCancel} >Cancel</Button>
                                </Form.Item>
                                {!editMode && <Form.Item >
                                    <Button onClick={() => setEditMode(true)} >Edit</Button>
                                </Form.Item>}
                                {editMode && <Form.Item >
                                    <Button type="primary" style={{ backgroundColor: '#1677ff' }} htmlType='submit'>Submit</Button>
                                </Form.Item>}
                            </div>
                        </div>
                    </Form>
                </Modal>
            </div>
            <div className='flex overflow-auto gap-4'>
                <DragDropContext
                    onDragEnd={(result) =>
                        onDragEnd(result, columns, setColumns)
                    }
                >
                    {Object.entries(columns).map(
                        ([columnId, column], index) => {
                            return (
                                <div
                                    className='flex flex-col items-center'
                                    key={columnId}
                                >
                                    <div
                                        className={`w-full py-2 px-2`}
                                        style={{
                                            color: 'white',
                                            backgroundColor: boardCheck(
                                                column.name
                                            ),
                                        }}
                                    >
                                        {/* <div className='p-4 '> */}
                                        <h2>{column.name}</h2>
                                        {/* </div> */}
                                    </div>
                                    <div>
                                        <Droppable
                                            droppableId={columnId}
                                            key={columnId}
                                        >
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background:
                                                                snapshot.isDraggingOver
                                                                    ? '#ebecf0'
                                                                    : '#ebecf0',
                                                            width: 250,
                                                            height: '60vh',
                                                            overflow: 'auto'
                                                        }}
                                                        className='p-2'
                                                    >
                                                        {column.items.map(
                                                            (item, index) => {
                                                                // console.log('drag',item);
                                                                const {
                                                                    color,
                                                                    name,
                                                                    person,
                                                                } = item;
                                                                return (
                                                                    <Draggable
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        draggableId={
                                                                            item.id
                                                                        }
                                                                        index={
                                                                            index
                                                                        }
                                                                    >
                                                                        {(
                                                                            provided,
                                                                            snapshot
                                                                        ) => {
                                                                            return (
                                                                                <div
                                                                                    onClick={() => {
                                                                                        handleModalEdit(item)
                                                                                    }}
                                                                                    className={`flex rounded-md ${snapshot.isDragging
                                                                                            ? 'rotate-2'
                                                                                            : 'rotate-0'
                                                                                        }`}
                                                                                    ref={
                                                                                        provided.innerRef
                                                                                    }
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    style={{
                                                                                        userSelect:
                                                                                            'none',
                                                                                        padding: 16,
                                                                                        margin: '0 0 8px 0',
                                                                                        minHeight:
                                                                                            '50px',
                                                                                        backgroundColor:
                                                                                            snapshot.isDragging
                                                                                                ? color
                                                                                                : '#ffffff',
                                                                                        // transformBox:
                                                                                        //     snapshot.isDragging
                                                                                        //         ? 'rotate(12deg)'
                                                                                        //         : 'rotate(0deg)',
                                                                                        color: 'black',
                                                                                        ...provided
                                                                                            .draggableProps
                                                                                            .style,
                                                                                    }}
                                                                                >
                                                                                    <div className='flex flex-col'>
                                                                                        <p className='mb-2'>
                                                                                            {
                                                                                                name
                                                                                            }
                                                                                        </p>
                                                                                        {person && <div
                                                                                            className={`px-2 py-1 font-light text-xs rounded-md w-fit`}
                                                                                            style={{
                                                                                                backgroundColor:
                                                                                                    snapshot.isDragging ? 'white' : color,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                person
                                                                                            }
                                                                                        </div>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }}
                                                                    </Draggable>
                                                                );
                                                            }
                                                        )}
                                                        {provided.placeholder || (
                                                            <div />
                                                        )}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </DragDropContext>
            </div>
        </div>
    );
};

export default KanbanBoard;
