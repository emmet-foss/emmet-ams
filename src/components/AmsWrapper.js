import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route, NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Icon, Layout, Menu } from 'antd';

import { Home, ReportsHome } from './dashboard';
import { AttendanceCalendar } from './list';
import { AttendanceForm, ReportForm } from './form';

import 'antd/dist/antd.css';
import './Wrapper.css';

const {
  Content, Footer
} = Layout;

class AmsWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    // TODO: Get locale id if already inputted before
    let localeId = localStorage.getItem('localeId');
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route exact path="/" component={Home} />
              <Route exact path="/reports" component={ReportsHome} />
              <Route exact path="/calendar" component={AttendanceCalendar} />
              <Route exact path="/locale_church/:localeId/calendar" component={AttendanceCalendar} />
              <Route exact path="/locale_church/:localeId/attendance" component={AttendanceForm} />
              <Route exact path="/reports/:localeId" component={ReportForm} />
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
              <Menu.Item key={`/locale_church/${localeId}/calendar`}
                disabled={!localeId}>
                <NavLink to={`/locale_church/${localeId}/calendar`}>
                  <Icon type="calendar" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/reports">
                <NavLink to="/reports">
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