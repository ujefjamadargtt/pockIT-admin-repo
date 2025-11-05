import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';
declare const google: any;
declare let L: any;
@Component({
  selector: 'app-technicianlocationsmap',
  templateUrl: './technicianlocationsmap.component.html',
  styleUrls: ['./technicianlocationsmap.component.css'],
})
export class TechnicianlocationsmapComponent {
  @Input() TYPE = '';
  @Input() FILTER_ID = 0;
  isnodata = false;
  private map: any;
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService,
    private datepipe: DatePipe
  ) { }

  technician: any;
  ngOnInit(): void {
    this.initMap();
  }
  dataList: any = [];
  isSpinning = false;
  filterQueryDate: any;
  ORDER_IDFilt: any;
  tech_IDFilt: any;

  initMap(): void {
    this.isSpinning = true;
    this.isnodata = false;
    var filterquery = '';
    if (this.TYPE == 'ORDER') {
      this.api
        .getorderDetails(0, 0, '', '', ' AND ORDER_ID =' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              var TECH_IDS: any = [];
              data['data'].forEach((element) => {
                if (element.TECHNICIAN_ID) TECH_IDS.push(element.TECHNICIAN_ID);
              });

              filterquery =
                ' AND ORDER_ID =' +
                this.FILTER_ID +
                ' AND TECHNICIAN_ID in (' +
                TECH_IDS.toString() +
                ')';

              if (TECH_IDS.length > 0) {
                this.ORDER_IDFilt =
                  this.FILTER_ID != null && this.FILTER_ID != undefined
                    ? {
                      ORDER_ID: {
                        $in: [this.FILTER_ID],
                      },
                    }
                    : {};
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                      TECHNICIAN_ID: {
                        $in: TECH_IDS,
                      },
                    }
                    : {};
                this.filterQueryDate = {
                  $and: [this.ORDER_IDFilt, this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              } else {
                this.isSpinning = false;
                this.isnodata = true;
              }
            } else {
              this.isSpinning = false;
              this.isnodata = true;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    } else if (this.TYPE == 'JOB') {
      this.api
        .getpendinjobsdataa(
          1,
          1,
          '',
          '',
          ' AND ID in (' + this.FILTER_ID.toString() + ')'
        )
        .subscribe(
          (data2) => {
            if (data2['code'] == 200) {
              var TECH_IDS: any = [];

              data2['data'].forEach((element) => {
                if (element.TECHNICIAN_ID) TECH_IDS.push(element.TECHNICIAN_ID);
              });

              filterquery =
                ' AND JOB_CARD_ID in (' +
                this.FILTER_ID.toString() +
                ')' +
                ' AND TECHNICIAN_ID in (' +
                TECH_IDS.toString() +
                ')';
              if (TECH_IDS.length > 0) {
                this.ORDER_IDFilt =
                  this.FILTER_ID != null && this.FILTER_ID != undefined
                    ? {
                      JOB_CARD_ID: {
                        $in: [this.FILTER_ID],
                      },
                    }
                    : {};
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                      TECHNICIAN_ID: {
                        $in: TECH_IDS,
                      },
                    }
                    : {};
                this.filterQueryDate = {
                  $and: [this.ORDER_IDFilt, this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              } else {
                this.isSpinning = false;
                this.isnodata = true;
              }
            } else {
              this.isSpinning = false;
              this.isnodata = true;
            }
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    } else if (this.TYPE == 'VENDOR') {
      var TECH_IDS: any = [];

      this.api
        .getTechnicianData(0, 0, '', '', ' AND VENDOR_ID =' + this.FILTER_ID)
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              data['data'].forEach((element) => {
                if (element.ID) TECH_IDS.push(element.ID);
              });
              filterquery =
                ' AND TECHNICIAN_ID in (' + TECH_IDS.toString() + ')';
              if (TECH_IDS.length > 0) {
                this.tech_IDFilt =
                  TECH_IDS != null && TECH_IDS != undefined
                    ? {
                      TECHNICIAN_ID: {
                        $in: TECH_IDS,
                      },
                    }
                    : {};
                this.filterQueryDate = {
                  $and: [this.tech_IDFilt],
                };
                this.getdataaa(this.filterQueryDate);
              }
            }
            this.isSpinning = false;
          },
          (err) => {
            this.isSpinning = false;
            this.isnodata = true;
          }
        );
    } else if (this.TYPE == 'TECHNICIAN') {
      filterquery = ' AND TECHNICIAN_ID =' + this.FILTER_ID;
      if (this.FILTER_ID) {
        this.tech_IDFilt =
          this.FILTER_ID != null && this.FILTER_ID != undefined
            ? {
              TECHNICIAN_ID: {
                $in: [this.FILTER_ID],
              },
            }
            : {};
        this.filterQueryDate = {
          $and: [this.tech_IDFilt],
        };
        this.getdataaa(this.filterQueryDate);
      }
    }
  }

  getdataaa(filterquery) {
    this.api
      .getTechnicaionLoacionTrack(0, 0, '_id', 'desc', filterquery)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.technician = data.data;
            this.isnodata = false;
            if (this.technician.length > 0) {
              this.setLocation();
            } else {
              this.technician = [];
              this.isSpinning = false;
              this.isnodata = true;
            }
            // Initialize the map with updated data
          } else {
            this.message.error('Server Not Found.', '');
          }
        },
        (err: HttpErrorResponse) => {
          this.handleHttpError(err);
        }
      );
  }

  techniciansdata: any;
  handleHttpError(err: HttpErrorResponse) {
    if (err.status === 0) {
      this.message.error(
        'Unable to connect. Please check your internet or server connection and try again shortly.',
        ''
      );
    } else {
      this.message.error('Something Went Wrong.', '');
    }
  }
  // Define travel path coordinates (lat, lng)
  private pathCoordinates: any[] = [];
  // setLocation() {
  //   const technician = this.technician;
  //   if (technician) {
  //     const locations = technician
  //       .map((loc: any) => ({
  //         name: loc.TECHNICIAN_NAME,
  //         lat: parseFloat(loc.LOCATION_LATITUDE),
  //         lng: parseFloat(loc.LOCATION_LONG),
  //         locationName: `Location ID: ${loc._id}`,
  //         dateTime: new Date(loc.createdAt).toLocaleString(),
  //       }))
  //       .filter((loc: any) => !isNaN(loc.lat) && !isNaN(loc.lng));

  //     if (locations.length === 0) {
  //       this.message.error('No valid locations found for the technician.', '');
  //       return; // Exit if no valid locations
  //     } else {
  //       this.pathCoordinates = locations;
  //     }
  //   }
  //   this.map = L.map('map').setView(
  //     [this.pathCoordinates[0].lat, this.pathCoordinates[0].lng],
  //     20
  //   ); // Set initial view

  //   // Add OpenStreetMap tile layer
  //   L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  //     attribution: '',
  //     maxZoom: 22, // Set max zoom
  //   }).addTo(this.map);

  //   // Add markers with date-time info and polyline
  //   this.plotPath();
  //   this.isSpinning = false;
  // }

  // private plotPath(): void {
  //   let markers: any = [];
  //   let latLngs: [number, number][] = [];
  //   // Custom Red Marker Icon
  //   const redIcon = L.icon({
  //     iconUrl:
  //       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', // 🔴 Custom Red Marker
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //     popupAnchor: [1, -34],
  //     shadowUrl:
  //       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  //     shadowSize: [41, 41],
  //   });
  //   this.pathCoordinates.forEach((point) => {
  //     let marker: any = L.marker([point.lat, point.lng], { icon: redIcon })
  //       .addTo(this.map)
  //       .bindPopup(`<b>${point.name}<br/>Time:</b> ${point.dateTime}`)
  //       .openPopup(); // Opens popup by default

  //     markers.push(marker);
  //     latLngs.push([point.lat, point.lng]);
  //   });

  //   // Draw polyline for the travel path
  //   L.polyline(latLngs, { color: 'blue', weight: 4 }).addTo(this.map);
  // }

  // setLocation() {
  //   const technician = this.technician;

  //   if (technician) {
  //     const locations = technician
  //       .map((loc: any) => ({
  //         name: loc.TECHNICIAN_NAME,
  //         lat: parseFloat(loc.LOCATION_LATITUDE),
  //         lng: parseFloat(loc.LOCATION_LONG),
  //         locationName: `Location ID: ${loc._id}`,
  //         dateTime: new Date(loc.createdAt).toLocaleString(),
  //       }))
  //       .filter((loc: any) => !isNaN(loc.lat) && !isNaN(loc.lng));

  //     if (locations.length === 0) {
  //       this.message.error('No valid locations found for the technician.', '');
  //       return;
  //     }

  //     // Initialize Google Map
  //     const map = new google.maps.Map(document.getElementById('map'), {
  //       center: { lat: locations[0].lat, lng: locations[0].lng },
  //       zoom: 14,
  //       mapTypeId: 'roadmap',
  //     });

  //     // Store LatLng points for polyline
  //     const pathCoordinates = locations.map((point) => ({
  //       lat: point.lat,
  //       lng: point.lng,
  //     }));

  //     // Create an InfoWindow
  //     const infoWindow = new google.maps.InfoWindow();

  //     // Add markers for each location
  //     const markers = locations.map((point, index) => {
  //       return new google.maps.Marker({
  //         position: { lat: point.lat, lng: point.lng },
  //         map: map,
  //         title: `${point.name} - ${point.dateTime}`,
  //         icon: {
  //           url: index === 0
  //             ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'  // 🟢 Green for Start
  //             : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',   // 🔴 Red for Others
  //           scaledSize: new google.maps.Size(40, 40), // Resize if needed
  //         }
  //       });
  //     });

  //     // ✅ Add event listeners in a separate loop
  //     markers.forEach((marker, index) => {
  //       marker.addListener('mouseover', () => {
  //         infoWindow.setContent(`
  //           <div style="font-size: 14px;">
  //             <strong>Technician:</strong> ${locations[index].name}<br>
  //             <strong>Location:</strong> ${locations[index].locationName}<br>
  //             <strong>Date & Time:</strong> ${locations[index].dateTime}
  //           </div>
  //         `);
  //         infoWindow.open(map, marker);
  //       });

  //       marker.addListener('mouseout', () => {
  //         infoWindow.close();
  //       });
  //     });

  //     // Draw polyline to connect locations
  //     const travelPath = new google.maps.Polyline({
  //       path: pathCoordinates,
  //       geodesic: true,
  //       strokeColor: '#FF0000', // Red color
  //       strokeOpacity: 1.0,
  //       strokeWeight: 4, // Line thickness
  //     });

  //     travelPath.setMap(map); // Add line to map
  //     this.isSpinning = false;
  //   }
  // }
  // apiKey = 'AIzaSyA1EJJ0RMDQwzsDd00Oziy1pytYn_Ozi-g';
  apiKey = 'AIzaSyBOL8XUOxJicHzlQRGi27Wdn5M3zazFKTU';

  setLocation() {
    const technician = this.technician;

    if (!technician || technician.length === 0) {
      this.message.error('No technician location data available.', '');
      return;
    }

    const locations = technician
      .map((loc: any) => ({
        name: loc.TECHNICIAN_NAME,
        lat: parseFloat(loc.LOCATION_LATITUDE),
        lng: parseFloat(loc.LOCATION_LONG),
        locationName: `Location ID: ${loc._id}`,
        dateTime: new Date(loc.createdAt).toLocaleString(),
      }))
      .filter((loc: any) => !isNaN(loc.lat) && !isNaN(loc.lng));

    if (locations.length === 0) {
      this.message.error('No valid locations found for the technician.', '');
      return;
    }

    // Initialize Google Map
    const map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      {
        center: { lat: locations[0].lat, lng: locations[0].lng },
        zoom: 14,
        mapTypeId: 'roadmap',
      }
    );

    const bounds = new google.maps.LatLngBounds();

    // Add markers
    locations.forEach((point, index) => {
      const marker = new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: `${point.name} - ${point.dateTime}`,
        icon: {
          url:
            index === 0
              ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' // Start
              : index === locations.length - 1
                ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' // End
                : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Waypoints
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      bounds.extend(marker.getPosition());

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-size: 14px;">
            <strong>Technician:</strong> ${point.name}<br>
            <strong>Location:</strong> ${point.locationName}<br>
            <strong>Date & Time:</strong> ${point.dateTime}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      this.getNearestRoad(map, point);
    });

    // Fit Map to Show All Markers
    map.fitBounds(bounds);
    this.isSpinning = false;
    // Google API Key
    const googleApiKey = this.apiKey; // Replace with your API key
    const routeApiUrl = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${googleApiKey}`;

    // Process waypoints in batches of 25
    const MAX_WAYPOINTS = 25;
    const routeSegments: any = [];

    for (let i = 0; i < locations.length; i += MAX_WAYPOINTS) {
      const segment = locations.slice(i, i + MAX_WAYPOINTS);
      routeSegments.push(segment);
    }

    // Function to fetch route and draw polylines
    const fetchAndDrawRoute = (segment: any, index: number) => {
      const origin = {
        latLng: { latitude: segment[0].lat, longitude: segment[0].lng },
      };
      const destination = {
        latLng: {
          latitude: segment[segment.length - 1].lat,
          longitude: segment[segment.length - 1].lng,
        },
      };
      const intermediates = segment.slice(1, -1).map((point: any) => ({
        location: { latLng: { latitude: point.lat, longitude: point.lng } },
      }));

      const requestBody = {
        origin: { location: origin },
        destination: { location: destination },
        intermediates: intermediates,
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
        computeAlternativeRoutes: false,
        polylineEncoding: 'ENCODED_POLYLINE',
      };

      fetch(routeApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.routes || data.routes.length === 0) {
            this.message.error(
              `No valid route found for segment ${index + 1}.`,
              ''
            );
            return;
          }

          // Decode and draw each segment
          const polylinePoints = this.decodePolyline(
            data.routes[0].polyline.encodedPolyline
          );
          const travelPath = new google.maps.Polyline({
            path: polylinePoints,
            geodesic: true,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          travelPath.setMap(map);
        })
        .catch((error) => {
          console.error(
            `Error fetching Google Routes API for segment ${index + 1}:`,
            error
          );
          this.message.error(
            `Failed to get route for segment ${index + 1}.`,
            ''
          );
        });
    };

    // Process each segment
    routeSegments.forEach((segment, index) =>
      fetchAndDrawRoute(segment, index)
    );

  }

  // Function to decode polyline
  decodePolyline(encoded: string) {
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    const coordinates: any = [];

    while (index < len) {
      let shift = 0,
        result = 0,
        byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return coordinates;
  }
  // Function to draw a dashed polyline from the road to the technician
  drawWalkingPath(map: any, roadLocation: { lat: number; lng: number }, technician: { lat: number; lng: number }) {
    if (!map || !roadLocation || !technician) {
      console.error('Invalid map or location data');
      return;
    }
    const lineSymbol = {
      path: "M 0,-2 0,2",
      strokeOpacity: 1,
      scale: 1,
    };
    const walkingPath = new google.maps.Polyline({
      path: [
        { lat: roadLocation.lat, lng: roadLocation.lng },
        { lat: technician.lat, lng: technician.lng }
      ],

      geodesic: true,
      strokeColor: '#FF0000', // Red color for walking path
      strokeOpacity: 0, // Ensure visibility
      strokeWeight: 1,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "10px",
        },
      ],
    });

    walkingPath.setMap(map);
  }


  getNearestRoad(map: any, destination: any) {
    const apiKey = this.apiKey; // Replace with your API Key
    const roadApiUrl = `https://roads.googleapis.com/v1/nearestRoads?points=${destination.lat},${destination.lng}&key=${apiKey}`;

    fetch(roadApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (!data.snappedPoints || data.snappedPoints.length === 0) {
          // console.warn('No nearest road found for:', destination.name);
          return;
        }

        // Get snapped road point
        const roadPoint = data.snappedPoints[0].location;
        const roadLatLng = {
          lat: roadPoint.latitude,
          lng: roadPoint.longitude,
        };

        // Draw walking path from road to technician
        this.drawWalkingPath(map, roadLatLng, destination);
      })
      .catch((error) => {
        console.error('Error fetching nearest road:', error);
      });
  }
}