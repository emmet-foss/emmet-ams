import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route, NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Icon, Layout, Menu } from 'antd';
import ReactGA from 'react-ga';

import { Home, ReportsHome } from './dashboard';
import { AttendanceCalendar } from './list';
import { AttendanceForm, AttendanceConfirm, RegisterMember, ReportForm } from './form';
import { MonthlyReport } from './reports';
import * as Reports from './reports/weekly';

import withTracker from '../helpers/withTracker';

import 'antd/dist/antd.css';
import './Wrapper.css';

ReactGA.initialize('UA-144836204-1');

const {
  Content, Footer
} = Layout;

class AmsWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor() {
		super();
		this.state = {
      checkedMembers: [],
    };
    this.setMember = this.setMember.bind(this);
    this.clearMembers = this.clearMembers.bind(this);
	}

  setMember = (e) => {
    const { checkedMembers } = this.state;
    const { memberId, memberName, checked } = e.target;

    if (checked) {
      checkedMembers.push({ memberId, memberName });
      this.setState({ checkedMembers });
    } else {
      var filtered = checkedMembers.filter(function(value, index, arr){
        return value.memberId !== memberId;
      });
      this.setState({ checkedMembers: filtered });
    }
  }

  clearMembers = () => {
    this.setState({ checkedMembers: [] });
  }

  render() {
    let localeId = localStorage.getItem('localeId');
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Route exact path="/" component={withTracker(Home)} />
              <Route exact path="/reports" component={withTracker(ReportsHome)} />
              <Route exact path="/reports/:localeId/weekly" component={withTracker(Reports.WeeklyReport)} />
              <Route exact path="/reports/:localeId/monthly" component={withTracker(MonthlyReport)} />
              <Route exact path="/calendar" component={withTracker(AttendanceCalendar)} />
              <Route exact path="/locale_church/:localeId/calendar" component={withTracker(AttendanceCalendar)} />
              <Route exact path="/locale_church/:localeId/attendance"
                render={(props) =>
                  <AttendanceForm
                    {...props}
                    setMember={this.setMember} 
                    checkedMembers={this.state.checkedMembers}
                    clearMembers={this.clearMembers}
                  />
                }
              />
              <Route exact path="/locale_church/:localeId/confirm_attendance"
                render={(props) => 
                  <AttendanceConfirm {...props}
                    checkedMembers={this.state.checkedMembers}
                    clearMembers={this.clearMembers}
                  />
                }
              />
              <Route exact path="/members" component={withTracker(RegisterMember)} />
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
                  <Icon type="table" />
                </NavLink>
              </Menu.Item>
              <Menu.Item key={`/members`}>
                <NavLink to={`/members`}>
                  <Icon type="user-add" />
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
