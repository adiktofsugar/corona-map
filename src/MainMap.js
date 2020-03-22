/* global google */
import React, { useState, useRef } from "react";
import { compose, withProps } from "recompose";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";
import { MarkerWithLabel } from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { MAP_API_KEY } from "./keys";
import useDefaultCenter from "./useDefaultCenter";
import hospitals from "./data/hospitals.json";

// "id": "1",
// "biz_provider_id": "320060",
// "biz_name": "ZUNI INDIAN HOSPITAL",
// "biz_info": "Acute Care Hospitals",
// "e_address": "ROUTE 301 NORTH B STREET",
// "e_city": "Zuni Pueblo",
// "e_state": "NM",
// "e_postal": "87327",
// "e_zip_full": "",
// "e_country": "USA",
// "loc_county": "McKinley",
// "loc_area_code": "505",
// "loc_FIPS": "35031",
// "loc_MSA": "",
// "loc_PMSA": "",
// "loc_TZ": "MST",
// "loc_DST": "Y",
// "loc_LAT_centroid": "35.0898",
// "loc_LAT_poly": "35.0694767",
// "loc_LONG_centroid": "-108.7634",
// "loc_LONG_poly": "-108.8484168",
// "biz_phone": "(505) 782-4431",
// "web_url": "",
// "web_meta_title": "",
// "web_meta_desc": "",
// "web_meta_keys": "",
// "biz_owner": "Government - Federal",
// "f_emergency": "TRUE",
// "biz_bedcount": "30"

const MainMap = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(() => {
  const mapRef = useRef();
  const defaultZoom = 8;
  const [zoom, setZoom] = useState(defaultZoom);
  const handleZoomChanged = () => {
    setZoom(mapRef.current.getZoom());
  };
  const defaultCenter = useDefaultCenter();
  if (!defaultCenter) {
    return null;
  }
  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={defaultCenter}
      ref={mapRef}
      onZoomChanged={handleZoomChanged}
    >
      {hospitals.map(
        ({
          id,
          loc_LAT_centroid: lat,
          loc_LONG_centroid: lng,
          biz_name: name,
          e_address: address,
          e_city: city,
          e_state: state,
          e_postal: zip,
        }) => (
          <MarkerWithLabel
            key={id}
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            labelAnchor={new google.maps.Point(0, 0)}
            labelStyle={{
              backgroundColor: "yellow",
              fontSize: `${zoom * 4}px`,
              padding: `${zoom * 2}px`,
            }}
          >
            <div>
              <div>{name}</div>
              <div>{address}</div>
              <div>
                {city}, {state} {zip}
              </div>
            </div>
          </MarkerWithLabel>
        )
      )}
    </GoogleMap>
  );
});

export default MainMap;
