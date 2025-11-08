// Define the Pooja types array
const PoojaTypes = [
    ["Usha-Pooja (ഉഷാ പൂജ)", "Early Morning", "Usha Pooja is the first pooja of the day, usually conducted just before sunrise. This pooja symbolizes the awakening of the deity. The temple is cleansed and sanctified, lamps are lit, and the deity is adorned with fresh flowers and clothes."],
    ["Ethrthth-Pooja", "Morning, after Usha-Pooja", "Following Usha Pooja, Ethrthth Pooja is performed. This is a continuation of the early morning rituals, where the deity is further honored and offerings are made. This pooja signifies the deity's full awakening and readiness to engage with the devotees."],
    ["Pantheerati-Pooja", "Early Morning, around 6:00 AM", "This pooja is performed in the early hours of the day and is considered one of the significant rituals in Kerala temples. The deity is offered special food items, often including rice, fruits, and sweets."],
    ["Uccha-Pooja", "Midday or Noon", "This pooja is conducted during the middle of the day, usually around 12:00 PM. It is considered the main worship of the day, where the deity is offered elaborate naivedyam (food offerings), and special prayers are recited."],
    ["Athazha-Pooja", "Evening or Night", "Athazha Pooja is the last pooja of the day, performed in the evening or night, time after sunset. This pooja symbolizes the deity's preparation for rest. The deity is offered the final meal of the day, typically consisting of rice, fruits, and sweets."]
  ];
  
