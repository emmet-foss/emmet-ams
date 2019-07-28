import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  Icon,
  PageHeader,
  Select,
  Statistic,
  Row,
} from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;

class ReportsHome extends Component {
  state = {
    stores: [],
    availableDates: [],
    selectedLocale: '',
    selectedReport: '',
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

  handleLocaleSelect = async (localeValue) => {
    this.setState({
      selectedLocale: localeValue
    });
  };

  handleReportSelect = async (reportValue) => {
    this.setState({
      selectedReport: reportValue
    });
  };

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
                      >
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="custom">Custom</Option>
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col xs={24} sm={24} md={24} lg={12}>
                <NavLink to={`/reports/${selectedLocale}?reportType=${selectedReport}`}>
                  <Button block type="primary">
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
