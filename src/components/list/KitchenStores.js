import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import {
  Avatar,
  Col,
  Icon,
  List,
  Row,
  Statistic,
} from 'antd';

import emmetAPI from '../../emmetAPI';

import 'antd/dist/antd.css';
import './List.css';

class KitchenStores extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  state = {
    stores: [],
  };

  componentDidMount() {
    this.getStores()
      .then(res => this.setState({ stores: res.stores }))
      .catch(err => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.getStore()
        .then(res => this.setState({ stores: res.stores }))
        .catch(err => console.log(err));
    }
  }

  getStores = async () => {
    const response = await emmetAPI.getUrl(`/api/v1/stores/`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { stores } = this.state;

    return (
      <div className="wrap">
        <div className="extraContent">
          <Row>
            <Col xs={24} sm={24} md={24} lg={12}>
              <Statistic value="Please select your store." />
              <List
                itemLayout="vertical"
                size="large"
                dataSource={stores}
                renderItem={store => (
                  <List.Item
                    key={store.name}
                    extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={store.name} />}
                      title={
                        <Link to={`/stores/${store._id}/calendar`}>
                          {store.name}
                        </Link>
                      }
                      description={store.location}
                    />
                    {store.description}
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withRouter(KitchenStores);
