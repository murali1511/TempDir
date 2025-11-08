// composables/useAuth.js
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const user = ref(null);

export default function useAuth() {
  const auth = getAuth();

  onMounted(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        user.value = authUser; // Set the user
      } else {
        user.value = null; // No user is logged in
      }
    });
  });

  return { user };
}
