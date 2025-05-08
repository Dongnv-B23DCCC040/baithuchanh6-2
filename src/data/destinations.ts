export type Destination = {
  id: number;
  name: string;
  image: string;
  type: string;
  price: number;
  rating: number;
};

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Biển Nha Trang',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    type: 'beach',
    price: 1500000, // 1.5 triệu
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Núi Fansipan',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    type: 'mountain',
    price: 2000000, // 2 triệu
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Thành phố Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    type: 'city',
    price: 1200000, // 1.2 triệu
    rating: 4.2,
  },
  {
    id: 4,
    name: 'Biển Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    type: 'beach',
    price: 1800000, // 1.8 triệu
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Núi Bà Đen',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    type: 'mountain',
    price: 1000000, // 1 triệu
    rating: 4.0,
  },
  {
    id: 6,
    name: 'Thành phố Hà Nội',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    type: 'city',
    price: 1300000, // 1.3 triệu
    rating: 4.3,
  },
];

export default destinations; 