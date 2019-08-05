import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import * as qs from 'query-string';
import {
  Avatar, Button, Col, Checkbox, Icon,
  List, Row, Select, Statistic,
} from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './CreateForm.css';

const Option = Select.Option;

class AttendanceForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
		super(props);
		this.state = {
      members: [],
      checkedMembers: [],
      name: '',
      location: '',
      responseToPost: '',
      selectedGathering: '',
      collapsed: false,
      loading: false,
    };
	}

  componentDidMount() {
    this.getMembers()
      .then(res => this.setState({ members: res.members }))
      .catch(err => console.log(err));
    this.props.clearMembers();
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMembers()
        .then(res => this.setState({ members: res.members }))
        .catch(err => console.log(err));
    }
  }

  getMembers = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleConfirmAttendance = async () => {
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

  handleSelectGathering = (value) => {
    ReactGA.event({
      category: 'AttendanceCalendar',
      action: 'select gathering type'
    });
    this.setState({ selectedGathering: value })
  }

  render() {
    const { members, selectedGathering } = this.state;
    const query = qs.parse(this.props.location.search);
    const { gathering } = query

    return (
      <div className="wrap">
        <div className="extraContent">
        {(members && members.length === 0) ?
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
                <Statistic value="No members available in this locale." />
            </Col>
          </Row>
        :
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Statistic value="What type of gathering would you like to record an attendance?" />
              {!gathering &&
                <Select
                    showSearch
                    placeholder="Select a gathering"
                    dropdownMatchSelectWidth={false}
                    style={{ width: 240 }}
                    onChange={this.handleSelectGathering}
                  >
                    <Option value="prc">Practice</Option>
                    <Option value="pm">Prayer Meeting</Option>
                    <Option value="ws">Worship Service</Option>
                    <Option value="pbb">Thanksgiving</Option>
                    <Option value="spbb">Special Thanksgiving</Option>
                    <Option value="wbe">Worldwide Bible Exposition</Option>
                    <Option value="bap">Baptism</Option>
                    <Option value="doc">Indoctrination</Option>
                </Select>
              }
              {(gathering || selectedGathering) &&
                <div>
                  <Statistic value="Please select the members who were present:" />
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
                        <Checkbox memberId={item._id} memberName={item.name} onChange={this.props.setMember}/>
                      </List.Item>
                    )}
                  />
                  <Button
                    block
                    type="primary"
                    onClick={this.handleConfirmAttendance}
                    disabled={this.props.checkedMembers.length <= 0}
                  >
                    Confirm<Icon type="right"/>
                  </Button>
                </div>
              }
            </Col>
          </Row>
        }
        </div>
      </div>
    );
  }
}

export default withRouter(AttendanceForm);
