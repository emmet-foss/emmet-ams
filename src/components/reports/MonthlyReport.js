import React, { Component } from 'react';
import {
  Col,
  List,
  PageHeader,
  Statistic,
  Row,
} from 'antd';
import * as qs from 'query-string';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Report.css';

class MonthlyReport extends Component {
  state = {
    result: [],
  };

  componentDidMount() {
    this.getMonthlyAttendance()
      .then(res => {
        console.log('res', res)
        this.setState({ result: res.result })
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMonthlyAttendance()
      .then(res => {
        this.setState({ result: res.result })
      })
      .catch(err => console.log(err));
    }
  }

  getMonthlyAttendance = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const { duration } = query;
    const response = await emmetAPI.getUrl(`/ams/attendance/${localeId}/monthly?duration=${duration}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleLocaleSelect = async (localeValue) => {
    ReactGA.event({
      category: 'Home',
      action: 'locale select'
    });
    this.setState({
      selectedLocale: localeValue
    });
  };

  render() {
    const {
      result,
    } = this.state;
    console.log('result', result)
    return (
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
              {(result && result.length === 0) ?
                <Statistic value="No members available in this locale." />
              :
                <div>
                  <Statistic value="Here's the attendance for the selected duration:" />
                  <List
                    itemLayout="horizontal"
                    bordered
                    size="large"
                    dataSource={result}
                    renderItem={item => (
                      <List.Item
                        key={item._id}
                      >
                        {item._id.attendanceDate.substr(0, 7)}, {item._id.gathering}, {item.count}
                      </List.Item>
                    )}
                  />
                </div>
              }
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default MonthlyReport;
