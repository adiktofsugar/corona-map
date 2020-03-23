import React, { useMemo, useState, useRef, useCallback } from "react";
import { compose, withProps } from "recompose";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  InfoWindow,
  Marker,
} from "react-google-maps";
import { MAP_API_KEY } from "./keys";
import useDefaultCenter from "./useDefaultCenter";
import hospitalsRaw from "./data/hospitals.json";
const {
  MarkerClusterer,
} = require("react-google-maps/lib/components/addons/MarkerClusterer");

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
  const defaultZoom = 5;

  const [activeInfoId, setActiveInfoId] = useState();
  // eslint-disable-next-line no-unused-vars
  const [zoom, setZoom] = useState(defaultZoom);
  const defaultCenter = useDefaultCenter();
  const hospitals = useMemo(
    () =>
      hospitalsRaw.map(
        ({
          id,
          loc_LAT_poly: lat,
          loc_LONG_poly: lng,
          biz_name: name,
          e_address: address,
          e_city: city,
          e_state: state,
          e_postal: zip,
          biz_phone: phone,
        }) => ({
          id,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          name,
          address,
          city,
          state,
          zip,
          phone,
        })
      ),
    []
  );

  // original here: https://github.com/googlemaps/v3-utility-library/blob/5d5430fcf737b19dd53b0c9b9e04dcf23db6f980/packages/markerclustererplus/src/markerclusterer.ts#L1148
  const calculator = useCallback((markers = []) => {
    return {
      text: markers.length.toString(),
      // this is the index of the styles array to use
      //  the default has 3 circular background images - blue, yellow, and red
      //  i don't want to show yellow and red because it looks like a warning,
      //  so for now I'm just showing blue
      index: 0,
      title: "",
    };
  }, []);

  const handleZoomChanged = useCallback(() => {
    setZoom(mapRef.current.getZoom());
  }, []);
  if (!defaultCenter) {
    return null;
  }
  return (
    <GoogleMap
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
      ref={mapRef}
      onZoomChanged={handleZoomChanged}
      onClick={() => {
        setActiveInfoId(null);
      }}
    >
      <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={60}
        maxZoom={15}
        calculator={calculator}
      >
        {hospitals.map(
          ({ id, lat, lng, name, address, city, state, zip, phone }) => (
            <Marker
              key={id}
              onClick={() => {
                setActiveInfoId(activeInfoId === id ? null : id);
              }}
              position={{ lat, lng }}
            >
              {id === activeInfoId ? (
                <InfoWindow
                  onCloseClick={() => {
                    setActiveInfoId(null);
                  }}
                >
                  <div>
                    <div>{name}</div>
                    <div>{address}</div>
                    <div>
                      {city}, {state} {zip}
                    </div>
                    {phone ? <div>{phone}</div> : null}
                  </div>
                </InfoWindow>
              ) : null}
            </Marker>
          )
        )}
      </MarkerClusterer>
    </GoogleMap>
  );
});

export default MainMap;
