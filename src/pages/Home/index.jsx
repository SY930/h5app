import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, ConfigProvider, Table } from 'antd';
import { IconProvider, SearchOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import './home.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
    align: 'right',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park',
  },
];

const Home = () => {
  // const classes = useStyles();
  const [form] = Form.useForm();

  const onGenderChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          type: 'male',
        });
        return;
      case 'female':
        form.setFieldsValue({
          type: 'female',
        });
        return;

      case 'other':
        form.setFieldsValue({
          type: 'other',
        });
    }
  };

  const onStatusChange = (value) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({
          status: 'male',
        });
        return;
      case 'female':
        form.setFieldsValue({
          status: 'female',
        });
        return;

      case 'other':
        form.setFieldsValue({
          status: 'other',
        });
    }
  };

  const onFinish = (values) => {
    console.log('Finish:', values);
  };
  return (
    <div className="home-box">
      <div className="title-box line"><h2 className="title">基础营销设置</h2></div>
      <Row className="line">
        <Form form={form} initialValues={{ status: 'all', activeType: 'all' }} name="horizontal_login" layout="inline" onFinish={onFinish} className="form-box">
          <Col span={4}>
            <Form.Item
              name="activeTime"
              label="活动时间"
            // wrapperCol={{ span: 16 }}
            >
              <ConfigProvider locale={zhCN}>
                <RangePicker />
              </ConfigProvider>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              name="activeType"
              label="活动类型"
            // {...formItemLayout}
            >
              <Select
                onChange={onGenderChange}
              // allowClear
              >
                <Option value="all">全部</Option>
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              name="status"
              label="使用状态"
            // {...formItemLayout}
            >
              <Select
                onChange={onStatusChange}
              // allowClear
              >
                <Option value="all">全部</Option>
                <Option value="male">male</Option>
                <Option value="female">female</Option>
                <Option value="other">other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="name"
              label="活动名称"
            >
              <Input
                type="password"
                placeholder="请输入活动名称"
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  disabled={
                    // !form.isFieldsTouched(true) ||
                    !!form.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  搜索
                </Button>
              )}
            </Form.Item>
          </Col>
        </Form>
      </Row>
      <div className="table-box">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
        />
      </div>
    </div>
  )
}

export default Home;