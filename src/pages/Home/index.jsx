import React, { useEffect, useState } from 'react';
import {
  Form, Table, Switch, message,
} from 'antd';
// import { SearchOutlined } from '../../components/Icon';
import * as dayjs from 'dayjs';
import { fetchData, throttle } from '../../utils';
import { WECHAT_MALL_ACTIVITIES } from '../../config'
import styles from './home.less';
// console.log('styles: ', styles);
// import './home.less';



// const { RangePicker } = DatePicker;
// const { Option } = Select;


const datas = [
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

let throttleResize = null;
const Home = () => {

  // const classes = useStyles();
  const [clientWidth, setClintWidth] = useState(1001);
  const [data, setData] = useState(datas);
  const [total, setTotal] = useState(80);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10)
  const [form] = Form.useForm();
  const handleChangeChecked = (value) => {

    console.log('value: ', value);
    const v = {
      groupID: 11157,
      shopID: 76311842,
      promotionID: 1111,
      status: value ? 1 : 0,
    }
    fetchData('/crm_h/promotion_updatePromotionStatusByShop.ajax', v)
      .then((res) => {
        if (res.code === '000') {
          message.success('修改成功')
        }
      })
  }
  // isActive 表示当前店铺的活动启动状态，因ProtoBuf的序列化问题，可能存在isActive=0的时候无此字段，因此当isActive不存在则和isActive=0同含义。
  // 为空判断
  const columns = () => ([
    {
      title: '序号',
      dataIndex: 'key',
      align: 'center',
    },
    {
      title: '启用/暂停',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (text, record, index) => {
        const defaultChecked = (record.isActive == '1' ? true : false);
        // const statusState = (
        //     (record.eventWay == '50' || record.eventWay == '53')
        //     &&
        //     (record.status != '0' && record.status != '1' && record.status != '5' && record.status != '21')
        // );
        return (
          <Switch
            // size="small"
            checkedChildren='启用'
            unCheckedChildren='暂停'
            // checked={defaultChecked}
            onChange={handleChangeChecked}
          // disabled={(record.isActive == '-1' || statusState || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) || record.eventWay === 80 ? true : false}
          />
        )
      }
    },
    {
      title: '活动类型',
      dataIndex: 'promotionType',
      render: (promotionType) => {
        const text = (WECHAT_MALL_ACTIVITIES.find(({ key }) => key === `${promotionType}`) || {}).title
        return (<span title={text}>{text}</span>);
      },
    },
    {
      title: '活动名称',
      dataIndex: 'promotionName',
      className: '',
      // render: text => <a>{text}</a>,
    },
    {
      title: '活动编码',
      dataIndex: 'promotionCode',
      className: '',
      // render: text => <a>{text}</a>,
    },
    {
      title: '有效时间',
      dataIndex: 'excludedDate',
      className: '',
      // render: (validDate, record) => {
      // return `${moment(record.startTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD')} - ${moment(record.endTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD')}`;
      // },
      // render: text => <a>{text}</a>,
    },
    {
      title: '有效状态',
      dataIndex: 'excludedSubjectLst', // ??
      className: '',
      align: 'center',
    },
    // {
    //   title: '创建人/修改人',
    //   dataIndex: 'createBy', // ??
    //   className: '',
    //   render: (text, record) => {
    //     return `${text}/${record.modifiedBy}`
    //   }
    // },
    {
      title: '创建时间/修改时间',
      dataIndex: 'createTime', // ??
      className: '',
      // render: (validDate, record) => {
      // return `${moment(record.startTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD')} - ${moment(record.endTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD')}`;
      // },
    },
  ]);

  const onResize = () => {
    const clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
    console.log('clientWidth: ', clientWidth);
    setClintWidth(clientWidth);

  };

  throttleResize = throttleResize || throttle(onResize, 300, 1000);

  const getTableData = () => {
    const v = {
      groupID: 11157,
      shopID: 76311842,
      timestamp: dayjs(new Date()).format('YYYYMMDDHHmmss'),
      promotionID: 1111,
      status: 1,
      sign: '1dd7ef30e37030fcb5eeb3cbec90df5',
    }
    fetchData('/crm_h/promotion_updatePromotionStatusByShop.ajax?devKey=hualala', v)
      .then((res) => {
        const data = { promotionLst: [], ...res.data };
        const pageObj = { pageNo: +data.pageNo, total: +data.totalSize };
        if (data.promotionLst && data.promotionLst.length > 0) {
          setData(data.promotionLst);
          setTotal(pageObj.total);
          setPageSize(data.pageNo);
        } else {
          // setData([]);
        }
      })
      .catch((err) => { console.log(err) });
  }

  useEffect(() => {
    onResize();
    window.addEventListener('resize', throttleResize, false);
    return () => {
      window.removeEventListener('resize', throttleResize, false);
    };
  }, [throttleResize]);

  useEffect(() => {
    getTableData()
  }, [pageNo, pageSize])

  const handleChangePage = (currentPage, curPageSize) => {
    console.log('currentPage, pageSize: ', currentPage, pageSize);
    if (currentPage !== pageNo || pageSize !== curPageSize ) {
      setPageNo(currentPage);
      setPageSize(curPageSize)
    }

  }

  // const onGenderChange = (value) => {
  //   switch (value) {
  //     case 'male':
  //       form.setFieldsValue({
  //         type: 'male',
  //       });
  //       return;
  //     case 'female':
  //       form.setFieldsValue({
  //         type: 'female',
  //       });
  //       return;

  //     case 'other':
  //       form.setFieldsValue({
  //         type: 'other',
  //       });
  //   }
  // };
  // const onFinish = (values, ...options) => {
  //   console.log('options: ', options);
  //   // console.log(useRequest);
  //   console.log(dayjs(new Date()).format('YYYYMMDDHHmmss'));
  // };
  return (
    <div className={styles.homeBox}>
      {/* <div className="home-box"> */}
      <div className={[styles.titleBox, styles.line].join(' ')}><h2 className="title">基础营销设置</h2></div>
      {/* {
        clientWidth <= 992 && clientWidth >= 768 ? (
          <>
            <Row>
              <Form
                form={form}
                initialValues={{ status: 'all', activeType: 'all' }}
                name="horizontal_login"
                layout="inline"
                onFinish={onFinish}
                className={styles.formBox}
                style={{ marginBottom: 0 }}
              >

                <Col md={9}>
                  <Form.Item
                    name="activeTime"
                    label="活动时间"
                  >
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col md={6}>
                  <Form.Item
                    name="activeType"
                    label="活动类型"
                  >
                    <Select
                      onChange={onGenderChange}
                    >
                      <Option value="all">全部</Option>
                      <Option value="male">加价升级换新</Option>
                      <Option value="female">female</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={5}>
                  <Form.Item
                    name="status"
                    label="使用状态"
                  >
                    <Select
                      onChange={onStatusChange}
                    >
                      <Option value="all">全部</Option>
                      <Option value="male">male</Option>
                      <Option value="female">female</Option>
                      <Option value="other">other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={3}>
                  <Form.Item shouldUpdate>
                    {() => (
                      <Button
                        icon={<SearchOutlined />}
                        type="primary"
                        htmlType="submit"
                        disabled={
                          !!form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                      >
                        搜索
                      </Button>
                    )}
                  </Form.Item>
                </Col>
                <div className={styles.line} style={{ width: '100%' }}>
                  <Row className={styles.mdName}>
                    <Col md={9}>
                      <Form.Item
                        name="name"
                        label="活动名称"
                      >
                        <Input
                          type="text"
                          placeholder="请输入活动名称"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Form>
            </Row>
          </>
        ) : (
          <Row className={styles.line}>
            <Form form={form} initialValues={{ status: 'all', activeType: 'all' }} name="horizontal_login" layout="inline" onFinish={onFinish} className={styles.formBox}>
              <Col lg={6} xl={6} xxl={4}>
                <Form.Item
                  name="activeTime"
                  label="活动时间"
                >
                  <RangePicker />
                </Form.Item>
              </Col>
              <Col lg={5} xl={4} xxl={3}>
                <Form.Item
                  name="activeType"
                  label="活动类型"
                >
                  <Select
                    onChange={onGenderChange}
                  >
                    <Option value="all">全部</Option>
                    <Option value="male">加价升级换新</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={5} xl={4} xxl={4}>
                <Form.Item
                  name="status"
                  label="使用状态"
                >
                  <Select
                    onChange={onStatusChange}
                  >
                    <Option value="all">全部</Option>
                    <Option value="male">male</Option>
                    <Option value="female">female</Option>
                    <Option value="other">other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={5} xl={5} xxl={4}>
                <Form.Item
                  name="name"
                  label="活动名称"
                >
                  <Input
                    type="text"
                    placeholder="请输入活动名称"
                  />
                </Form.Item>
              </Col>
              <Col lg={2} xl={3} xxl={3}>
                <Form.Item shouldUpdate>
                  {() => (
                    <Button
                      icon={<SearchOutlined />}
                      type="primary"
                      htmlType="submit"
                      disabled={
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
        )
      } */}
      <div className={styles.tableBox}>
        <Table
          columns={columns()}
          dataSource={data}
          rowKey="key"
          pagination={{
            pageSize,
            pageNo,
            showSizeChanger: true,
            showQuickJumper: true,
            total,
            showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
            position: ['none', 'bottomLeft'],
            onChange: (page, pageSize) => {
              handleChangePage(page, pageSize)
            },
          }}
          bordered
          scroll={{ x: 1800 }}
        // size="small"
        />
      </div>
    </div>
  )
}

export default Home;