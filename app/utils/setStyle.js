// composables/setStyle.js
import { ref, computed } from "vue";

// const { hovered_comp, update_hovered_comp, colorScheme } = dbStore();
export const setStyle = (lang,mobile,style_t_en,style_t_ml,style_f_en,style_f_ml) => {
      if (mobile) {
        return lang === "en" ? style_t_en : style_t_ml
      } else {
        return lang === "en" ? style_f_en : style_f_ml
      }
}
