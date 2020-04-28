import React, { useEffect, useState } from 'react';
import Choropleth from 'react-leaflet-choropleth'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import districtData from '../data/kerala_district.json'
import facilityData from '../data/static/hospitalData.json'
import {
  Circle,
  CircleMarker,
  Map,
  GeoJSON,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  SVGOverlay,
  TileLayer,
} from 'react-leaflet';
import geoLocation from '../data/geoLocation.js';
import indiaData from '../data/indiaData.json';

const center = [9.9312, 76.2673]

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

export default function MapContainer() {
  const [selected, setSelected] = useState({ name: "ventilator", current: "ventcurrent" })
  const geoJSONStyle = {
    color: '#ff0000',
    weight: 1,
    fillOpacity: 0.5,
    fillColor: '#ffffff',
  }
  const onEachFeature = (feature: Object, layer: Object) => {
    const popupContent = ` <Tooltip>${feature.properties.DISTRICT}</Tooltip>`
    layer.bindPopup(popupContent)
  }
  const gradient = {
    0: '#cf0606', 0.2: '#d4590d', 0.4: '#d48b0d',
    0.6: '#d4bd0d', 0.8: '#95d40d', '1.0': '#0dd417'
  };
  return (
    <div id="mapid" className="h-full">
      <Map center={center} zoom={12} minZoom={2}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        />
        {facilityData.map((facility, index) => {

          const availableCapacity = Math.round(((facility[selected.name] - facility[selected.current]) / facility[selected.name]) * 5) / 5;
          // const availableCapacity = Math.round(((facility.icu-facility.icucurrent)/facility.icu)*5)/5;
          const colour = gradient[availableCapacity];
          const boxColour = availableCapacity === 0 ? ["text-white", "text-white", "text-white"] : availableCapacity < 0.3 ? ["text-red-600", "text-white", "text-white"] : availableCapacity < 1 ? ["text-orange-500", "text-orange-500", "text-white"] : availableCapacity == 1 ? ["text-green-500", "text-green-500", "text-green-500"] : availableCapacity < 5 ? ["text-blue-500", "text-blue-500", "text-blue-500"] : ["text-white", "text-white", "text-white"]
          if (isFloat(facility.lat) && isFloat(facility.lng) && facility[selected.name] > 0)
            return (
              <SVGOverlay key={index} bounds={[[facility.lat, facility.lng + 0.5], [facility.lat - 0.25, facility.lng]]}>
                <svg width="40pt" height="15pt" viewBox="0 0 341 185" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#333333" opacity="1.00" d=" M 10.69 30.98 C 10.21 18.64 21.64 7.29 33.99 7.90 C 101.66 7.87 169.31 7.91 236.97 7.88 C 245.65 8.10 254.34 7.61 263.03 7.99 C 272.59 8.43 281.07 15.96 283.54 25.06 C 284.79 31.83 284.01 38.77 284.23 45.61 C 296.49 45.70 308.75 45.47 321.00 45.71 C 324.56 45.69 327.35 49.09 327.42 52.50 C 327.16 77.99 327.42 103.49 327.29 128.98 C 327.17 132.60 323.68 135.53 320.11 135.25 C 308.14 135.18 296.17 135.25 284.19 135.22 C 283.65 143.64 285.98 152.89 281.47 160.58 C 277.35 167.72 269.54 173.19 261.08 172.96 C 185.37 172.94 109.66 173.07 33.96 172.96 C 21.99 173.45 10.91 162.89 10.68 150.94 C 10.69 110.96 10.67 70.97 10.69 30.98 M 198.09 21.39 C 197.89 67.41 198.11 113.43 197.98 159.46 C 219.63 159.45 241.29 159.54 262.93 159.41 C 267.51 159.64 271.06 155.40 270.69 150.98 C 270.58 113.66 270.23 76.33 270.75 39.02 C 270.55 34.72 271.12 30.33 270.14 26.10 C 269.20 22.63 265.35 21.26 262.08 21.41 C 240.75 21.35 219.42 21.39 198.09 21.39 M 24.25 29.06 C 24.01 69.04 24.29 109.02 24.11 149.01 C 24.18 151.92 24.21 155.30 26.46 157.47 C 29.29 160.07 33.43 159.40 36.95 159.49 C 57.05 159.46 77.16 159.45 97.27 159.49 C 97.42 113.48 97.38 67.46 97.29 21.45 C 75.54 21.33 53.78 21.34 32.03 21.44 C 27.69 21.07 23.96 24.72 24.25 29.06 M 111.05 21.41 C 111.26 67.42 111.03 113.44 111.16 159.46 C 135.39 159.49 159.62 159.46 183.85 159.47 C 183.78 113.44 183.86 67.41 183.81 21.39 C 159.56 21.39 135.30 21.35 111.05 21.41 M 284.38 59.14 C 284.38 80.00 284.34 100.86 284.39 121.71 C 294.21 121.84 304.03 121.67 313.85 121.76 C 313.84 100.86 313.80 79.96 313.87 59.07 C 304.04 59.24 294.20 58.95 284.38 59.14 Z" />
                  <path fill="currentColor" className={boxColour[2]} opacity="1.00" d=" M 198.09 21.39 C 219.42 21.39 240.75 21.35 262.08 21.41 C 265.35 21.26 269.20 22.63 270.14 26.10 C 271.12 30.33 270.55 34.72 270.75 39.02 C 270.23 76.33 270.58 113.66 270.69 150.98 C 271.06 155.40 267.51 159.64 262.93 159.41 C 241.29 159.54 219.63 159.45 197.98 159.46 C 198.11 113.43 197.89 67.41 198.09 21.39 Z" />
                  <path fill="currentColor" className={boxColour[1]} opacity="1.00" d=" M 111.05 21.41 C 135.30 21.35 159.56 21.39 183.81 21.39 C 183.86 67.41 183.78 113.44 183.85 159.47 C 159.62 159.46 135.39 159.49 111.16 159.46 C 111.03 113.44 111.26 67.42 111.05 21.41 Z" />
                  <path fill="currentColor" className={boxColour[0]} opacity="1.00" d=" M 24.25 29.06 C 23.96 24.72 27.69 21.07 32.03 21.44 C 53.78 21.34 75.54 21.33 97.29 21.45 C 97.38 67.46 97.42 113.48 97.27 159.49 C 77.16 159.45 57.05 159.46 36.95 159.49 C 33.43 159.40 29.29 160.07 26.46 157.47 C 24.21 155.30 24.18 151.92 24.11 149.01 C 24.29 109.02 24.01 69.04 24.25 29.06 Z" />
                  <path fill="#f6f6f6" opacity="1.00" d=" M 284.38 59.14 C 294.20 58.95 304.04 59.24 313.87 59.07 C 313.80 79.96 313.84 100.86 313.85 121.76 C 304.03 121.67 294.21 121.84 284.39 121.71 C 284.34 100.86 284.38 80.00 284.38 59.14 Z" />
                </svg>

              </SVGOverlay>
            )
          return (React.null)
        })}

        {facilityData.map((facility, index) => {
          if (isFloat(facility.lat) && isFloat(facility.lng) && facility[selected.name] > 0)
            return (
              <Circle
                key={index}
                center={[facility.lat, facility.lng]}
                fillColor="#d14f69"
                fillOpacity={0}
                stroke={false}
                radius={200}
                onMouseOver={e => {
                  e.target.openPopup();
                }}
              >
                <Popup>
                  <h3>{facility.name}</h3>
                  <div className="popup-line-wrap">
                    Ventilator={facility.ventcurrent + "/" + facility.ventilator} <br />
                          ICU={facility.icucurrent + "/" + facility.icu} <br />
                          Normal Beds={facility.normalroomcurrent + "/" + facility.normalroom}
                  </div>
                </Popup>
              </Circle>

            )
          return (React.null)
        })}

      </Map>

      <div className="bg-white border shadow rounded-lg overflow-hidden mt-10" style={{ position: "absolute", top: "85px", right: "15px", zIndex: "100" }}>
        <div >
          <ul className='flex cursor-pointer'>
            <li className={"py-2 px-6 bg-white border-r-2" + (selected.name === "ventilator" ? "" : " text-gray-500 bg-gray-200")} onClick={_ => setSelected({ name: "ventilator", current: "ventcurrent" })}>Ventilator</li>
            <li className={"py-2 px-6 bg-white" + (selected.name === "icu" ? "" : " text-gray-500 bg-gray-200")} onClick={_ => setSelected({ name: "icu", current: "icucurrent" })}>ICU</li>
          </ul>
        </div>
      </div>

    </div>
  )
}
