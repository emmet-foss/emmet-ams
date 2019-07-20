import React, { Component } from 'react';
import {
  PageHeader,
  Statistic,
  Row,
  Col,
  Select,
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

  handleLocaleSelect = async (localeId) => {
    this.setState({
      selectedLocale: localeId,
    });

  };

  render() {
    const {
      churchLocales,
      selectedLocale,
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
              </Col>
            </Row>
          </div>
        </div>
      </PageHeader>

    );
  }
}

export default Home;
