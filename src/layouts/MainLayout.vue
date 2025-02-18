<script setup>
import { useQuasar } from 'quasar';
// import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
/////////////////////Default
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Log Out And Disable dark mode
function logoutFunction() {
  localStorage.removeItem('id');
  $q.dark.set(false);
  router.push('/login');
}

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
          <div class="Aligning" v-if="!$q.screen.xs && route.path == '/settings' "></div>
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
