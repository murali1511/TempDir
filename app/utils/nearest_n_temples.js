import { ref} from "vue";
import features from "/stores/stores_geojson.js"

export const get_NearestTemples = (userLat, userLng, nos) => {
    const temples = features
    const nearestTemples = ref([]);
    // Haversine formula to calculate distance in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
     
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

 
        const updatedTemples = temples.features.map(temple => {
          const [lon, lat] = temple.geometry.coordinates;
          temple.Calc_distance = calculateDistance(userLat, userLng, lat, lon);
          // console.log(userLat, userLng, lat, lon,temple.Calc_distance)
          return temple;
        });
        
        nearestTemples.value = updatedTemples
          .sort((a, b) => a.Calc_distance - b.Calc_distance)
          .slice(1, 6);
return nearestTemples.value
    }