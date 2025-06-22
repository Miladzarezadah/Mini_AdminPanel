<script setup>
import { Notify, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
/////////////////////Default
const $q = useQuasar();
const router = useRouter();
const isShowData = ref(false);
const isEditData = ref(false);
/////////////////////Change User Daat
const visibilityPassword = ref(false);
const visibilityNewPassword = ref(false);
const passwordType = ref('password');
const newPasswordType = ref('password');
const editUser = ref({
  name: '',
  username: '',
  email: '',
  cpassword: '',
  newpassword: '',
});

/////////////////////Users
const users = ref([]);
const User = ref({});

// Get Users From Node.JS(Server)
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
    const activeUser = localStorage.getItem('id');
    User.value = users.value.find((u) => u.id == activeUser);
    editUser.value = { ...User.value };
  } catch (error) {
    console.log(error);
  }
};
// Log Out And Disable dark mode
function logoutFunction() {
  localStorage.removeItem('id');
  $q.dark.set(false);
  router.push('/login');
}
// Active Dark Modde
function darkTheme() {
  $q.dark.set(true);
  localStorage.setItem(`theme_${User.value.id}`, 'true');
}
// Disable Dark Modde
function whiteTheme() {
  $q.dark.set(false);
  localStorage.setItem(`theme_${User.value.id}`, 'false');
}
// Edit User Data
async function changeUserData() {
  try {
    const newData = ref({});
    if (editUser.value.cpassword && editUser.value.newpassword) {
      if (editUser.value.cpassword == User.value.password) {
        newData.value = {
          id: User.value.id,
          name: editUser.value.name,
          username: editUser.value.username,
          password: editUser.value.newpassword,
          email: editUser.value.email,
        };
      } else {
        Notify.create({
          type: 'negative',
          message: 'Please enter the correct password',
        });
      }
    } else {
      newData.value = {
        id: User.value.id,
        name: editUser.value.name,
        usernname: editUser.value.username,
        password: User.value.password,
        email: editUser.value.email,
      };
    }
    await api.post('/changeUserData', newData.value);
    isEditData.value = false;
    Notify.create({
      type: 'positive',
      message: 'Information changed successfully',
    });
    isShowData.value = false;
    Object.assign(User.value, newData.value);
  } catch (error) {
    console.log(error);
  }
}
// Hide Inputs for change Data
function closeEditData() {
  editUser.value = { ...User.value };
  isEditData.value = false;
}

