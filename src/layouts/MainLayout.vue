<script setup>
import { Notify, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted } from 'vue';
// import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
/////////////////////Default
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

async function fetchUsers() {
  try {
    const response = await api.get('/users');
    const users = response.data;
    const getUserId = localStorage.getItem('id');
    const currentUser = users.find((u) => u.id == getUserId);
    if (!currentUser) {
      localStorage.removeItem('id');
      router.push('/login');
      Notify.create({
        type:'warning',
        message:'Your token has expired'
      })
    }
  } catch (error) {
    console.log(error);
  }
}

// Log Out And Disable dark mode
function logoutFunction() {
  localStorage.removeItem('id');
  $q.dark.set(false);
  router.push('/login');
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row justify-between">
        <div>
          <q-btn
            flat
            dense
            icon="settings"
            label="setting"
            @click="router.push('/settings')"
            v-if="route.path == '/'"
          />
          <q-btn flat dense icon="home" label="Dashboard" @click="router.push('/')" v-else />
        </div>
        <div v-if="!$q.screen.xs">
          <q-toolbar-title align="center" v-if="route.path == '/'"> Dashboard </q-toolbar-title>
          <q-toolbar-title align="center" v-else> Settings </q-toolbar-title>
        </div>
        <div>
          <q-btn
            flat
            dense
            icon="logout"
            label="logout"
            @click="logoutFunction"
            v-if="route.path !== '/settings'"
          />
          <div class="Aligning" v-if="!$q.screen.xs && route.path == '/settings'"></div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
.Aligning {
  width: 150px;
  height: 50px;
}
</style>
