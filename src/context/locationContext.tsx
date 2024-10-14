import React, { createContext, useContext, useState } from 'react';


interface IPlacesContext {
  destination: any;
  setDestination: React.Dispatch<React.SetStateAction<any>>;
  places: any;
  setPlaces: React.Dispatch<React.SetStateAction<any>>;
}

// Create the Context
const PlacesContext = createContext<IPlacesContext | null>(null);

export const usePlaces = () => {
  return useContext(PlacesContext);
}

// Create a Provider component
export const PlacesProvider = ({ children }: any) => {
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState([{
    description: 'Empire State Building',
    geometry: { location: { lat: 40.748817, lng: -73.985428 } },
  },
  {
    description: 'Statue of Liberty',
    geometry: { location: { lat: 40.689247, lng: -74.044502 } },
  },
  {
    description: `Chetan's Home`,
    geometry: { location: { lat: 23.2671976, lng: 77.4626481, } },
  }]);

  return (
    <PlacesContext.Provider
      value={{
        destination,
        setDestination,
        places,
        setPlaces,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
