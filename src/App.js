import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import Products from './components/products';
import Orders from './components/orders';
import AddProduct from './components/addProduct';
import Warehouse from './components/warehouse';
import './App.css';

function App() {

  const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Products',
  },
  {
    key: '2',
    icon: <DesktopOutlined />,
    label: 'Orders',
  },
  {
    key: '4',
    icon: <DesktopOutlined />,
    label: 'Warehouse',
  },
];

  const [collapsed, setCollapsed] = useState(false);
  const [menuItem, setMenuItem] = useState('1');
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (v) => {
    setMenuItem(v.key);
  }

  const pageMap = {
    '1': <Products setMenuItem={setMenuItem} />,
    '2': <Orders />,
    '3': <AddProduct />,
    '4': <Warehouse />,
  }

  const pathMap = {
    '1': 'Products',
    '2': 'Orders',
    '3': 'Add Prodcut',
    '4': 'Warehouse',
  }

  console.log("aaaaaaaaaa");

  return (
    <Layout
    style={{
      minHeight: '100vh',
    }}
  >
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={(v) => handleMenuClick(v)}/>
    </Sider>
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      />
      <Content
        style={{
          margin: '0 16px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Seller</Breadcrumb.Item>
          <Breadcrumb.Item>{pathMap[menuItem]}</Breadcrumb.Item>
        </Breadcrumb>
        {
          pageMap[menuItem]
        }
       
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  </Layout>
  );
}

export default App;
