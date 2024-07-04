import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Drawer, Spin } from 'antd';
import axios from "axios";

const Orders = () => {

    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState(null);

    const handleDetail = (record) => {
        setOpen(true);
        axios.get('http://localhost:8000/order?id=' + record?.id).then(res => {
            setOrder(res.data.data?.orders?.[0] || {});
        })
    }
  
    const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Buyer',
          dataIndex: 'buyer',
          key: 'buyer',
        },
        {
          title: 'Items',
          dataIndex: 'items',
          key: 'items',
        },
        {
          title: 'Order Status',
          dataIndex: 'order_status',
          key: 'order_status',
        },
        {
          title: 'Shipping method',
          dataIndex: 'shipping_method',
          key: 'shipping_method',
        },
        {
            title: 'Delivery option',
            dataIndex: 'delivery_option',
            key: 'delivery_option',
          },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <a onClick={() => handleDetail(record)}>Detail</a>
              </Space>
            ),
          },
      ];

      useEffect(() => {
        axios.get('http://localhost:8000/orders').then(res => {
              const d = res?.data?.data?.orders?.map((item, index) => {
                return {
                  key: index,
                  id: item?.id,
                  buyer: item?.buyer_email,
                  items: item?.line_items.map(v => v.product_name).join(", "),
                  order_status: item?.status,
                  shipping_method: item?.shipping_type + " / " + item?.shipping_provider,
                  delivery_option: item?.delivery_option_name,
                  total: item?.payment?.original_total_product_price,
                }
              })
              setData(d || []);
          })
      }, [])

      const onClose = () => {
        setOpen(false);
        setOrder(null);
      };

      return (
        <>
          <Table columns={columns} dataSource={data} loading={data === null} />
          <Drawer title="Order Details" placement="right" onClose={onClose} open={open} width={400}>
            {order === null ?
                <Spin/> :
                <div>
                    <span style={{marginRight: '5px'}}><b>Status</b></span>
                    <Tag color={order?.status === "CANCELLED" ? "" : "green"}>{order?.status}</Tag>
                    <div style={{marginTop: '10px'}}><b>Buyer Email</b></div>
                    <div>{order?.buyer_email}</div>
                    <div style={{marginTop: '10px'}}><b>Items</b></div>
                    {
                        order?.line_items.map(v => <>
                            <div>package id: {v.package_id}</div>
                            <div>package status: {v.pacakge_status}</div>
                            <div>product name: {v.product_name}</div>
                            <div>sale price: {v.sale_price}</div>
                            <div>item tax: {v.item_tax[0].tax_amount}</div>
                            <div>shipping provider name: {v.shipping_provider_name}</div>
                            <div>shipping provider id: {v.shipping_provider_id}</div>
                            <div>image:<div><img src={v.sku_image} width={200}/></div> </div>
                            <br/>
                        </>)
                    }
                    <div style={{marginTop: '10px'}}><b>Payment</b></div>
                    <div>original total product price: {order?.payment.original_total_product_price}</div>
                    <div>original shipping fee: {order?.payment.original_shipping_fee}</div>
                    <div>product tax: {order?.payment.product_tax}</div>
                    <div>total amount: {order?.payment.total_amount}</div>
                    <div style={{marginTop: '10px'}}><b>Recipient Address</b></div>
                    <div>full address: {order?.recipient_address.full_address}</div>
                    <div>name: {order?.recipient_address.name}</div>
                    <div>phone number: {order?.recipient_address.phone_number}</div>
                    <div>postal code: {order?.recipient_address.postal_code}</div>
                    <div style={{marginTop: '10px'}}><b>Warehouse Id</b></div>
                    <div>{order?.warehouse_id}</div>
                </div>   
            }
          </Drawer>
        </>
      )
    
}

export default Orders;