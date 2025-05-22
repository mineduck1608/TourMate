import React, { Suspense } from 'react'

export default function BidsDriver() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <Bids />
    </Suspense>
  )
}

function Bids(){
    return(
        <div>

        </div>
    )
}