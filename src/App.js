import React, { Component } from 'react';
import axios from 'axios';
import {Table} from 'antd';
import 'antd/lib/table/style/css'; 

const renderContent =  (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index === 0) {
    obj.props.rowSpan = row.RouteNameRowSpan;
  }
  // These two are merged into above cell
  if (index <= row.RouteNameRowSpan) {
    obj.props.rowSpan = 0;
  }
  return obj;
}

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        columns:[{
          title: '路线名称',
          dataIndex: 'RouteName',
          key: 'RouteName',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.RouteNameRowSpan || 0
              },
            };

            return obj;
          }
        }, {
          title: '班次',
          dataIndex: 'Time',
          key: 'Time',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.TimeRowSpan || 0
              },
            };

            return obj;
          }
        }, {
          title: '总人数',
          dataIndex: 'total',
          key: 'total',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.TimeRowSpan || 0
              },
            };

            return obj;
          }
        }, {
          title: '航站楼',
          dataIndex: 'Terminal',
          key: 'Terminal',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.TerminalRowSpan || 0
              },
            };

            return obj;
          }
        }, {
          title: '航站楼总人数',
          dataIndex: 'terminalTotal',
          key: 'terminalTotal',
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {
                rowSpan: row.TerminalRowSpan || 0
              },
            };

            return obj;
          }
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
  createBook(arr, v, obj, key) {
    arr[v].forEach(v => {
      obj[v[key]] =  obj[v[key]] ? [...obj[v[key]], v] : [v];
    });
  }
  addTotalNum(book, key) {
    Object.keys(book).forEach( v => {
      let total = 0;
      book[v].forEach(v => {
        total = total + v.Number;
      });
      book[v].forEach( v =>{v[key] = total});
    });
  }
  addRowSpan(book, key) {
    Object.keys(book).forEach( v => {
      let total = 0;
      book[v][0][key] = book[v].length;
    });
  }
  handleData(data) {
    const routeNameDic = {};
    data.forEach(v => {
      routeNameDic[v.RouteName] =  routeNameDic[v.RouteName] ? [v, ...routeNameDic[v.RouteName]] : [v];
    });
  
    //排序航站楼
    Object.keys(routeNameDic).forEach(v => {
      routeNameDic[v].sort( (v1, v2) => {
       const num1= parseInt(v1.Terminal); 
       const num2 = parseInt(v2.Terminal); 
         return num1 - num2;
      })
    });
    //排序时间
     Object.keys(routeNameDic).forEach(v => {
      routeNameDic[v].sort( (v1, v2) => {
       const time1 = new Date(v1.Date +" " + v1.Time); 
       const time2 = new Date(v2.Date +" " + v2.Time);
         return time1.getTime() - time2.getTime();
      })
    this.addRowSpan(routeNameDic, 'RouteNameRowSpan');
  //计算相同班次的人数
  Object.keys(routeNameDic).forEach(v => {
    const timeDic = {};
    this.createBook(routeNameDic, v, timeDic, 'Time');
    //计算相同班次的相同时间总人数
    this.addTotalNum(timeDic, 'total');
    this.addRowSpan(timeDic, 'TimeRowSpan');
    //计算相同班次相同时间相同航站楼的总人数
    Object.keys(timeDic).forEach( v => {
      const terminalDic = {};
      this.createBook(timeDic, v, terminalDic, 'Terminal' );
      this.addTotalNum(terminalDic, 'terminalTotal');
      this.addRowSpan(terminalDic, 'TerminalRowSpan');
    });
  
  });
  });
   let arr =[];
   Object.keys(routeNameDic).forEach( v => {
     arr = arr.concat(routeNameDic[v]);
   });

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
