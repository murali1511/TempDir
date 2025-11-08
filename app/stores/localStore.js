import { defineStore } from "pinia";
import { ref } from "vue";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { useFirestore } from "vuefire";

export const useLocalStore = defineStore(
  "localStore",
  () => {
    // State
    const db = useFirestore(); // Initialize Firestore
    const templeID = ref("");
    const name = ref("Loading...");
    const carouselDetail = ref({});
    const about = ref("");
    const history = ref("");
    const mythology = ref("");
    const events = ref([]);
    const deities = ref({});
    const locale = ref("en");
    const pooja_schedule = ref({});
    const pooja_short = ref("");
    const safety_health = ref({});
    const safety_health_short = ref("");
    const etiquette = ref({ return: null });
    const mantras = ref([]);
    const temple_offers = ref([]);
    const offer_deities = ref([]);
    const how_to_reach = ref({});
    const temple_logo = ref("");
    const attractions = ref([]);
    const administrations = ref({});
    const culturals = ref({});
    const facilities = ref({});
    const specialpoojas = ref({});
    const near_facilities = ref({});
    const architectures = ref({});
    const TIDs = ref([]);
    const RunOnce = ref(false);
    const loading = ref(true); // New loading state
    const coordinate = ref([]);
    const open_close =ref([])
    const  VisitPreference =ref({})
    const  Address = ref("")
    const TemplesSource = ref("")
    const pageType = ref("home")

    // ############ Start Actions Fetch from firebase - Temple name using TID
    const Fetch_Temple = async () => {
      loading.value = true; // Start loading

      try {
        const eventsCollection = collection(db, "temples");
        const q = query(eventsCollection, where("TID", "==", templeID.value));
        const querySnapshot = await getDocs(q);

        // fetching Temple name
        name.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().name || "No Data"
            : "Not Found";
        // fetching Temple logo
        temple_logo.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().logo || "no_logo"
            : "no_logo";

        // fetching about Temple
        about.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().about || "No content"
            : "Not Found";

        // fetching Temple history
        history.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().history || "No content"
            : "Not Found";

        // fetching Temple mythology
        mythology.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().mythology || "No content"
            : "Not Found";

        // fetching about information for Temple
        carouselDetail.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().carousel_detail || {}
            : {};

        // fetching deities information for Temple
        deities.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().deities || {}
            : {};
     
         // fetching deities information for Temple
        deities.value =
          querySnapshot.docs.length > 0
            ? querySnapshot.docs[0].data().deities || {}
            : {};
       // fetching deities information for Temple coordinate
       coordinate.value =
       querySnapshot.docs.length > 0
         ? querySnapshot.docs[0].data().coordinate || {}
         : {};
   // fetching deities information for Temple open/close
         open_close.value =
         querySnapshot.docs.length > 0
           ? querySnapshot.docs[0].data().pooja_schedule || {}
           : {};
   // fetching deities information for Temple open/close
 VisitPreference.value =
   querySnapshot.docs.length > 0
     ? querySnapshot.docs[0].data().VisitPreference || {}
     : {};

     Address.value =
     querySnapshot.docs.length > 0
       ? querySnapshot.docs[0].data().address || {}
       : {};

        Fetch_Pooja_Schedule(locale.value);
        Fetch_Events_TID(locale.value);
        Fetch_Pooja_Schedule(locale.value);
        Fetch_Safety_Health(locale.value);
        Fetch_Etiquette(locale.value);
        Fetch_Mantra(locale.value);
        Fetch_Offers(locale.value);
        Fetch_How_to_reach(locale.value);
        Fetch_Attractions(locale.value);
        Fetch_Administrations(locale.value);
        Fetch_Culturals(locale.value);
        Fetch_Facilities(locale.value);
        Fetch_Specialpooja(locale.value);
        Fetch_Near_facilities(locale.value);
        Fetch_Architecture(locale.value);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        name.value = "Error";
      } finally {
        loading.value = false; // Stop loading
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Pooja Schedules from firebase - Temple name using TID
    const Fetch_TIDs = async (locale) => {
      try {
        const TIDCollection = collection(db, "temples");
        const q = query(TIDCollection);
        const TIDSnapshot = await getDocs(q);

        // Clear the existing TIDs before fetching new ones
        TIDs.value = [];

        // Fetching Temple names
        for (const doc of TIDSnapshot.docs) {
          // Correct iteration over snapshot
          TIDs.value.push({
            TID: doc.data().TID,
            name_en: doc.data().name.en,
            name_ml: doc.data().name.ml,
          }); // Access data correctly
        }
        console.log("TIDs.value", TIDs.value);
      } catch (e) {
        console.error("Error fetching documents: ", e);
        name.value = "Error";
      } finally {
        // Optional cleanup if necessary
      }
    };

    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Pooja Schedules from firebase - Temple name using TID
    const Fetch_Pooja_Schedule = async (locale) => {
      try {
        const poojaCollection = collection(db, `pooja_schedule_${locale}`);
        const poojaquery = query(
          poojaCollection,
          where("TID", "==", templeID.value)
        );
        const PoojaquerySnapshot = await getDocs(poojaquery);

        // fetching Temple name
        pooja_schedule.value =
          PoojaquerySnapshot.docs.length > 0
            ? PoojaquerySnapshot.docs[0].data().schedule || "No Name"
            : "Not Found";
        pooja_short.value =
          PoojaquerySnapshot.docs.length > 0
            ? PoojaquerySnapshot.docs[0].data().short_schedule || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
        name.value = "Error";
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch safety and Health from firebase - Temple name using TID
    const Fetch_Safety_Health = async (locale) => {
      try {
        const safetyCollection = collection(db, `safety_health_${locale}`);
        const safetyquery = query(
          safetyCollection,
          where("TID", "==", templeID.value)
        );
        const safetyquerySnapshot = await getDocs(safetyquery);

        // fetching Temple name
        safety_health.value =
          safetyquerySnapshot.docs.length > 0
            ? safetyquerySnapshot.docs[0].data().entries || "No Name"
            : "Not Found";

        safety_health_short.value =
          safetyquerySnapshot.docs.length > 0
            ? safetyquerySnapshot.docs[0].data().shortnote || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
        name.value = "Error";
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Etiqutte from firebase - Temple name using TID
    const Fetch_Etiquette = async (locale) => {
      try {
        const etiquetteCollection = collection(db, `etiquette_${locale}`);
        const etiquettequery = query(
          etiquetteCollection,
          where("TID", "==", templeID.value)
        );
        const etiquettequerySnapshot = await getDocs(etiquettequery);

        // fetching Temple name
        etiquette.value =
          etiquettequerySnapshot.docs.length > 0
            ? etiquettequerySnapshot.docs[0].data().entries || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch mantra from firebase - Temple name using TID
    const Fetch_Mantra = async (locale) => {
      try {
        const mantraCollection = collection(db, `mantra_${locale}`);
        const mantraquery = query(
          mantraCollection,
          where("TID", "==", templeID.value)
        );
        const mantraquerySnapshot = await getDocs(mantraquery);

        // fetching Temple name
        mantras.value =
          mantraquerySnapshot.docs.length > 0
            ? mantraquerySnapshot.docs[0].data().entries || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch how_to_reach from firebase - Temple name using TID
    const Fetch_How_to_reach = async (locale) => {
      try {
        const reachCollection = collection(db, `how_to_reach_${locale}`);
        const reachquery = query(
          reachCollection,
          where("TID", "==", templeID.value)
        );
        const reachquerySnapshot = await getDocs(reachquery);

        // fetching Temple name
        how_to_reach.value =
          reachquerySnapshot.docs.length > 0
            ? reachquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Offers from firebase - Temple name using TID
    const Fetch_Offers = async (locale) => {
      try {
        const offersCollection = collection(db, `Temple_offers_${locale}`);
        const offersquery = query(
          offersCollection,
          where("TID", "==", templeID.value)
        );
        const offersquerySnapshot = await getDocs(offersquery);

        // fetching Temple name
        temple_offers.value =
          offersquerySnapshot.docs.length > 0
            ? offersquerySnapshot.docs[0].data().entries || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Attractions from firebase - Temple name using TID
    const Fetch_Attractions = async (locale) => {
      try {
        const attractionsCollection = collection(db, `attractions_${locale}`);
        const attractionsquery = query(
          attractionsCollection,
          where("TID", "==", templeID.value)
        );
        const attractionsquerySnapshot = await getDocs(attractionsquery);

        // fetching Temple name
        attractions.value =
          attractionsquerySnapshot.docs.length > 0
            ? attractionsquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Administrations from firebase - Temple name using TID
    const Fetch_Administrations = async (locale) => {
      try {
        const adminCollection = collection(db, `administration_${locale}`);
        const adminquery = query(
          adminCollection,
          where("TID", "==", templeID.value)
        );
        const adminquerySnapshot = await getDocs(adminquery);

        // fetching Temple name
        administrations.value =
          adminquerySnapshot.docs.length > 0
            ? adminquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Culturals from firebase - Temple name using TID
    const Fetch_Culturals = async (locale) => {
      try {
        const culturalCollection = collection(db, `culturals_${locale}`);
        const culturalquery = query(
          culturalCollection,
          where("TID", "==", templeID.value)
        );
        const culturalquerySnapshot = await getDocs(culturalquery);

        // fetching Temple name
        culturals.value =
          culturalquerySnapshot.docs.length > 0
            ? culturalquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch Facilities from firebase - Temple name using TID
    const Fetch_Facilities = async (locale) => {
      try {
        const facilityCollection = collection(db, "facilities");
        const facilityquery = query(
          facilityCollection,
          where("TID", "==", templeID.value)
        );
        const facilityquerySnapshot = await getDocs(facilityquery);

        // fetching Temple name
        facilities.value =
          facilityquerySnapshot.docs.length > 0
            ? facilityquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch specialpoojas from firebase - Temple name using TID
    const Fetch_Specialpooja = async (locale) => {
      try {
        const specialpoojaCollection = collection(db, `specialpooja_${locale}`);
        const specialpoojaquery = query(
          specialpoojaCollection,
          where("TID", "==", templeID.value)
        );
        const specialpoojaquerySnapshot = await getDocs(specialpoojaquery);

        // fetching Temple name
        specialpoojas.value =
          specialpoojaquerySnapshot.docs.length > 0
            ? specialpoojaquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch "architecture"s from firebase - Temple name using TID
    const Fetch_Architecture = async (locale) => {
      try {
        const architectureCollection = collection(db, `architecture_${locale}`);
        const architecturequery = query(
          architectureCollection,
          where("TID", "==", templeID.value)
        );
        const architecturequerySnapshot = await getDocs(architecturequery);

        // fetching Temple name
        architectures.value =
          architecturequerySnapshot.docs.length > 0
            ? architecturequerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############ Start Actions Fetch specialpoojas from firebase - Temple name using TID
    const Fetch_Near_facilities = async (locale) => {
      try {
        const near_facilityCollection = collection(
          db,
          `near_facilities_${locale}`
        );
        const near_facilityquery = query(
          near_facilityCollection,
          where("TID", "==", templeID.value)
        );
        const near_facilityquerySnapshot = await getDocs(near_facilityquery);

        // fetching Temple name
        near_facilities.value =
          near_facilityquerySnapshot.docs.length > 0
            ? near_facilityquerySnapshot.docs[0].data() || "No Name"
            : "Not Found";
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
      }
    };
    // ############## End Actions Fetch from firebase - Temple name using TID

    // ############## Start Actions Fetch from firebase - Events name using TID
    const Fetch_Events_TID = async (lang) => {
      // Function to fetch data from Firestore
      const today = Timestamp.fromDate(new Date()); // Convert JavaScript Date to Firestore Timestamp
      loading.value = true; // Start loading
      // ActiveEvents.value =null
      try {
        const eventsCollection = collection(db, `events_${lang}`);
        const q = query(
          eventsCollection,
          where("TID", "==", templeID.value),
          orderBy("date.startDate", "asc")
        );

        // Fetch all documents in the collection
        const querySnapshot = await getDocs(q);

        let data = [];
        querySnapshot.forEach((doc) => {
          const event = doc.data();

          // Convert Firestore Timestamp to a string in "YYYY-MM-DD" format
          const formattedStartDate = new Date(
            event.date.startDate.seconds * 1000
          ).toLocaleDateString("en-CA");
          const formattedEndDate = new Date(
            event.date.endDate.seconds * 1000
          ).toLocaleDateString("en-CA");

          data.push({
            eventid: event.eventID,
            name: event.title,
            start: formattedStartDate,
            end: formattedEndDate,
            ...event,
          });
        });

        // Update events
        events.value = data;
      } catch (e) {
        console.error("Error fetching documents: ", e);
      } finally {
        loading.value = false; // Stop loading
      }
    };
    // ############## End Actions Fetch from firebase - Events name using TID

    function setTempleID(newValue) {
      console.trace(
        `Old templeID.value: ${templeID.value}`,
        `New templeID.value: ${newValue}`
      );
      templeID.value = newValue;
      Fetch_Temple();
    }

    function setRunOnce(newValue) {
      RunOnce.value = true;
    }
    function setTemplesSource(newValue) {
      TemplesSource.value = newValue;
    }
    function setpageType(newValue) {
      pageType.value = newValue;
    }
    
    function setLocale(newValue) {
      locale.value = newValue;
      Fetch_Events_TID(newValue);
      Fetch_Pooja_Schedule(newValue);
      Fetch_Safety_Health(newValue);
      Fetch_Etiquette(newValue);
      Fetch_Mantra(newValue);
      Fetch_Offers(newValue);
      Fetch_How_to_reach(newValue);
      Fetch_Attractions(newValue);
      Fetch_Administrations(newValue);
      Fetch_Culturals(newValue);
      Fetch_Facilities(newValue);
      Fetch_Specialpooja(newValue), Fetch_Near_facilities(newValue);
      Fetch_Architecture(newValue);
    }
    return {
      db,
      Fetch_Temple,
      templeID,
      name,
      temple_logo,
      coordinate,
      setTempleID,
      carouselDetail,
      loading,
      about,
      history,
      mythology,
      Fetch_Events_TID,
      events,
      deities,
      locale,
      setLocale,
      Fetch_Pooja_Schedule,
      pooja_schedule,
      pooja_short,
      Fetch_Safety_Health,
      safety_health,
      safety_health_short,
      Fetch_Etiquette,
      etiquette,
      mantras,
      Fetch_Mantra,
      temple_offers,
      offer_deities,
      Fetch_Offers,
      how_to_reach,
      Fetch_How_to_reach,
      attractions,
      Fetch_Attractions,
      administrations,
      Fetch_Administrations,
      culturals,
      Fetch_Culturals,
      Fetch_Facilities,
      facilities,
      Fetch_Specialpooja,
      specialpoojas,
      Fetch_Near_facilities,
      near_facilities,
      Fetch_Architecture,
      architectures,
      TIDs,
      Fetch_TIDs,
      RunOnce,
      setRunOnce,
      open_close,
      VisitPreference,
      Address,
      TemplesSource,
      setTemplesSource,
      pageType,
      setpageType,
    };
  },
  {
    persist: true, // Enable persistence
  }
);