// Define offers and vazipadu English
const OffersItems_en= 
{ "Bhagavathi" :[
  { name: "Neyamrithu", cost: 10, additionalInfo: "" },
  { name: "Thenga muttu", cost: 10, additionalInfo: "- should bring coconut" },
  { name: "Thulabaram", cost: 10, additionalInfo: "" },
  { name: "Archana", cost: 15, additionalInfo: "" },
  { name: "Enna vilakku", cost: 15, additionalInfo: " - Should bring pure Oil <p>- Bring thri " },
  { name: "Ney vilakku", cost: 20, additionalInfo: "" },
  { name: "Thrmadhuram", cost: 20, additionalInfo: "" },
  { name: "Malar nivedhyam", cost: 20, additionalInfo: "" },
  { name: "Kumkumarchana", cost: 25, additionalInfo: "" },
  { name: "Mala pooja", cost: 25, additionalInfo: "" },
  { name: "Auto, two wheeler pooja", cost: 25, additionalInfo: "" },
  { name: "Pushpanjali", cost: 30, additionalInfo: "" },
  { name: "Vellanivedhyam", cost: 30, additionalInfo: "" },
  { name: "Panapayasam", cost: 30, additionalInfo: "" },
  { name: "Suktha pushpanjali", cost: 30, additionalInfo: "" },
  { name: "Kootu payasam", cost: 30, additionalInfo: "" },
  { name: "Raktha pushpanjali", cost: 40, additionalInfo: "" },
  { name: "Sahasranama archana", cost: 40, additionalInfo: "" },
  { name: "Thechimala", cost: 40, additionalInfo: "" },
  { name: "Pattu charthal", cost: 50, additionalInfo: "" },
  { name: "Kettunira", cost: 50, additionalInfo: "" },
  { name: "Chevi, Kannu, Kay", cost: 50, additionalInfo: "" },
  { name: "Ganapathihomam", cost: 100, additionalInfo: "" },
  { name: "Vidhyarambham", cost: 100, additionalInfo: "" },
  { name: "Neypayasam", cost: 100, additionalInfo: "" },
  { name: "Vilakku oppikal", cost: 100, additionalInfo: "" },
  { name: "Manjapodiyattam", cost: 100, additionalInfo: "" },
  { name: "Pizhinja payasam", cost: 100, additionalInfo: "" },
  { name: "Still photo", cost: 100, additionalInfo: "" },
  { name: "Car, jeep pooja", cost: 100, additionalInfo: "" },
  { name: "Ada nivedhyam", cost: 125, additionalInfo: "" },
  { name: "Undamala", cost: 150, additionalInfo: "" },
  { name: "Iratti payasam (small)", cost: 150, additionalInfo: "" },
  { name: "Dheeparadhana", cost: 150, additionalInfo: "" },
  { name: "Ennayattam", cost: 150, additionalInfo: "" },
  { name: "Bus, lorry pooja", cost: 150, additionalInfo: "" },
  { name: "Swayamvara pushpanjali", cost: 200, additionalInfo: "" },
  { name: "Appam", cost: 200, additionalInfo: "" },
  { name: "Choroonu", cost: 200, additionalInfo: "" },
  { name: "Nakshathra pooja", cost: 250, additionalInfo: "" },
  { name: "Iratti payasam (large)", cost: 300, additionalInfo: "" },
  { name: "Ashtadhravya ganapathihomam", cost: 400, additionalInfo: "" },
  { name: "Oru nerathe pooja", cost: 400, additionalInfo: "" },
  { name: "Niramala", cost: 500, additionalInfo: "" },
  { name: "Chova vilakku", cost: 500, additionalInfo: "" },
  { name: "Iratti payasam (pizhinjath)", cost: 500, additionalInfo: "" },
  { name: "Saraswathi pooja", cost: 500, additionalInfo: "" },
  { name: "Video shooting", cost: 500, additionalInfo: "" },
  { name: "Pattu, Thali samarpanam (Silver)", cost: 500, additionalInfo: "" },
  { name: "Special archana", cost: 750, additionalInfo: "" },
  { name: "Bhagavath seva", cost: 1000, additionalInfo: "" },
  { name: "Dheepasthambam", cost: 1000, additionalInfo: "" },
  { name: "Pattu, Thali samarpanam (Gold)", cost: 1000, additionalInfo: "" },
  { name: "Sathyam chollal", cost: 2000, additionalInfo: "" },
  { name: "Oru divasathe pooja", cost: 2500, additionalInfo: "" },
  { name: "Visheshal pooja", cost: 5000, additionalInfo: "" },
  { name: "Chuttu vilakku", cost: 6000, additionalInfo: "" },
  { name: "Veliya vatalam payasam", cost: 40000, additionalInfo: "" },
],
 "Shiva" :[
  { name: "Neyamrithu", cost: 10, additionalInfo: "" },
  { name: "Thenga muttu", cost: 10, additionalInfo: "should bring coconut" },
  { name: "Thulabaram", cost: 10, additionalInfo: "" },
  { name: "Archana", cost: 15, additionalInfo: "" },
  { name: "Enna vilakku", cost: 15, additionalInfo: "" },
  { name: "Ney vilakku", cost: 20, additionalInfo: "" },
  { name: "Thrmadhuram", cost: 20, additionalInfo: "" },
],
"Vishnu" :[
  { name: "Neyamrithu", cost: 10, additionalInfo: "" },
  { name: "Thulabaram", cost: 10, additionalInfo: "" },
  { name: "Archana", cost: 15, additionalInfo: "" },
  { name: "Enna vilakku", cost: 15, additionalInfo: "" },
  { name: "Ney vilakku", cost: 20, additionalInfo: "" },
  { name: "Thrmadhuram", cost: 20, additionalInfo: "" },
  { name: "Malar nivedhyam", cost: 20, additionalInfo: "" },
  { name: "Kumkumarchana", cost: 25, additionalInfo: "" },
  { name: "Mala pooja", cost: 25, additionalInfo: "" },
  ],
}
// Define offers and vazipadu Malayalam
const OffersItems_ml= 
{ "Bhagavathi" :[
      {
        "name": "നെയ്യമൃത്",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "തേങ്ങ മുട്ട്",
        "cost": 10,
        "additionalInfo": "- തേങ്ങ കൊണ്ടുവരണം"
      },
      {
        "name": "തുലാഭാരം",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "അർച്ചന",
        "cost": 15,
        "additionalInfo": ""
      },
      {
        "name": "എണ്ണവിളക്ക്",
        "cost": 15,
        "additionalInfo": "- ശുദ്ധമായ എണ്ണ കൊണ്ടുവരണം"
      },
      {
        "name": "നെയ്വിളക്ക്",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "തൃമധുരം",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "മാലർ നിവേദ്യം",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "കുമകുമാർച്ചന",
        "cost": 25,
        "additionalInfo": ""
      },
      {
        "name": "മാല പൂജ",
        "cost": 25,
        "additionalInfo": ""
      }
    ],
    "Shiva": [
      {
        "name": "നെയ്മൃത്",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "തേങ്ങ മുട്ട്",
        "cost": 10,
        "additionalInfo": "തേങ്ങ കൊണ്ടുവരണം"
      },
      {
        "name": "തുലാഭാരം",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "അർച്ചന",
        "cost": 15,
        "additionalInfo": ""
      },
      {
        "name": "എണ്ണവിളക്ക്",
        "cost": 15,
        "additionalInfo": ""
      },
      {
        "name": "നെയ്വിളക്ക്",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "തൃമധുരം",
        "cost": 20,
        "additionalInfo": ""
      }
    ],
    "Vishnu": [
      {
        "name": "നെയ്മൃത്",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "തുലാഭാരം",
        "cost": 10,
        "additionalInfo": ""
      },
      {
        "name": "അർച്ചന",
        "cost": 15,
        "additionalInfo": ""
      },
      {
        "name": "എണ്ണവിളക്ക്",
        "cost": 15,
        "additionalInfo": ""
      },
      {
        "name": "നെയ്വിളക്ക്",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "തൃമധുരം",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "മാലർ നിവേദ്യം",
        "cost": 20,
        "additionalInfo": ""
      },
      {
        "name": "കുമകുമാർച്ചന",
        "cost": 25,
        "additionalInfo": ""
      },
      {
        "name": "മാല പൂജ",
        "cost": 25,
        "additionalInfo": ""
      }
    ]
  
}

