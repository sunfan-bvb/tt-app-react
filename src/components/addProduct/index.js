import React, { useEffect, useState } from "react";
import { Card, Input, Upload, Cascader, Select, Col, Row, Button, Spin, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from "axios";

const AddProduct = () => {

    const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [category, setCategory] = useState([{label: '加载中...', value: ''}]);
    const [brand, setBrand] = useState([{label: '加载中...', value: ''}]);
    const [attributes, setAttributes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { TextArea } = Input;
    const { Option } = Select;

    const parentMap = {};

    const buildTree = (parentNode) => {
        if (parentNode instanceof Array) {
            parentNode.forEach(item => {
                if (parentMap?.[item.id]) {
                    item.children = parentMap[item.id];
                    buildTree(item.children);
                }
            })
        }
    }

    useEffect(() => {
        axios.get('http://localhost:8000/categories').then(r => {
            r.data.data.categories.forEach(item => {
                const { id, parent_id, local_name, ...rest } = item;
                if (!parentMap[parent_id]) {
                    parentMap[parent_id] = [];
                }
                const newItem = { label: local_name, value: id, id, ...rest };
                if (!parentMap[parent_id].some(v => v.id === newItem.id)) {
                    parentMap[parent_id].push(newItem);
                }
            });
            console.log(parentMap)
            const root = parentMap[0];
            buildTree(root);
            setCategory(root);
        })
        axios.get('http://localhost:8000/brands').then(r => {
            setBrand(r.data.data.brand_list.map(v => {return {label: v.name, value: v.name, id: v.id}}));
        })
        
    }, [])

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const uploadButton = (
        <div>
        <PlusOutlined />
        <div
            style={{
            marginTop: 8,
            }}
        >
            Upload
        </div>
        </div>
    );

    const onCategoryChange = (v) => {
        if (!v) {
            setAttributes([]);
            return;
        }
        setIsLoading(true);
        axios.get('http://localhost:8000/attributes?id='+v[v?.length - 1]).then(res => {
            console.log(res.data.data)
            setAttributes(res.data.data.attributes);
            setIsLoading(false);
        })
    }

  return (
    <>
        <div style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 101, display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
            <Spin/>
        </div>
        <Button type="primary" style={{position: 'fixed', top: '20px', right: '30px', zIndex: 100}}>Submit</Button>
       <Card title="Base Information" >
        <div style={{marginBottom: '10px'}}><b>Product Image</b></div>
        <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
        >
            {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <div style={{marginTop: '15px'}}><b>Product Name</b></div>
        <div style={{color: 'gray', fontSize: 'small', marginBottom: '5px'}}>Recommended length: 40 characters or more. The category will be automatically identified by the product name.</div>
        <Input placeholder="[Brand] + [Content] + [Scope of application] + [Product type] + [Main function/Feature]" />
        <div style={{marginTop: '15px'}}><b>Category</b></div>
        <div style={{color: 'gray', fontSize: 'small', marginBottom: '5px'}}>Listings for products that are miscategorized, prohibited, or restricted may be removed. Your seller account may also be affected.</div>
        <Cascader options={category} placeholder="Please select" onChange={(v) => onCategoryChange(v)} />
        <div style={{marginTop: '15px'}}><b>Brand</b></div>
        <div style={{color: 'gray', fontSize: 'small', marginBottom: '5px'}}>Products with brand authorization are more likely to be recommended on TikTok Shop. Apply for the brand authorization if your product is qualified.</div>
        <Select options={brand} style={{width: 200}} />
        <div style={{marginTop: '15px'}}><b>Product Atrributes</b></div>
            <div style={{ backgroundColor: 'rgb(245, 245, 245)', padding: '15px', borderRadius: '5px'}}>
                <Row gutter={16}>
                {
                    attributes?.map(item => {
                        return (
                            <Col span={8}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div>{item.name}</div>
                                    {item.values ? 
                                        <div><Select style={{ width: '100%' }} options={item.values.map(v => {return {value: v.name, label: v.name}})}/></div> :
                                        <div><Input /></div>
                                    }
                                </div>
                            </Col>
                        )
                    })
                }
                </Row>
            </div>
      </Card>
      <Card title="Product Details" style={{marginTop: '20px'}}>
        <div><b>Product description</b></div>
        <div style={{color: 'gray', fontSize: 'small', marginBottom: '5px'}}>Recommended to provide a description of at least 500 characters long and add images to help customers make purchasing decisions.</div>
        <TextArea rows={5} />
      </Card>
      <Card title="Sales Information" style={{marginTop: '20px'}}>
        <div style={{marginBottom: '15px'}}><b>Price & Stock</b></div>
        <Row gutter={16}>
            <Col span={6}>
                <Card title={<div style={{fontSize: 'small'}}>Product identifier code</div>}>
                <Input.Group compact>
                    <Select defaultValue="GTIN" style={{width: 100}}>
                        <Option value="GTIN">GTIN</Option>
                        <Option value="EAN">EAN</Option>
                        <Option value="UPC">UPC</Option>
                        <Option value="ISBN">ISBN</Option>
                    </Select>
                    <Input style={{width: '50%'}} />
                </Input.Group>
                </Card>
            </Col>
            <Col span={6}>
                <Card title={<div style={{fontSize: 'small'}}>Retail price</div>}>
                    <Input addonBefore="$"/>
                </Card>
            </Col>
            <Col span={6}>
                <Card title={<div style={{fontSize: 'small'}}>Quantity</div>}>
                    <Input />
                </Card>
            </Col>
            <Col span={6}>
                <Card title={<div style={{fontSize: 'small'}}>Seller SKU</div>}>
                    <Input />
                </Card>
            </Col>
        </Row>
      </Card>
      <Card title='Shipping' style={{marginTop: '20px'}}>
        <div style={{marginBottom: '5px'}}><b>Weight with Package</b></div>
        <Input.Group compact>
            <Select defaultValue="Pound(lb)" style={{width: 150}}>
                <Option value="Pound(lb)">Pound(lb)</Option>
                <Option value="Ounce(oz)">Ounce(oz)</Option>
                <Option value="Grams(g)">Grams(g)</Option>
                <Option value="Kilograms(kg)">Kilograms(kg)</Option>
            </Select>
            <Input
                style={{
                width: '40%',
                }}
                placeholder="Enter the product weight"
            />
        </Input.Group>
        <div style={{marginTop: '15px', marginBottom: '5px'}}><b>Weight with Package</b></div>
        <div style={{color: 'gray', fontSize: 'small', marginBottom: '5px'}}>Ensure the box weight and dimensions are accurate as they will be used to calculate the shipping fees and shipping method.</div>
        <Row gutter={16}>
            <Col span={8}>
                <Input suffix='inch' placeholder="Height" />
            </Col>
            <Col span={8}>
                <Input suffix='inch' placeholder="Width" />
            </Col>
            <Col span={8}>
                <Input suffix='inch' placeholder="Length" />
            </Col>
        </Row>
      </Card>
    </>
  )
}

export default AddProduct;