import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import { Avatar, Button, Col, Checkbox, Icon, List, Row, Spin } from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

class UpdateAttendanceForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      members: [],
      membersPresent: [],
      checkedMembers: [],
      loadingMembersPresent: false,
      loadingMembers: false,
    };
	}

  componentDidMount() {
    this.getAttendance()
      .then(res => this.setState({ membersPresent: res.members, loadingMembersPresent: false }))
      .catch(err => console.log(err));
    this.getMembers()
      .then(res => this.setState({ members: res.members, loadingMembers: false }))
      .catch(err => console.log(err));
    this.props.clearMembers();
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getAttendance()
        .then(res => this.setState({ membersPresent: res.members, loadingMembersPresent: false }))
        .catch(err => console.log(err));
      this.getMembers()
        .then(res => this.setState({ members: res.members, loadingMembers: false }))
        .catch(err => console.log(err));
      }
  }

  getAttendance = async () => {
    this.setState({ loadingMembersPresent: true });

    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gathering } = query
    const response = await emmetAPI.getUrl(`/ams/attendance?localeId=${localeId}&attendanceDate=${attendanceDate}&gathering=${gathering}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getMembers = async () => {
    this.setState({ loadingMembers: true });

    const localeId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleUpdateAttendance = async () => {
    ReactGA.event({
      category: 'Attendance',
      action: 'confirm attendance'
    });
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { attendanceDate, gatheringQuery } = query
    const gathering = gatheringQuery || this.state.selectedGathering
    this.props.history.push(`/locale_church/${localeId}/confirm_attendance?attendanceDate=${attendanceDate}&gathering=${gathering}`)
  };

  addMember = (e) => {
    console.log('e', e)
    const { memberId, memberName, checked } = e.target;
    const { membersPresent } = this.state;

    if (checked) {
      membersPresent.push({ memberId, memberName });
      this.setState({ membersPresent });
    } else {
      var filtered = membersPresent.filter(function(value, index, arr){
        return value.memberId !== memberId;
      });
      this.setState({ membersPresents: filtered });
    }
  }
  
  render() {
    const { members, loadingMembers, loadingMembersPresent, membersPresent } = this.state;
    const memberIds = membersPresent.map((member) => {
      return member._id;
    })
    if (loadingMembers || loadingMembersPresent) {
      return (
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12} style={{ textAlign: "center" }}>
                <Spin size="large" />
              </Col>
            </Row>
          </div>
        </div>
      );
    }
    return (
      <div className="wrap">
        <div className="extraContent">
        {(members && members.length === 0) ?
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
                <h2>No members present in the specified date and gathering.</h2>
            </Col>
          </Row>
        :
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <div>
                <h4>These were the members who were present:</h4>
                <List
                  itemLayout="horizontal"
                  bordered
                  size="large"
                  dataSource={members}
                  renderItem={item => (
                    <List.Item
                      key={item._id}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={item.name}
                      />
                      <Checkbox
                        memberId={item._id}
                        memberName={item.name}
                        onChange={this.addMember}
                        defaultChecked={memberIds.indexOf(item._id) >= 0}
                      />
                    </List.Item>
                  )}
                />
                <Button
                  block
                  type="primary"
                  onClick={this.handleUpdateAttendance}
                >
                  Confirm<Icon type="right"/>
                </Button>
              </div>
            </Col>
          </Row>
        }
        </div>
      </div>
    );
  }
}

export default withRouter(UpdateAttendanceForm);
