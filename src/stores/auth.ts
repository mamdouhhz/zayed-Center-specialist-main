import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  businessUnitId: string;
  email: string;
  id: string;
  role: string;
  token: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    JwtService.saveToken(user.value.token);
    JwtService.saveUser(user.value);
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
    JwtService.destroyUser();
  }

  async function login(credentials: User) {
    try {
      const { data } = await ApiService.post("users/login", credentials);
      setAuth(data);
      JwtService.saveToken(data.token);
      return data;
    } catch (error: any) {
      setError(error);
    }
  }

  async function getPermissions(role: string) {
    try {
      ApiService.setHeader();
      const response = await ApiService.vueInstance.axios.get(
        `${import.meta.env.VITE_APP_AUTH_BASE_URL}roles/${role}/entities`
      );
      reformatePermissionsData(response.data);
      return response;
    } catch (error: any) {
      setError(error);
    }
  }
  function reformatePermissionsData(
    permissions: any[]
  ): { action: string; subject: string }[] {
    let formattedPermissions: { action: string; subject: string }[] = [
      { action: "list", subject: "public" },
      { action: "list", subject: "Auth" },
    ];
    /* FORMATE PERMISSION DATA TO CASEL FORMATE */
    permissions.forEach((module: any) => {
      module.permissions.forEach((action: string) => {
        formattedPermissions.push({ action, subject: module.name });
      });
    });
    localStorage.setItem("permissions", JSON.stringify(formattedPermissions));
    // TODO: update ability
    // this.$ability.update(permissions);
    return formattedPermissions;
  }

  function logout() {
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }
  function verifyAuth() {
    if (JwtService.getUser()) {
      ApiService.setHeader();
      setAuth(JwtService.getUser());
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    getPermissions,
    verifyAuth,
    reformatePermissionsData,
  };
});
