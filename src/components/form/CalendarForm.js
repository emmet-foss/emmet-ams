import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Calendar, Col, Row } from 'antd';
import ReactGA from 'react-ga';

import 'antd/dist/antd.css';
import './CreateForm.css';

class CalendarForm extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  goToAttendanceList = async (attendanceDate) => {
    ReactGA.event({
      category: 'attendance calendar',
      action: 'go to attendance date'
    });
    const localeId = this.props.location.pathname.split('/')[2];
    this.props.history.push(`/locale_church/${localeId}/attendance_list?attendanceDate=${attendanceDate.format("YYYY-MM-DD")}`)
  };

  render() {
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row key="1" type="flex" justify="center">
            <Col key="2" xs={24} sm={24} md={24} lg={12}>
              <h3>On which date would you like to submit an attendance?</h3>
              <Calendar
                key="4" 
                style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}
                fullscreen={false}
                onSelect={this.goToAttendanceList}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(CalendarForm);
