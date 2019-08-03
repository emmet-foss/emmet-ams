import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button, Col, DatePicker, Form, Icon,
  PageHeader, Select, Statistic, Row,
} from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class ReportsHome extends Component {
  state = {
    members: [],
    selectedLocale: '',
    selectedReport: 'monthly',
    period: '',
  };

  componentDidMount() {
    this.getChurchLocales()
      .then(res => {
        this.setState({ churchLocales: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');
        if (storedLocaleId) {
          this.setState({ selectedLocale: storedLocaleId })
        }
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchLocales()
      .then(res => {
        this.setState({ churchLocales: res.locales })
        let storedLocaleId = localStorage.getItem('localeId');
        if (storedLocaleId) {
          this.setState({ selectedLocale: storedLocaleId })
        }
      })
      .catch(err => console.log(err));
    }
  }

  getChurchLocales = async () => {
    const response = await emmetAPI.getUrl('/ams/locale_churches')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getMembers = async (localeId) => {
    const response = await emmetAPI.getUrl(`/ams/report/${localeId}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleLocaleSelect = async (localeValue) => {
    ReactGA.event({
      category: 'Report',
      action: 'locale select'
    });
    this.setState({
      selectedLocale: localeValue
    });

    this.getMembers(localeValue)
      .then(res => this.setState({ members: res.members }))
      .catch(err => console.log(err));
  };

  handleReportSelect = async (reportValue) => {
    ReactGA.event({
      category: 'Report',
      action: 'report select'
    });
    this.setState({
      selectedReport: reportValue
    });
  };

  onChange = async (date, dateString) => {
    this.setState({ period: dateString})
    console.log(date, dateString);
  }

  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    const {
      churchLocales,
      selectedLocale,
      selectedReport,
      period,
    } = this.state;

    return (
      <PageHeader>
        <div className="wrap">
          <div className="extraContent">
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Statistic value="Please select the report you would like to generate." />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form {...formItemLayout}>
                  <Form.Item label="Locale">
                    <Select
                        showSearch
                        placeholder="Select a locale"
                        dropdownMatchSelectWidth={false}
                        onChange={this.handleLocaleSelect}
                        value={selectedLocale}
                      >
                        {churchLocales && churchLocales.map(locale => {
                          return <Option key={locale._id} value={locale._id}>{locale.name}</Option>
                        })}
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <Form {...formItemLayout}>
                  <Form.Item label="Report">
                    <Select
                        showSearch
                        placeholder="Select a report"
                        dropdownMatchSelectWidth={false}
                        onChange={this.handleReportSelect}
                        value={"monthly"}
                      >
                        <Option value="monthly">Monthly</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            { selectedReport &&
              <Row type="flex" justify="center">
                <Col xs={24} sm={24} md={24} lg={12}>
                  <Form {...formItemLayout}>
                    <Form.Item label="Period">
                      { selectedReport === "weekly" && 
                        <WeekPicker onChange={this.onChange} placeholder="Select week" />
                      }
                      { selectedReport === "monthly" && 
                        <MonthPicker onChange={this.onChange} placeholder="Select month" />
                      }
                      { selectedReport === "custom" && 
                        <RangePicker onChange={this.onChange} />
                      }
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            }
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <NavLink to={`/reports/${selectedLocale}/${selectedReport}?period=${period}`}>
                  <Button
                    block
                    type="primary"
                    disabled={ !selectedReport || !period }
                  >
                    Next<Icon type="right"/>
                  </Button>
                </NavLink>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default ReportsHome;
