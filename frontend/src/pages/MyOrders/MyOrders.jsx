import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';

const MyOrders = () => {

const {url, token} = useContext(StoreContext);
const [data, setData] = useState([]);

const fetchOrders = async () =>{
    const response = await axios.post(url+'/api/order/userorders',{},{headers:{token}})
    setData(response.data.data);
}

useEffect(()=>{
    if(token){
        fetchOrders();
    }
},[token])

  return (
    <div className='my-orders-page'>
        <h2 className="my-orders-page-title">My Orders</h2>
        <div className="my-orders-page-container">
            {data.map((order, index)=>{
                    return (
                        <div key={index} className="my-orders-page-order">
                            <img src={assets.parcel_icon} alt="" className="my-orders-page-order-icon" />
                            <p className="my-orders-page-order-items">{order.items.map((item, index)=>{
                                if(index === order.items.length-1){
                                    return item.name+" x "+item.quantity
                                }else{
                                    return item.name+" x "+item.quantity + ","
                                }
                            })}</p>
                            <p className="my-orders-page-order-amount">${order.amount}.00</p>
                            <p className="my-orders-page-order-count">Items: {order.items.length}</p>
                            <p className="my-orders-page-order-status"><span>&#x25cf;</span><b>{order.status}</b></p>
                            <button className="my-orders-page-track-button" onClick={fetchOrders}>Track Order</button>
                        </div>
                    )
            })}
        </div>
    </div>
  )
}

export default MyOrders