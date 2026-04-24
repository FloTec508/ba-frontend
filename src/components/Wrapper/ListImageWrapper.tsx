import React from 'react'

const ListImageWrapper = ({children} : {children:React.ReactNode}) => {
  return (
    <div className={`mr-3 min-w-12 w-12 relative`}>
        {children}
    </div>
  )
}

export default ListImageWrapper