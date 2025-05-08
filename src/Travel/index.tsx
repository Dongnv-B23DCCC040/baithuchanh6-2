import React, { useState } from 'react';
import { Card, Rate, Select, Slider, Row, Col } from 'antd';
import destinations, { Destination } from '../data/destinations';

const { Option } = Select;

type SortType = '' | 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';

const sortOptions = [
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'rating_asc', label: 'Đánh giá tăng dần' },
  { value: 'rating_desc', label: 'Đánh giá giảm dần' },
];

const HomePage: React.FC = () => {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>('');

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    filterAndSortDestinations(value, priceRange, ratingFilter, sortType);
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    filterAndSortDestinations(typeFilter, value, ratingFilter, sortType);
  };

  const handleRatingChange = (value: number) => {
    setRatingFilter(value);
    filterAndSortDestinations(typeFilter, priceRange, value, sortType);
  };

  const handleSortChange = (value: SortType) => {
    setSortType(value);
    filterAndSortDestinations(typeFilter, priceRange, ratingFilter, value);
  };

  const filterAndSortDestinations = (
    type: string,
    price: [number, number],
    rating: number,
    sort: SortType
  ) => {
    let filtered = destinations;
    if (type !== 'all') {
      filtered = filtered.filter(dest => dest.type === type);
    }
    filtered = filtered.filter(dest => dest.price >= price[0] && dest.price <= price[1]);
    filtered = filtered.filter(dest => dest.rating >= rating);
    // Sort
    if (sort === 'price_asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating_asc') {
      filtered = [...filtered].sort((a, b) => a.rating - b.rating);
    } else if (sort === 'rating_desc') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }
    setFilteredDestinations(filtered);
  };

  // Format giá sang triệu
  const formatPrice = (price: number) => `${(price / 1000000).toFixed(1)} triệu`;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Khám phá điểm đến nổi bật</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Select defaultValue="all" style={{ width: 120 }} onChange={handleTypeChange}>
          <Option value="all">Tất cả</Option>
          <Option value="beach">Biển</Option>
          <Option value="mountain">Núi</Option>
          <Option value="city">Thành phố</Option>
        </Select>
        <div>
          <Slider
            range
            defaultValue={[0, 3000000]}
            min={0}
            max={3000000}
            step={100000}
            style={{ width: 200 }}
            onChange={handlePriceChange}
            value={priceRange}
          />
          <div style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
            {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
          </div>
        </div>
        <Rate defaultValue={0} onChange={handleRatingChange} />
        <Select
          placeholder="Sắp xếp"
          style={{ width: 150 }}
          onChange={handleSortChange}
          allowClear
        >
          {sortOptions.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </div>
      <Row gutter={16}>
        {filteredDestinations.map(dest => (
          <Col span={8} key={dest.id} style={{ marginBottom: '20px' }}>
            <Card
              hoverable
              cover={<img alt={dest.name} src={dest.image} />}
            >
              <Card.Meta
                title={dest.name}
                description={<Rate disabled defaultValue={dest.rating} />}
              />
              <p>Giá: {formatPrice(dest.price)}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage; 