const TempleComplex = 
 [{"type":"main","name":"Durga","deity":"Durga","subdeity":["Bhagavati","Gulikan"]},
  {"type":"sub","name":"Shiva","deity":"Shiva","subdeity":["Shiva"]},
  {"type":"sub","name":"Vishnu","deity":"Vishnu","subdeity":["Ayyappa"]}
 ]

 const ethiquttes = [['According to dress code wearing shirts, trousers, vests, pyjamas, lungis (printed dhotis), pants, jeans, footwear etc. is forbidden. Hence ladies can wear saris and skirts, blouses and churidar while the men can wear plain white or cream dhoti. Children are allowed to wear shorts but without covering their upper body. ', 'required', 'large'],
            ['Be always clean while visiting the temple and also keep temple premises and surroundings clean', 'preferred', 'small'],
            ['Be always clean while visiting the temple and also keep temple premises and surroundings clean', 'preferred', 'small'],
            ['Accept “Prasad:” blessed food (always vegetarian) from the priests, which is offered to the deities.', 'required', 'small'],
            ['Anything the priest gives you should be accepted with your right hand. Avoid taking or giving anything with the left hand.', 'desired', 'small'],
            ['Avoid touching shrines or statues. In Hindu faith, only priests are permitted to touch the statues.', 'preferred', 'small'],
            ['Hindu temples are sacred places to people of Hindu faith, behave calmly and respectfully at all times.', 'required', 'small'],
            ['Temple grounds are drug free, tobacco free and alcohol free zone', 'desired', 'small'],
            ['Presenting offerings to the temple deities is a form of respect. Offerings could be flowers, fruit, clothes or monetary donation', 'required', 'large'],
            ['Removing shoes sandals, or any other footwear shows respect for the temple and the deity statues within and is mandatory. Socks can be worn inside.', 'desired', 'large'],
            ['An array of deities and statues arranged around the temple walls. Begin with the deity on your left, continue to walk through the temple in a clockwise direction, pausing before each deity you come across.', 'preferred', 'small'],
            ['Accept “Prasad:” blessed food (always vegetarian) from the priests, which is offered to the deities.', 'required', 'large'],
            ['Anything the priest gives you should be accepted with your right hand. Avoid taking or giving anything with the left hand', 'required', 'large'],
            ['Avoid touching shrines or statues. In Hindu faith, only priests are permitted to touch the statues.', 'required', 'large']]

   const deities = {
     data_en: [
       { value: "Bhagavathi", title: "Bhagavathi" },
       { value: "Shiva", title: "Shiva" },
       { value: "Vishnu", title: "Vishnu" },
     ],
     data_ml: [
       { value: "Bhagavathi", title: "ഭഗവതി " },
       { value: "Shiva", title: "ശിവ " },
       { value: "Vishnu", title: "വിഷ്ണു " },
     ],
   };

  // useAuthState hook
  export const useAuthState = () =>
    useState("LoginState", () => {
      return {
        userid: "mvk1511",
        password: "mvk123",
      };
    });
  
  // usePoojaTypes hook
  export const usePoojaTypes = () =>
    useState("getPoojaType", () => {
      return PoojaTypes;
    });
  
  // useCounter hook
  export const useCounter = (incr) =>
    useState("counter", () => 100 + incr);
  
  // useColor hook
  export const useColor = () =>
    useState("color", () => "pink");
  //useOffers
  export const useOffers_ml = () =>
    useState("offers_ml", () => {return OffersItems_ml});
  export const useOffers_en = () =>
    useState("offers_en", () => {return OffersItems_en});

  export const useTempleComplex = () =>
    useState("TempleComplex", () => {return TempleComplex});
  
  export const useEthiquttes = () =>
    useState("Templeethiquttes", () => {return ethiquttes});
  
  export const useDeities = () =>
    useState("Deities", () => {return deities});