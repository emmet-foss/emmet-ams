import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Col, DatePicker, Form, Icon, Select, Row } from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class ReportsHome extends Component {
  state = {
    members: [],
    selectedGroup: '',
    selectedReport: 'monthly',
    period: '',
  };

  componentDidMount() {
    this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.church_groups })
        let storedId = localStorage.getItem('churchGroupId');
        if (storedId) {
          this.setState({ selectedGroup: storedId })
        }
      })
      .catch(err => console.log(err));  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchGroups()
      .then(res => {
        this.setState({ churchGroups: res.church_groups })
        let storedId = localStorage.getItem('churchGroupId');
        if (storedId) {
          this.setState({ selectedGroup: storedId })
        }
      })
      .catch(err => console.log(err));
    }
  }

  getChurchGroups = async () => {
    const response = await emmetAPI.getUrl('/ams/church_groups?ministryName=music%20ministry')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getMembers = async (id) => {
    const response = await emmetAPI.getUrl(`/ams/report/${id}/members`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSelect = async (value) => {
    ReactGA.event({
      category: 'Report',
      action: 'church group select'
    });
    this.setState({ selectedGroup: value });

    this.getMembers(value)
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
      churchGroups,
      selectedGroup,
      selectedReport,
      period,
    } = this.state;

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <h2>Please select the report you would like to generate.</h2>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Form {...formItemLayout}>
                <Form.Item label="Locale Choir:">
                  <Select
                      showSearch
                      placeholder="Select a locale choir"
                      dropdownMatchSelectWidth={false}
                      onChange={this.handleSelect}
                      value={selectedGroup}
                    >
                      {churchGroups && churchGroups.map(item => {
                        return <Option key={item._id} value={item._id}>{item.name}</Option>
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
              <NavLink to={`/reports/${selectedGroup}/${selectedReport}?period=${period}`}>
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
    );
  }
}

export default ReportsHome;
