import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import AsyncSelect from 'react-select/async';
import { fetchLocalMapBox } from '../api';

const initialPosition = {
  lat: -15.808333952990994,
  lng: -47.88632936336736,
};

type Place = {
  label?: string;
  value?: string;
  position: {
    lat: number;
    lng: number;
  };
};

function OrderLocation() {
  const [address, setAddress] = useState<Place>({
    position: initialPosition,
  });

  const loadOptions = async (
    inputValue: string,
    callback: (places: Place[]) => void,
  ) => {
    const response = await fetchLocalMapBox(inputValue);

    const places = response.data.features.map((item: any) => {
      return {
        label: item.place_name,
        value: item.place_name,
        position: {
          lat: item.center[1],
          lng: item.center[0],
        },
      };
    });

    callback(places);
  };

  const handleChangeSelect = (place: Place) => {
    setAddress(place);
    // onChangeLocation({
    //   latitude: place.position.lat,
    //   longitude: place.position.lng,
    //   address: place.label!,
    // });
  };

  return (
    <div className="orders-container">
      <div className="order-location-container">
        <div className="order-location-content">
          <h3 className="order-location-title">
            Selecione onde o pedido deve ser entregue:
          </h3>
          <div className="filter-container">
            <AsyncSelect
              placeholder="Digite um endereço para entregar o pedido"
              className="filter"
              loadOptions={loadOptions}
              onChange={value => handleChangeSelect(value as Place)}
            />
          </div>
          <div className="filter-container"></div>
          <MapContainer
            center={address.position}
            zoom={17}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={address.position}>
              <Popup>Meu marcador</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default OrderLocation;