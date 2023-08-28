'use client';
import KanbanBoard from '@/components/KanbanBoard'
import dynamic from 'next/dynamic';
import Image from 'next/image'

export default function Home() {
  const DynamicKanbanBoard = dynamic(() => import('../components/KanbanBoard'), {
    ssr: false, // Disable server-side rendering for this component
  });

  return (
    <>
      <div className='w-full flex flex-col'>
        <h1>Kanban</h1>
        <div className='pt-4' id='kanban-'>
          <DynamicKanbanBoard />
        </div>
      </div>
    </>
  )
}
