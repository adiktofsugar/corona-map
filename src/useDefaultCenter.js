import { useState } from "react";

const backupDefaultCenter = { lat: 40.6971494, lng: -74.2598655 };
const useDefaultCenter = () => {
  const [defaultCenter, setDefaultCenter] = useState();
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDefaultCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // browserHasGeolocation, but failed to get location
        setDefaultCenter(backupDefaultCenter);
      }
    );
  } else {
    setDefaultCenter(backupDefaultCenter);
  }
  return defaultCenter;
};

export default useDefaultCenter;
