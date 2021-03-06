import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Route, NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { Col, Icon, Layout, Menu, Row } from 'antd';
import ReactGA from 'react-ga';

import { Home, ReportsHome, MembersHome } from './dashboard';
import { AttendanceCalendar, AttendanceList, MembersList } from './list';
import {
  AttendanceForm, AttendanceConfirm, UpdateAttendanceForm,
  RegisterMember, CalendarForm 
} from './form';
import { MonthlyReport } from './reports';
import * as Reports from './reports/weekly';

import withTracker from '../helpers/withTracker';

import 'antd/dist/antd.css';
import './Wrapper.css';

ReactGA.initialize('UA-144836204-1');

const { Content, Footer, Header } = Layout;

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
      mode: '',
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
    let churchGroupId = localStorage.getItem('churchGroupId');
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Row type="flex" justify="center" align="middle">
              <Col
                xs={8} sm={8} md={8} lg={8}
                style={{display: 'none'}}
              >
                <Menu
                  theme="dark"
                  mode="horizontal"
                >
                  <Menu.Item
                    key="/"
                    style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}
                  >
                    <NavLink to="/">
                      <Icon type="left" /> Back
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col
                xs={8} sm={8} md={8} lg={8}
              >
                <Menu
                  theme="dark"
                  mode="horizontal"
                >
                  <Menu.Item
                    key="/"
                    style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}
                  >
                    <NavLink to="/">
                      <Icon type="home" />
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col
                xs={8} sm={8} md={8} lg={8}
                style={{display: 'none'}}
              >
                <Menu
                  theme="dark"
                  mode="horizontal"
                >
                  <Menu.Item
                    key="/"
                    style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}
                  >
                    <NavLink to="/">
                      Submit <Icon type="play-circle" />
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </Col>
            </Row>
          </Header>
          <Content style={{ padding: '0 50px', marginTop: 75 }}>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <div style={{ padding: 24, background: '#fff', minHeight: 320 }}>
                  <Route exact path="/" component={withTracker(Home)} />
                  <Route exact path="/reports" component={withTracker(ReportsHome)} />
                  <Route exact path="/reports/:groupId/weekly" component={withTracker(Reports.WeeklyReport)} />
                  <Route exact path="/reports/:groupId/monthly" component={withTracker(MonthlyReport)} />
                  <Route exact path="/church_groups/:groupId/calendar" component={withTracker(AttendanceCalendar)} />
                  <Route exact path="/church_groups/:groupId/calendar_form" component={withTracker(CalendarForm)} />
                  <Route exact path="/church_groups/:groupId/attendance_list" component={withTracker(AttendanceList)} />
                  <Route exact path="/church_groups/:groupId/attendance_details"
                    render={(props) =>
                      <UpdateAttendanceForm
                        {...props}
                        setMember={this.setMember} 
                        checkedMembers={this.state.checkedMembers}
                        clearMembers={this.clearMembers}
                        mode={"read-only"}
                      />
                    }
                  />
                  <Route exact path="/church_groups/:groupId/update_attendance"
                    render={(props) =>
                      <UpdateAttendanceForm
                        {...props}
                        setMember={this.setMember} 
                        checkedMembers={this.state.checkedMembers}
                        clearMembers={this.clearMembers}
                      />
                    }
                  />
                  <Route exact path="/church_groups/:groupId/attendance"
                    render={(props) =>
                      <AttendanceForm
                        {...props}
                        setMember={this.setMember} 
                        checkedMembers={this.state.checkedMembers}
                        clearMembers={this.clearMembers}
                      />
                    }
                  />
                  <Route exact path="/church_groups/:groupId/confirm_attendance"
                    render={(props) => 
                      <AttendanceConfirm {...props}
                        checkedMembers={this.state.checkedMembers}
                        clearMembers={this.clearMembers}
                      />
                    }
                  />
                  <Route exact path="/members" component={withTracker(MembersHome)} />
                  <Route exact path="/church_groups/:groupId/members" component={withTracker(MembersList)} />
                  <Route exact path="/church_groups/:groupId/members/new" component={withTracker(RegisterMember)} />
                </div>
              </Col>
            </Row>
          </Content>
          <Footer style={{ position: "sticky", bottom: "0" }}>
            <Row type="flex" justify="center">
                <Col xs={24} sm={24} md={24} lg={12}>
                <Menu
                  mode="horizontal"
                  style={{ lineHeight: '64px', display: 'flex', justifyContent: 'center' }}
                >
                  <Menu.Item
                    key="/"
                    style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <NavLink to="/">
                      <Icon type="home" />
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key={`/church_groups/${churchGroupId}/calendar`}
                    style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
                    disabled={!churchGroupId}>
                    <NavLink to={`/church_groups/${churchGroupId}/calendar_form`}>
                      <Icon type="calendar" />
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key="/reports"
                    style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <NavLink to="/reports">
                      <Icon type="table" />
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key={`/members`}
                    style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
                  >
                    <NavLink to={`/members`}>
                      <Icon type="user-add" />
                    </NavLink>
                  </Menu.Item>
                </Menu>
              </Col>
            </Row>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(AmsWrapper);