onMounted(() => {
  fetchUsers();
});
const hoverClass = computed(() => {
  return !isEditData.value ? ($q.dark.mode ? 'hoverDark' : 'hoverWhite') : '';
});
</script>
<template>
  <q-page class="flex flex-center" padding>
    <div class="shadow-10 q-pa-md bodySettings">
      <div v-if="!isShowData">
        <div class="shadow-2" style="border-radius: 10px">
          <q-banner class="q-py-md UserDetails cursor-pointer" :class="!$q.dark.mode ? 'hoverWhite' : 'hoverDark'"
            @click="isShowData = true">
            <div class="row justify-between items-center">
              <div>
                <div class="row items-center q-gutter-x-xs">
                  <q-icon name="person" size="md" />
                  <span style="font-size: 20px">User Info</span>
                </div>
                <caption class="text-grey-5 q-mt-sm" style="font-size: 13px">
                  Email,Username,Password
                </caption>
              </div>
              <q-icon name="chevron_right" size="sm" />
            </div>
          </q-banner>
        </div>
        <div class="q-mt-md">
          <q-banner class="q-py-md shadow-1">
            <div class="row justify-between items-center">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="palette" size="sm" />
                <span>Change Theme:</span>
              </div>
              <div class="row">
                <div class="darkTheme" @click="darkTheme" v-if="$q.dark.mode == false"></div>
                <div class="whiteTheme" @click="whiteTheme" v-else></div>
              </div>
            </div>
          </q-banner>
          <q-banner class="q-py-md shadow-1 cursor-pointer" :class="!$q.dark.mode ? 'hoverWhite' : 'hoverDark'">
            <div class="row items-center q-gutter-x-sm" @click="logoutFunction">
              <q-icon name="logout" color="negative" size="sm" />
              <span class="text-negative" style="font-size: 17px">LogOut</span>
            </div>
          </q-banner>
        </div>
      </div>
      <div v-else>
        <div class="row items-center">
          <q-btn color="primary" round dense flat icon="chevron_left" @click="
            isShowData = false;
          isEditData = false;
          " />
          <span style="font-size: 20px">Change User Data</span>
        </div>
        <q-banner class="q-py-md shadow-1 q-mt-lg cursor-pointer" style="border-radius: 5px" @click="isEditData = true"
          :class="hoverClass">
          <div class="column justify-center">
            <div class="row justify-between items-center" :class="isEditData ? 'q-mb-md' : ''">
              <div class="row items-center q-gutter-x-xs">
                <q-icon name="edit" size="sm" color="primary" />
                <span>Change Data</span>
              </div>
              <div>
                <q-btn color="primary" flat dense round icon="keyboard_arrow_up" @click.stop="closeEditData"
                  v-if="isEditData" />
                <q-btn color="primary" flat dense round icon="keyboard_arrow_down" @click="isEditData = true" v-else />
              </div>
            </div>
            <div v-if="isEditData">
              <div class="row justify-around q-gutter-sm q-mb-sm">
                <q-input v-model="editUser.name" type="text" label="Name" stack-label standout="bg-primary text-white"
                  style="width: 230px" />
                <q-input v-model="editUser.username" type="text" label="Username" stack-label
                  standout="bg-primary text-white" style="width: 230px" />
              </div>
              <div class="row justify-around">
                <q-input v-model="editUser.cpassword" :type="passwordType" label="Password" stack-label
                  standout="bg-primary text-white" style="width: 230px"
                  :rules="[(val) => val.length >= 5 || 'Please use minimum 5 characters']">
                  <template v-slot:append>
                    <q-icon name="visibility" class="cursor-pointer"
                      @click="((passwordType = 'text'), (visibilityPassword = true))"
                      v-if="visibilityPassword == false" />
                    <q-icon name="visibility_off" class="cursor-pointer"
                      @click="((passwordType = 'password'), (visibilityPassword = false))" v-else />
                  </template>
                </q-input>
                <q-input v-model="editUser.newpassword" :type="newPasswordType" label="NewPassword" stack-label
                  standout="bg-primary text-white" style="width: 230px"
                  :rules="[(val) => val.length >= 5 || 'Please use minimum 5 characters']">
                  <template v-slot:append>
                    <q-icon name="visibility" class="cursor-pointer"
                      @click="((newPasswordType = 'text'), (visibilityNewPassword = true))"
                      v-if="visibilityNewPassword == false" />
                    <q-icon name="visibility_off" class="cursor-pointer"
                      @click="((newPasswordType = 'password'), (visibilityNewPassword = false))" v-else />
                  </template>
                </q-input>
              </div>
              <div class="row justify-center">
                <q-input v-model="editUser.email" type="text" label="Email" stack-label standout="bg-primary text-white"
                  style="width: 230px" :rules="[
                    (val, rules) => rules.email(val) || 'Please enter a valid email address',
                  ]" />
              </div>
              <div class="row justify-end">
                <q-btn color="primary" icon="save" label="save" @click="changeUserData" />
              </div>
            </div>
          </div>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.bodySettings {
  width: 80vw;
  border-radius: 5px;
}

.UserDetails {
  border-radius: 10px;
}

.hoverWhite:hover {
  background: rgb(247, 247, 247);
}

.hoverDark:hover {
  background: rgb(22, 22, 22);
}

.darkTheme {
  width: 20px;
  height: 20px;
  background: #000;
  border-radius: 50%;
  cursor: pointer;
}

.whiteTheme {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #000;
}

@media screen and (min-width: 768px) {
  .bodySettings {
    width: 40vw;
  }
}
</style>
