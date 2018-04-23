import React, { Component } from 'react';
import axios from 'axios';
import {Table} from 'antd';
import 'antd/lib/table/style/css'; 

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
console.log(value, row, index)
  return obj;
};

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        columns:[{
          title: '路线名称',
          dataIndex: 'RouteName',
          key: 'RouteName',
          render: renderContent
        }, {
          title: '班次',
          dataIndex: 'Time',
          key: 'Time',
        }, {
          title: '总人数',
          dataIndex: 'total',
          key: 'total',
        }, {
          title: '航站楼',
          dataIndex: 'Terminal',
          key: 'Terminal',
        }, {
          title: '航站楼总人数',
          dataIndex: 'terminalTotal',
          key: 'terminalTotal',
        }, {
          title: '预订人姓名',
          dataIndex: 'Name',
          key: 'Name',
        }, {
          title: '人数',
          dataIndex: 'Number',
          key: 'Number',
        }, {
          title: '航班号',
          dataIndex: 'Flight',
          key: 'Flight',
        }, {
          title: '预订人手机',
          dataIndex: 'Phone',
          key: 'Phone',
        }],
        dataSource:[]
      }
  }
  handleData(data) {
    const routeNameObj = {};
   data.forEach(v => {
    routeNameObj[v.RouteName] =  routeNameObj[v.RouteName] ? [v, ...routeNameObj[v.RouteName]] : [v];
   });
  //排序时间
   Object.keys(routeNameObj).forEach(v => {
    routeNameObj[v].sort( (v1, v2) => {
     const time1 = new Date(v1.Date +" " + v1.Time); 
     const time2 = new Date(v2.Date +" " + v2.Time);
       return time1.getTime() - time2.getTime();
    })
  });
  //排序航站楼
  Object.keys(routeNameObj).forEach(v => {
    routeNameObj[v].sort( (v1, v2) => {
     const num1= parseInt(v1.Terminal); 
     const num2 = parseInt(v2.Terminal); 
       return num1 - num2;
    })
  });
   let arr =[];
   Object.keys(routeNameObj).forEach( v=> {
     arr = arr.concat(routeNameObj[v]);
   });
console.log(JSON.stringify(arr));
   return arr;
    
  }
  componentDidMount() {
    axios.get('http://114.115.138.210/frontend/data.json').then(res => {
      if(res.status == 200) {
        this.setState({dataSource: this.handleData(res.data)})
        console.log(res.data)
      }
    })
  }
  render() {
    return (<div>
      <Table  rowKey={v => v.OrderID} bordered dataSource={this.state.dataSource} columns={this.state.columns} />
    </div>)
  }
}

export default App;
