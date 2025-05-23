import React from 'react';
import { Pie } from '@ant-design/charts';
import { Alert, Typography, Divider } from 'antd';
import destinations from '../../data/destinations';

const { Title } = Typography;

// Tính tổng ngân sách theo category
const getBudgetByCategory = () => {
  const categoryMap: { [key: string]: number } = {};
  destinations.forEach(item => {
    const cat = item.type || 'Khác';
    categoryMap[cat] = (categoryMap[cat] || 0) + item.price;
  });
  return Object.entries(categoryMap).map(([type, value]) => ({ type, value }));
};

const budgetLimit = 5000000; // 5 triệu
const totalBudget = destinations.reduce((sum, item) => sum + item.price, 0);

const BudgetChart: React.FC = () => {
  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>Biểu đồ phân bổ ngân sách</Title>
      {totalBudget > budgetLimit && (
        <Alert
          message="Cảnh báo: Bạn đã vượt quá ngân sách cho phép!"
          description={`Ngân sách hiện tại: ${(totalBudget / 1000000).toFixed(1)} triệu / ${(budgetLimit / 1000000).toFixed(1)} triệu`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Pie
        data={getBudgetByCategory()}
        angleField="value"
        colorField="type"
        radius={0.8}
        label={{ type: 'outer', content: '{name} {percentage}' }}
        legend={{ position: 'bottom' }}
        height={300}
      />
      <Divider />
      <div style={{ fontSize: 16, marginTop: 16 }}>
        <b>Tổng ngân sách:</b> {(totalBudget / 1000000).toFixed(1)} triệu VND
      </div>
    </div>
  );
};

export default BudgetChart; 