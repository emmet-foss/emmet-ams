import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Calendar, Col, Row, Select } from 'antd';
import Animate from 'rc-animate';
import ReactGA from 'react-ga';

import 'antd/dist/antd.css';
import './List.css';

const Option = Select.Option;

class AttendanceCalendar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor() {
    super(...arguments);
    this.state = {
      selectedGathering: '',
    };
    [
      'handleSelectGathering',
    ].forEach((method) => this[method] = this[method].bind(this));
  }

  componentDidMount() {
    const churchGroupId = this.props.location.pathname.split('/')[2];
    localStorage.setItem('churchGroupId', churchGroupId);
  }

  goToAttendanceDate = async (attendanceDate) => {
    ReactGA.event({
      category: 'AttendanceCalendar',
      action: 'go to attendance date'
    });
    const churchGroupId = this.props.location.pathname.split('/')[2];
    const { selectedGathering } = this.state;
    this.props.history.push(`/church_groups/${churchGroupId}/attendance?attendanceDate=${attendanceDate.format("YYYY-MM-DD")}&gathering=${selectedGathering}`)
  };

  handleSelectGathering = (value) => {
    ReactGA.event({
      category: 'AttendanceCalendar',
      action: 'select report type'
    });
    this.setState({ selectedGathering: value })
  }

  render() {
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <h3>What type of gathering would you like to record an attendance?</h3>
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
            </Col>
          </Row>
          <Animate
            transitionName="fade"
            transitionAppear
          >
          {this.state.selectedGathering ? 
            <Row key="1" type="flex" justify="center">
              <Col key="2" xs={24} sm={24} md={24} lg={12}>
                <h3>On which date?</h3>
                  <Calendar
                    key="4" 
                    style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
                    fullscreen={false}
                    onSelect={this.goToAttendanceDate}
                  />
              </Col>
            </Row>
            : null
          }
          </Animate>
        </div>
      </div>
    );
  }
}

export default withRouter(AttendanceCalendar);
