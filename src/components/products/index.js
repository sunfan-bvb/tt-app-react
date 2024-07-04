import React, { useEffect, useRef, useState } from "react";
import { Space, Table, Tag, Drawer, Carousel, Button, Spin } from 'antd';
// import api from '../../api';
import axios from "axios";

const Products = (props) => {

  const {setMenuItem} = props;

  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);

  const handleDetail = (record) => {
    setOpen(true);
    axios.get('http://localhost:8000/product?id=' + record?.id).then(res => {
      setProduct(res.data.data || {});
    })
  }
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Sale Regions',
      dataIndex: 'sale_regions',
      key: 'sale_regions',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Available Stock',
      dataIndex: 'available_stock',
      key: 'available_stock',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <>
            <Tag color={status === 3 ? 'red' : 'green'} key={status}>
              {status === 3 ? "Failed" : "Live"}
            </Tag>
        </>
      ),
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

  const onClose = () => {
    setOpen(false);
    setProduct(null);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/products').then(res => {
          const d = res?.data?.data?.products?.map((item, index) => {
            return {
              key: index,
              id: item.id,
              name: item.name,
              sale_regions: item.sale_regions.join(", "),
              price: item.skus?.[0]?.price?.original_price + item.skus?.[0]?.price?.currency,
              available_stock: item.skus?.[0]?.stock_infos?.[0]?.available_stock,
              status: item.status,
            }
          })
          setData(d || []);
      })
  }, [])

  return (
    <>
      <Button type="primary" style={{float: 'right', marginBottom: '10px'}} onClick={() => setMenuItem('3')}>Add Product</Button>
      <Table columns={columns} dataSource={data} loading={data === null}/>
      <Drawer title="Product Details" placement="right" onClose={onClose} open={open}>
        {
          product === null ?
            <Spin/> :
            <div>
              <h3>{product?.title}</h3>
              <div style={{color: "gray", fontSize: 'small', marginBottom: '10px'}}>ID: {product?.id}</div>
              <div style={{marginBottom: '10px', display: "flex", flexDirection: 'row'}}>
                {product?.category_chains?.map(item => <Tag>{item.local_name}</Tag>)}
              </div>
              <div dangerouslySetInnerHTML={{ __html: product?.description }} />
              <Carousel autoplay>
                {product?.main_images?.map(item => <div><img width={320} src={item?.thumb_urls?.[0] || item?.thumb_urls?.[1]}/></div>)}
              </Carousel>
              <div style={{ marginTop: '10px'}}>
                <div style={{ marginBottom: '5px'}}><b>Product Attributes</b></div>
                <div style={{ lineHeight: '30px'}}>
                  {product?.product_attributes?.map(item => <Tag color="green">{item?.name}</Tag>)}
                </div>
              </div>
              <div style={{ marginTop: '10px'}}>
                <b>Package Dimensions</b>
                <div>height: {product?.package_dimensions?.height} {product?.package_dimensions?.unit} </div>
                <div>width: {product?.package_dimensions?.width} {product?.package_dimensions?.unit} </div>
                <div>length: {product?.package_dimensions?.length} {product?.package_dimensions?.unit} </div>
              </div>
              <div style={{ marginTop: '10px'}}>
                <b>Package Weight</b>
                <div>{product?.package_weight?.value} {product?.package_weight?.unit} </div>
              </div>
              <div style={{ marginTop: '10px'}}>
                <b>Inventory</b>
                <div>quantity: {product?.skus?.[0]?.inventory?.[0]?.quantity} </div>
                <div>warehouse id: {product?.skus?.[0]?.inventory?.[0]?.warehouse_id} </div>
              </div>
            </div>
        }
      </Drawer>
    </>
  )
}

export default Products;