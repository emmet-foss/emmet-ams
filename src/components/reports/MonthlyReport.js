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
    period: "",
    localeInfo: "",
  };

  componentDidMount() {
    this.getMonthlyAttendance()
      .then(res => {
        this.setState({ result: res.result })
      })
      .catch(err => console.log(err));  

    this.getLocaleInfo()
      .then(res => {
        this.setState({ localeInfo: res.locale })
      })
      .catch(err => console.log(err));  

    const query = qs.parse(this.props.location.search);
    this.setState( { period: query.period } );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getMonthlyAttendance()
        .then(res => {
          this.setState({ result: res.result })
        })
        .catch(err => console.log(err));

      this.getLocaleInfo()
        .then(res => {
          this.setState({ localeInfo: res.locale })
        })
        .catch(err => console.log(err));  
  
      const query = qs.parse(this.props.location.search);
      this.setState( { period: query.period } );
    }
  }

  getMonthlyAttendance = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const query = qs.parse(this.props.location.search);
    const response = await emmetAPI.getUrl(`/ams/attendance/${localeId}/monthly?period=${query.period}`)
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getLocaleInfo = async () => {
    const localeId = this.props.location.pathname.split('/')[2];
    const response = await emmetAPI.getUrl(`/ams/locale_churches/${localeId}`)
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
      period,
      localeInfo,
    } = this.state;
    return (
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
              {(result && result.length === 0) ?
                <Statistic value={`No ${localeInfo.name} attendance available for ${period}.`} />
              :
                <div>
                  <Statistic value={"Here's the attendance for"} />
                  <Statistic value={`${localeInfo.name}, ${period}:`} />
                  <List
                    itemLayout="horizontal"
                    bordered
                    size="large"
                    dataSource={result}
                    renderItem={item => (
                      <List.Item
                        key={item._id}
                      >
                        {item._id.attendanceDate.substr(0,10)}, {item._id.gathering}, {item.count}
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
