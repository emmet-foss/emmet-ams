import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  Avatar,
  Button,
  Calendar,
  Col,
  List,
  message,
  Row,
  Statistic,
} from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './List.css';

class AttendanceCalendar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  goToAttendanceDate = async (attendanceDate) => {
    const localeId = this.props.location.pathname.split('/')[2];
    this.props.history.push(`/locale_church/${localeId}/attendance?attendanceDate=${attendanceDate.format("YYYY-MM-DD")}`)
  };

  render() {
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Statistic value="Which date would you like to record an attendance?" />
              <Calendar
                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
                fullscreen={false}
                onSelect={this.goToAttendanceDate}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(AttendanceCalendar);
