import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route, NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Button, Icon, Layout, Tabs, Menu } from 'antd';

import { KitchenStores, AttendanceCalendar } from './list';
import { Home } from './dashboard';

import 'antd/dist/antd.css';
import './Wrapper.css';

const {
  Header, Content, Footer
} = Layout;
const { TabPane } = Tabs;

class AmsWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    // TODO: Get locale id if already inputted before
    const localeId = "5d326baccda40403d8b7168c";
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route exact path="/" component={Home} />
              <Route exact path="/calendar" component={AttendanceCalendar} />
              <Route exact path="/locale_church/:localeId/calendar" component={AttendanceCalendar} />
            </div>
          </Content>
          <Footer style={{ position: "sticky", bottom: "0" }}>
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px'}}
            >
              <Menu.Item key="/">
                <NavLink to="/">
                  <Icon type="home" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key={`/locale_church/${localeId}/calendar`}>
                <NavLink to={`/locale_church/${localeId}/calendar`}>
                  <Icon type="calendar" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/report">
                <NavLink to="/report">
                  <Icon type="audit" />
                </NavLink>
              </Menu.Item>
            </Menu>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(AmsWrapper);
