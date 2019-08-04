import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button, Col, Icon,
  Select, Statistic, Row,
} from 'antd';
import ReactGA from 'react-ga';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './Home.css';

const Option = Select.Option;

class Home extends Component {
  state = {
    stores: [],
    availableDates: [],
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
      churchLocales,
      selectedLocale,
    } = this.state;
    return (
      <div className="wrap">
        <div className="extraContent">
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <div>Welcome to Emmet AMS!</div>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <Statistic value="From what locale are you?" />
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a locale"
                dropdownMatchSelectWidth={false}
                onChange={this.handleLocaleSelect}
                value={selectedLocale}
              >
                {churchLocales && churchLocales.map(locale => {
                  return <Option key={locale._id} value={locale._id}>{locale.name}</Option>
                })}
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col xs={24} sm={24} md={24} lg={12}>
              <NavLink to={`/locale_church/${selectedLocale}/calendar`}>
                <Button block type="primary" disabled={!selectedLocale}>
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

export default Home;
