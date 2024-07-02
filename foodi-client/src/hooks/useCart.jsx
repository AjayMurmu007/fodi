import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import { useQuery } from '@tanstack/react-query';

const useCart = () => {

    const { user } = useContext(AuthContext);

    const {refetch, data:cart = [] } = useQuery({
        queryKey: ['carts', user?.email],
        queryFn: async () => {
            const res = await fetch(`http://localhost:6001/carts?email=${user?.email}`)
            if (!res.ok) {
            throw new Error('Network response was not ok')
            }
            return res.json()
        },
    });

  return [cart, refetch]
}

export default useCart
