import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Divider, Upload, Modal, InputNumber, Rate, DatePicker, message } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { UploadOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import destinations from '../../data/destinations';
import moment, { Moment } from 'moment';

const { Title, Text } = Typography;
const { confirm } = Modal;

type Destination = {
  id: number;
  name: string;
  image: string;
  type: string;
  price: number;
  rating: number;
};

type Day = {
  id: number;
  date: string; // ISO string
  destinations: DestinationWithImage[];
};

type DestinationWithImage = Destination & { uploadImage?: string };

type ImageList = {
  [destinationId: number]: { url: string } | undefined;
};

type CustomTimes = {
  [dayId: number]: number[];
};

const ItineraryPage: React.FC = () => {
  const [days, setDays] = useState<Day[]>([{ id: 1, date: moment().format('YYYY-MM-DD'), destinations: [] }]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [budget, setBudget] = useState<number>(0);
  const [travelTime, setTravelTime] = useState<number>(0);
  const [imageList, setImageList] = useState<ImageList>({});
  const [customTimes, setCustomTimes] = useState<CustomTimes>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<DestinationWithImage | null>(null);
  const [newDayDate, setNewDayDate] = useState<Moment | null>(moment());

  const handleAddDay = () => {
    if (!newDayDate) {
      message.error('Vui lòng chọn ngày!');
      return;
    }
    setDays([...days, { id: days.length + 1, date: newDayDate.format('YYYY-MM-DD'), destinations: [] }]);
    setNewDayDate(moment());
  };

  const showDeleteDayConfirm = (dayId: number) => {
    confirm({
      title: 'Bạn có chắc muốn xóa ngày này?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setDays(days.filter(day => day.id !== dayId));
      },
    });
  };

  const showDeleteDestinationConfirm = (dayId: number, destId: number) => {
    confirm({
      title: 'Bạn có chắc muốn xóa điểm đến này?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const updatedDays = days.map(day => {
          if (day.id === dayId) {
            return { ...day, destinations: day.destinations.filter(dest => dest.id !== destId) };
          }
          return day;
        });
        setDays(updatedDays);
        calculateBudgetAndTime(updatedDays, customTimes);
      },
    });
  };

  const handleAddDestination = (dayId: number) => {
    if (!selectedDestination) return;
    const destWithImage: DestinationWithImage = {
      ...selectedDestination,
      uploadImage: imageList[selectedDestination.id]?.url || selectedDestination.image,
    };
    const updatedDays = days.map(day => {
      if (day.id === dayId) {
        return { ...day, destinations: [...day.destinations, destWithImage] };
      }
      return day;
    });
    setDays(updatedDays);
    setSelectedDestination(null);
    setImageList(prev => ({ ...prev, [selectedDestination.id]: undefined }));
    calculateBudgetAndTime(updatedDays, customTimes);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceDay = days.find(day => day.id === parseInt(source.droppableId));
    const destDay = days.find(day => day.id === parseInt(destination.droppableId));
    if (!sourceDay || !destDay) return;
    const [removed] = sourceDay.destinations.splice(source.index, 1);
    destDay.destinations.splice(destination.index, 0, removed);
    setDays([...days]);
    calculateBudgetAndTime(days, customTimes);
  };

  // Xử lý upload ảnh cho điểm đến
  const handleUploadChange = (info: any, destId: number) => {
    if (info.file.status === 'done' || info.file.status === 'uploading' || info.file.status === 'removed') {
      if (info.file.originFileObj) {
        const url = URL.createObjectURL(info.file.originFileObj);
        setImageList(prev => ({ ...prev, [destId]: { ...info.file, url } }));
      } else {
        setImageList(prev => ({ ...prev, [destId]: undefined }));
      }
    }
  };

  // Hiển thị modal chi tiết điểm đến
  const showDetailModal = (dest: DestinationWithImage) => {
    setModalData(dest);
    setModalVisible(true);
  };

  // Thay đổi thời gian di chuyển giữa các điểm
  const handleTimeChange = (dayId: number, idx: number, value: number | null) => {
    if (!value) return;
    setCustomTimes(prev => {
      const newTimes = { ...prev };
      if (!newTimes[dayId]) newTimes[dayId] = [];
      newTimes[dayId][idx] = value;
      return newTimes;
    });
    calculateBudgetAndTime(days, {
      ...customTimes,
      [dayId]: [
        ...(customTimes[dayId] || []).slice(0, idx),
        value,
        ...(customTimes[dayId] || []).slice(idx + 1),
      ],
    });
  };

  // Tính toán ngân sách và thời gian di chuyển
  const calculateBudgetAndTime = (updatedDays: Day[], times: CustomTimes) => {
    let totalBudget = 0;
    let totalTime = 0;
    updatedDays.forEach(day => {
      day.destinations.forEach((dest, idx) => {
        totalBudget += dest.price;
        totalTime += (times[day.id] && times[day.id][idx]) ? times[day.id][idx] : 2;
      });
    });
    setBudget(totalBudget);
    setTravelTime(totalTime);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Tạo lịch trình du lịch</Title>
      {/* Danh sách các điểm đến dạng card nhỏ */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        {destinations.map(dest => (
          <Card
            key={dest.id}
            hoverable
            size="small"
            style={{
              width: 160,
              border: selectedDestination?.id === dest.id ? '2px solid #1890ff' : undefined,
              boxShadow: selectedDestination?.id === dest.id ? '0 0 8px #1890ff44' : undefined,
              cursor: 'pointer',
            }}
            cover={
              <img
                alt={dest.name}
                src={dest.image}
                style={{ height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
            }
            onClick={() => setSelectedDestination(dest)}
          >
            <Card.Meta
              title={<span style={{ fontSize: 14 }}>{dest.name}</span>}
              description={
                <>
                  <Rate disabled defaultValue={dest.rating} style={{ fontSize: 12 }} />
                  <div style={{ fontSize: 12, color: '#888' }}>{dest.price} VND</div>
                </>
              }
            />
          </Card>
        ))}
      </div>
      {/* Upload ảnh và thêm ngày */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {selectedDestination && (
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={info => handleUploadChange(info, selectedDestination.id)}
          >
            <Button type="primary" danger>Tải ảnh lên</Button>
          </Upload>
        )}
        {selectedDestination && imageList[selectedDestination.id] && imageList[selectedDestination.id]!.url && (
          <img
            src={imageList[selectedDestination.id]!.url}
            alt="preview"
            style={{ width: 60, height: 60, objectFit: 'cover', marginLeft: 10, borderRadius: 4 }}
          />
        )}
        <DatePicker
          value={newDayDate}
          onChange={setNewDayDate}
          format="YYYY-MM-DD"
          style={{ marginLeft: 10 }}
          placeholder="Chọn ngày cho ngày mới"
        />
        <Button type="primary" onClick={handleAddDay}>Thêm ngày</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {days.map(day => (
          <Card key={day.id} style={{ marginBottom: '20px' }}>
            <Title level={4}>Ngày {day.id} ({moment(day.date).format('DD/MM/YYYY')})</Title>
            <Button type="primary" danger onClick={() => showDeleteDayConfirm(day.id)}>Xóa ngày</Button>
            <Droppable droppableId={day.id.toString()}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {day.destinations.map((dest, index) => (
                    <Draggable key={dest.id} draggableId={dest.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ padding: '10px', margin: '5px 0', background: '#f0f0f0', ...provided.draggableProps.style }}
                        >
                          <Row justify="space-between" align="middle">
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                              {dest.uploadImage ? (
                                <img src={dest.uploadImage} alt="preview" style={{ width: 40, height: 40, objectFit: 'cover', marginRight: 8, borderRadius: 4 }} />
                              ) : null}
                              <span style={{ marginLeft: 8, cursor: 'pointer', color: '#1890ff' }} onClick={() => showDetailModal(dest)}>
                                {dest.name} <InfoCircleOutlined />
                              </span>
                            </Col>
                            <Col>
                              <InputNumber
                                min={0.5}
                                max={24}
                                step={0.5}
                                value={customTimes[day.id]?.[index] || 2}
                                onChange={value => handleTimeChange(day.id, index, value)}
                                style={{ width: 70, marginRight: 8 }}
                                addonAfter="giờ"
                              />
                              <Button type="link" onClick={() => showDeleteDestinationConfirm(day.id, dest.id)}>Xóa</Button>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Button type="primary" onClick={() => handleAddDestination(day.id)}>Thêm điểm đến</Button>
          </Card>
        ))}
      </DragDropContext>
      <Divider />
      <Row>
        <Col span={12}>
          <Text strong>Tổng ngân sách: {budget} VND</Text>
        </Col>
        <Col span={12}>
          <Text strong>Tổng thời gian di chuyển: {travelTime} giờ</Text>
        </Col>
      </Row>
      <Modal
        visible={modalVisible}
        title={modalData?.name}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        {modalData && (
          <div>
            <img src={modalData.uploadImage || modalData.image} alt={modalData.name} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
            <p><b>Địa điểm:</b> {modalData.name}</p>
            <p><b>Loại hình:</b> {modalData.type}</p>
            <p><b>Giá:</b> {modalData.price} VND</p>
            <p><b>Đánh giá:</b> <Rate disabled defaultValue={modalData.rating} /></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItineraryPage; 