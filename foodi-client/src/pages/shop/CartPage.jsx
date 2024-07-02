import React, { useContext, useState }  from "react";
import useCart from '../../hooks/useCart';
import {FaTrash} from 'react-icons/fa';
import Swal from 'sweetalert2';
import { AuthContext } from "../../contexts/AuthProvider";



const CartPage = () => {

  const [cart, refetch] = useCart();
  const { user } = useContext(AuthContext);
  // console.log(user)
  const [cartItems, setcartItems] = useState([]);
  // console.log(cartItems)


  // Calculate the total price for each item in the cart
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };


  // handelIncrease function
  const handleIncrease = (item) => {
    // console.log(item._id);
    fetch(`http://localhost:6001/carts/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ quantity: item.quantity + 1 })
    })
    .then((res) => res.json())
    .then((data) => {

      const updatedCart = cartItems.map((cartItem) => {
        if(cartItem.id === item.id) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          };
        }

        return cartItem;
        
      });

      refetch();
      setcartItems(updatedCart);

    });

    refetch();

  } 


  // handeldecrease function
  const handleDecrease = (item) => {
    // console.log(item._id);
   
    if(item.quantity > 1) {
      fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({ quantity: item.quantity - 1 })
      })
      .then((res) => res.json())
      .then((data) => {
        const updatedCart = cartItems.map((cartItem) => {
          if(cartItem.id == item.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            };
          }
  
          return cartItem;
          
        });
  
        refetch();
        setcartItems(updatedCart);
  
      });
  
      refetch();
    }
    else {
      alert ("Item can't be zero.")
    }

  } 


  // Calculate the cart subtotal
  const cartSubtotal = cart.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0);

  // Calculate the order total
  const orderTotal = cartSubtotal;
  // console.log(orderTotal)


  //handledelete  item logic from cart
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes delete it !!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:6001/carts/${item._id}`, {
          method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
          if(data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title:"Deleted",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        });
      }
    });
  }




  return (
    <div className="section-container">
      {/*  texts  */}
      <div className="bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-36 flex flex-col  items-center justify-center gap-8">
          <div className="px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Items Added to the <span className="text-green">Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {/* table for the cart */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead className="bg-green">
              <tr>
                <th> S.No </th>
                <th>Food</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              
              {
                cart.map((item, index) => (
                  <tr key={index}>
                <td> {index + 1 } </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={item.image}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className='font-medium'>
                 {item.name}
                </td>

                <td>
                  <button className="btn btn-xs" onClick={() => handleDecrease(item)} > - </button>
                  <input
                      type="number"
                      value={item.quantity}
                      onChange={() => console.log(item.quantity)}
                      className="w-10 mx-2 text-center overflow-hidden appearance-none"
                  />
                  <button className="btn btn-xs" onClick={() => handleIncrease(item)} > + </button>
                </td>

                <td>${calculateTotalPrice(item).toFixed(2)}</td>

                <th>
                  <button className="btn btn-ghost text-red btn-xs" onClick={() => handleDelete(item) }>
                    <FaTrash />
                  </button>
                </th>
              </tr>
                ))
              }

            </tbody>            
          </table>
        </div>
      </div>

      {/* customer detail */}
      <hr></hr>
      <div className='my-12 flex flex-col md:flex-row justify-between items-start'>
        <div className='md:w-1/2 space-y-3 mb-8'>
          <h3 className='font-medium'>Customer Details</h3>
          <p className=''>Name: {user.displayName} </p>
          <p className=''>Email: {user.email} </p>
          <p className=''>User Id: {user.uid} </p>
        </div>
        <div className='md:w-1/2 space-y-3'>
          <h3 className='font-medium'>Shopping Details</h3>
          <p className=''>Total Items: {cart.length} </p>
          <p className=''>Total Price: ${orderTotal.toFixed(2)} </p>
          <button className='btn bg-green text-white'>Proceed Checkout</button>        
        </div>
      </div>
    </div>  
  );
};

export default CartPage;
