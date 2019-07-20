import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Col,
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

class Home extends Component {
  state = {
    stores: [],
    availableDates: [],
  };

  componentDidMount() {
    this.getChurchLocales()
      .then(res => this.setState({ churchLocales: res.locales }))
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getChurchLocales()
      .then(res => this.setState({ stores: res.stores }))
      .catch(err => console.log(err));
    }
  }

  getChurchLocales = async () => {
    const response = await emmetAPI.getUrl('/ams/locale_churches')
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleLocaleSelect = async (localeValue, localeObj) => {
    console.log(localeValue, localeObj.key)
    this.setState({
      selectedLocale: localeValue,
      selectedLocaleKey: localeObj.key,
    });

  };

  render() {
    const {
      churchLocales,
      selectedLocale,
      selectedLocaleKey,
    } = this.state;
    return (
      <PageHeader
        title={`Welcome to Emmet AMS!`}
      >
        <div className="wrap">
          <div className="extraContent">
            <Row>
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
                    return <Option key={locale._id} value={locale.name}>{locale.name}</Option>
                  })}
                </Select>
                <Link to={`/locale_church/${selectedLocaleKey}`}>
                  <Button type="primary">
                    <Icon type="shopping-cart"/>Checkout
                  </Button>
                </Link>
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default Home;
