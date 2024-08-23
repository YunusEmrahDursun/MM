import ReactECharts from 'echarts-for-react';
import moment from "moment";
interface propsType{
  maintenancesAylik:any[],
  faultsAylik:any[]
}
const LineChart = (props:propsType) => {

  const options = {
      title: {
          text: 'M&M İstatistikleri - ' + moment().format('YYYY')
      },
      legend: {
        bottom: '2%',
        left: 'center'
      },
      tooltip: {},
      xAxis: {
          type: 'category',
          data: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
      },
      yAxis: {
          type: 'value'
      },
      series: [
          {
              name: 'Bakım Formları',
              type: 'bar',
              data: props.maintenancesAylik
          },
          {
            name: 'Arıza Formları',
            type: 'bar',
            data: props.faultsAylik
        }
      ]
  };

  return <ReactECharts option={options} />;
}

export default LineChart
