'use client'
import React from 'react'
import Nestable from 'react-nestable';

const NestableComponent = (props) => {
    const {items, renderItem} = props;
  return (
    <div>
        <Nestable
            items={items}
            renderItem={({ item }) => <div style={{ padding: '10px', border: '1px solid #ccc' }}>{item.text}</div>}
            
          />
    </div>
  )
}

export default NestableComponent