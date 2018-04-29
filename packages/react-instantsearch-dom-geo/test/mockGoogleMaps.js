export const createFakeMapInstance = () => ({
  addListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  getCenter: jest.fn(),
  setCenter: jest.fn(),
  getZoom: jest.fn(),
  setZoom: jest.fn(),
  getBounds: jest.fn(() => ({
    getNorthEast: jest.fn(),
    getSouthWest: jest.fn(),
  })),
  getProjection: jest.fn(() => ({
    fromPointToLatLng: jest.fn(() => ({
      lat: jest.fn(),
      lng: jest.fn(),
    })),
    fromLatLngToPoint: jest.fn(() => ({
      x: 0,
      y: 0,
    })),
  })),
  fitBounds: jest.fn(),
});

export const createFakeMarkerInstance = () => ({
  setMap: jest.fn(),
  getPosition: jest.fn(),
  addListener: jest.fn(),
});

export const createFakeGoogleReference = ({
  mapInstance = createFakeMapInstance(),
  markerInstance = createFakeMarkerInstance(),
} = {}) => ({
  maps: {
    LatLng: jest.fn(),
    LatLngBounds: jest.fn(() => ({
      extend: jest.fn().mockReturnThis(),
    })),
    Map: jest.fn(() => mapInstance),
    Marker: jest.fn(args => ({
      ...args,
      ...markerInstance,
    })),
    ControlPosition: {
      LEFT_TOP: 'left:top',
    },
    event: {
      addListenerOnce: jest.fn(),
    },
    OverlayView: {
      setMap: jest.fn(),
      getPanes: jest.fn(() => ({
        overlayMouseTarget: {
          appendChild: jest.fn(),
        },
      })),
      getProjection: jest.fn(() => ({
        fromLatLngToDivPixel: jest.fn(() => ({
          x: 0,
          y: 0,
        })),
      })),
    },
  },
});
