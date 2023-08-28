'use client';
import {
  ProjectOutlined,
  NodeExpandOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import NavLink from './nav-link';
import 'antd/dist/reset.css';
import './globals.css';
import { Inter } from 'next/font/google';

const { Sider, Content, Footer } = Layout;

import { Typography } from 'antd';
import { HeaderComponent } from '../components/Header';

const { Link } = Typography;
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {

  return (
    <html>
      <head />
      <body className={inter.className}>
        <Layout>
          <Sider
              style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              mode="inline"
              style={{ marginTop: '3rem' }}
              className='p-3'
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <ProjectOutlined />,
                  label: <NavLink href="/">Kanban</NavLink>,
                }, 
                {
                  key: '2',
                  icon: <NodeExpandOutlined />,
                  label: <NavLink href="/list">List Task</NavLink>,
                }, 
                {
                  key: '3',
                  icon: <ProjectOutlined rotate={-90} />,
                  label: <NavLink href="/gantt-chart">Gantt Chart</NavLink>,
                },
              ]}
            />
          </Sider>
          <Layout className="site-layout" style={{marginLeft: 200}}>
            <HeaderComponent />
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                overflow: 'initial'
              }}
              className='bg-white rounded-lg min-h-screen'
            >
              {children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              {/* Made with {<HeartTwoTone twoToneColor="#993399" />}  */}
              by{' '}
              <Link href="/" target="_blank">
                Arta
              </Link>
            </Footer>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
