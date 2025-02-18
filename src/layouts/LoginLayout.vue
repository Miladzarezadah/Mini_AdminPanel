<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Notify, useQuasar } from 'quasar';
/////////////////////Defualt
const router = useRouter();
const $q = useQuasar();
const currentUser = ref(null);
////////////////////Switch Form
const tab = ref('Login');
/////////////////////Login
const login = ref({
  username: ref(''),
  password: ref(''),
});
const visibilityPasswordLogin = ref(false);
const passwordLoginType = ref('password');
/////////////////////Sign Up
const signUp = ref({
  name: ref(''),
  username: ref(''),
  email: ref(''),
  password: ref(''),
});
const visibilityPasswordSignUp = ref(false);
const passwordSignUpType = ref('password');
/////////////////////Users
const users = ref([]);

// Get Users From Node.JS(Server)
const fetchUsers = async () => {
  try {
    const response = api.get('/users');
    users.value = (await response).data;
  } catch (error) {
    console.log(error);
  }
};

// Function For Login
function loginFunction() {
  const Userdata = users.value.find(
    (u) => u.username == login.value.username && u.password == login.value.password,
  );
  if (Userdata) {
    localStorage.setItem('id', Userdata.id);
    currentUser.value = Userdata;
    const savedTheme = localStorage.getItem(`theme_${currentUser.value.id}`);
    $q.dark.set(savedTheme === 'true');
    Notify.create({
      type: 'positive',
      message: 'You have successfully logged in',
    });
    router.push('/');
  } else {
    Notify.create({
      type: 'negative',
      message: 'Please enter the correct username and password',
    });
  }
}
// Function For Sign Up
async function signUpFunction() {
  try {
    const response = await api.post('/signup', {
      name: signUp.value.name,
      username: signUp.value.username,
      password: signUp.value.password,
      email: signUp.value.email,
    });

    if (response.data.success) {
      localStorage.setItem('id', response.data.token);
      Notify.create({
        type: 'positive',
        message: 'The account was created successfully',
      });
      router.push('/');
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);
    Notify.create({
      type: 'negative',
      message: 'This username has already been created',
    });
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding class="flex flex-center">
        <div class="Forms bg-white">
          <q-tabs v-model="tab" class="text-amber q-mb-lg" dense inline-label>
            <q-tab name="Login" icon="login" label="Login" />
            <q-tab name="SignUp" icon="person_add" label="SignUp" />
          </q-tabs>
          <q-form @submit="loginFunction" class="LoginForm q-mt-xl" v-if="tab == 'Login'">
            <div class="q-gutter-md">
              <q-input
                v-model="login.username"
                type="text"
                label="Username"
                standout="bg-primary text-white"
              />
              <q-input
                v-model="login.password"
                :type="passwordLoginType"
                label="Password"
                standout="bg-primary text-white"
                :rules="[(val) => val.length >= 5 || 'Please use minimum 5 characters']"
              >
                <template v-slot:append>
                  <q-icon
                    name="visibility"
                    class="cursor-pointer"
                    @click="((passwordLoginType = 'text'), (visibilityPasswordLogin = true))"
                    v-if="visibilityPasswordLogin == false"
                  />
                  <q-icon
                    name="visibility_off"
                    class="cursor-pointer"
                    @click="((passwordLoginType = 'password'), (visibilityPasswordLogin = false))"
                    v-else
                  />
                </template>
              </q-input>
            </div>
            <div class="q-mt-lg">
              <q-btn label="Login" type="submit" class="full-width" color="primary" />
            </div>
          </q-form>
          <q-form @submit="signUpFunction" class="SignUpForm" v-if="tab == 'SignUp'">
            <div>
              <div class="q-gutter-md q-mb-md">
                <q-input
                  v-model="signUp.name"
                  type="text"
                  label="Name"
                  standout="bg-primary text-white"
                />
                <q-input
                  v-model="signUp.username"
                  type="text"
                  label="Username"
                  standout="bg-primary text-white"
                />
              </div>
              <q-input
                v-model="signUp.email"
                type="text"
                label="Email"
                standout="bg-primary text-white"
                :rules="[(val, rules) => rules.email(val) || 'Please enter a valid email address']"
              />
              <q-input
                v-model="signUp.password"
                :type="passwordLoginType"
                label="Password:"
                standout="bg-primary text-white"
                :rules="[(val) => val.length >= 5 || 'Please use minimum 5 characters']"
              >
                <template v-slot:append>
                  <q-icon
                    name="visibility"
                    class="cursor-pointer"
                    @click="((passwordLoginType = 'text'), (visibilityPasswordSignUp = true))"
                    v-if="visibilityPasswordSignUp == false"
                  />
                  <q-icon
                    name="visibility_off"
                    class="cursor-pointer"
                    @click="((passwordSignUpType = 'password'), (visibilityPasswordSignUp = false))"
                    v-else
                  />
                </template>
              </q-input>
            </div>
            <div class="q-mt-sm">
              <q-btn label="Create User" type="submit" class="full-width" color="primary" />
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
.Forms {
  border: 1px solid black;
  border-radius: 5px;
  padding: 10px;
  width: 300px;
}
.SignUpForm {
  margin-top: 32px;
}
</style>
