// composables/dbStore.js
export const dbStore = () => {
  const hovered_comp = useState("hovered_comp", () => [false,false]); // Initialize

  const update_hovered_comp = (id,newvalue) => {
    hovered_comp[id].value = newvalue; // Correct way to update a reactive state
  };

  // Correctly define colorScheme state
  // const colorScheme = useState("colorScheme", () => ({
  //   bg: "#f2dfa7",
  //   font: "#282828",
  //   bg_r: "#282828",
  //   font_r: "#f2dfa7",
  // }));
  const colorScheme = useState("colorScheme", () => ([
    "#f2dfa7","#282828",
  ]));

  const role = useState("role", () => 'devotee');
  const set_role = (newrole) => { role.value = newrole};
  return {

    hovered_comp,
    update_hovered_comp,
    colorScheme,role , set_role
  };
};
