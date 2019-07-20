import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route } from 'react-router-dom';
import { withRouter } from "react-router";
import { Layout, Tabs, Menu } from 'antd';

import { KitchenStores, StoreCalendar } from './list';
import { Home } from './dashboard';
import SideMenu from './sidemenu/SideMenu';

import 'antd/dist/antd.css';
import './Wrapper.css';

const {
  Header, Content, Footer
} = Layout;
const { TabPane } = Tabs;

class Wrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route exact path="/" component={Home} />
              <Route exact path="/stores" component={KitchenStores} />
              <Route exact path="/stores/:storeId/orders" component={StoreCalendar} />
            </div>
          </Content>
          <Footer style={{ position: "sticky", bottom: "0" }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Wrapper);
