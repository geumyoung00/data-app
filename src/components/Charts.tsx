'use client';

import { chartsDataType } from '../app/view/page';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Charts({ countData }: { countData: chartsDataType }) {
  const { agency, success, faild } = countData;
  const data = {
    labels: ['수집 실패', '수집 성공'],
    datasets: [
      {
        data: [faild, success],
        backgroundColor: ['#ff4343', '#00B07B'],
        borderColor: 'transparent',
        borderDashOffset: 0,
      },
    ],
  };

  const options = {
    cutout: '40',
    circumference: 360,
    plugins: { legend: { display: false } },
  };

  return (
    <div className='graph-wrap'>
      <div className='graph'>
        <Pie data={data} options={options} />
      </div>
      <div className='text-wrap'>
        <h3>{agency.name}</h3>
        <ol>
          <li className='success'>
            <p className='count'>{success}</p>
            <p>수집 성공</p>
          </li>
          <li className='faild'>
            <p className='count'>{faild}</p>
            <p>수집 실패</p>
          </li>
        </ol>
      </div>
    </div>
  );
}
