<template>
  <v-app>
    <div class="w-4/5 m-auto flex flex-column gap-y-5 mt-5 h-4/5">

      <!-- Выбор типа уведомления -->
      <div class="flex flex-row gap-x-5">
        <v-select clearable label="Тип уведомления" :items="selectNotificationTypes" item-value="notificationType" item-title="text"
          v-model="selectedNotificationType" :hide-details="true">
        </v-select>
      </div>

      <!-- Одиночное уведомление -->
      <div v-if="selectedNotificationType === NotificationType.Single" class="flex flex-row gap-x-5">
        <h3 class="m-auto">Дата:</h3>
        <VueDatePicker v-model="singleDates" multi-dates />
      </div>

      <!-- Повторяющееся уведомление -->
      <div v-if="selectedNotificationType === NotificationType.Repeatable" class="flex flex-column gap-y-5">

        <div class="flex flex-row gap-x-5">
          <h3 class="m-auto">Даты:</h3>
          <VueDatePicker v-model="dateRange" :range="true" :enable-time-picker="false" />
        </div>

        <!-- Выбор типа интервала недели -->
        <v-select clearable label="Тип" :items="selectIntervals" item-value="intervalType" item-title="text"
          v-model="selectedInterval" :hide-details="true">
        </v-select>

        <div v-if="selectedInterval === Intervals.Minutes || selectedInterval === Intervals.Hours"
          class="flex flex-column gap-y-5">

          <!-- Начальное время -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">Начальное&nbsp;время:</h3>
            <VueDatePicker v-model="dateFrom" time-picker />
          </div>

          <!-- Каждый интервал -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждые:</h3>
            <v-text-field hide-details single-line type="number" v-model="numberInterval"></v-text-field>
          </div>

        </div>

        <!-- Повторять каждые дни -->
        <v-radio-group v-if="selectedInterval === Intervals.Days" v-model="chosenRadio" :hide-details="true">
          <v-radio v-for="(repeatType) in daysRepeatTypes" :key="repeatType.daysRepeatType" :label="repeatType.text" :value="repeatType.daysRepeatType">
          </v-radio>
        </v-radio-group>

        <!-- Выбор дня недели -->
        <v-select v-if="selectedInterval === Intervals.Weeks" :items="selectWeekDays" item-value="weekDayType" item-title="text"
          label="День" v-model="selectedWeekDays" :hide-details="true" chips multiple>
        </v-select>

        <div v-if="selectedInterval === Intervals.Months" class="flex flex-column gap-y-5">

          <!-- Каждый интервал месяцев -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждые:</h3>
            <v-select clearable :items="[1, 2, 3, 4, 6]" v-model="dest" :hide-details="true"></v-select>
          </div>

          <!-- Номер дня месяца -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">День:</h3>
            <v-text-field hide-details single-line type="number" v-model="numberInterval"></v-text-field>
          </div>

        </div>

        <div v-if="selectedInterval === Intervals.Years" class="flex flex-column gap-y-5">

          <!-- Каждые месяцы -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждый:</h3>
            <v-select :items="selectMonths" item-value="monthType" item-title="text" 
              v-model="selectedMonth" :hide-details="true" clearable>
            </v-select>
          </div>
          
          <!-- Номер дня месяца -->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">День:</h3>
            <v-text-field hide-details single-line type="number" v-model="numberInterval"></v-text-field>
          </div>

        </div>
        
      </div>

      <div v-if="selectedInterval === Intervals.Days || selectedInterval === Intervals.Weeks ||
        selectedInterval === Intervals.Months || selectedInterval === Intervals.Years"
        class="flex flex-column gap-y-5">
        <v-list v-if="times.length">
          <v-list-item class="flex flex-row gap-x-5" v-for="(time, index) in times" :key="index">
            <div class="flex flex-row gap-x-5">
              <v-list-item-title class="m-auto">{{ time }}</v-list-item-title>
              <v-list-item-action>
                <v-btn @click="removeTime(index)">Удалить</v-btn>
              </v-list-item-action>
            </div>
          </v-list-item>
        </v-list>

        <VueDatePicker placeholder="Добавить время" v-model="selectedTime" @update:model-value="addTime()" time-picker />
      </div>

      <!-- Текст задачи -->
      <v-textarea clearable label="Задача" variant="solo-inverted" v-model="notificationText"></v-textarea>

      <v-btn @click="CreateSingleNotification()">Отправить</v-btn>
      <v-btn @click="s()">2</v-btn>

      <!-- <v-bottom-navigation v-model="value">
    <v-btn value="recent">
      <span>Recent</span>

      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn value="favorites">
      <span>Favorites</span>

      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn value="nearby">
      <span>Nearby</span>

      <v-icon>mdi-map-marker</v-icon>
    </v-btn> -->
      <!-- </v-bottom-navigation> -->
    </div>

  </v-app>
</template>

<script setup>
import { VSelect } from 'vuetify/components/VSelect'
import { VTextarea } from 'vuetify/components/VTextArea'


import { VTextField } from 'vuetify/components/VTextField'
import { VRadioGroup } from 'vuetify/components/VRadioGroup'
import { VRadio } from 'vuetify/components/VRadio'


import { VList } from 'vuetify/components/VList'
import { VListItem } from 'vuetify/components/VList'
import { VListItemAction } from 'vuetify/components/VList'
import { VListItemTitle } from 'vuetify/components/VList'
import { VBtn } from 'vuetify/components/VBtn'
import { VIcon } from 'vuetify/components/VIcon'
import { VBottomNavigation } from 'vuetify/components/VBottomNavigation'
import { VAppBar } from 'vuetify/components/VAppBar'
import { VApp } from 'vuetify/components/VApp'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref, onMounted } from 'vue';

import axios from 'axios';
import { Intervals } from '@/enums/IntervalEnum.js';
import { NotificationType } from '@/enums/NotificationTypeEnum.js';

const dateRange = ref();
// Даты выбранные для одиночного исполнения
const singleDates = ref();

// Типы уведомления для выбора
const selectNotificationTypes = ref();
// Выбранный тип уведомления
const selectedNotificationType = ref();


const dest = ref('Минут');


// Интервалы для выбора
const selectIntervals = ref();
// Выбранный интервал
const selectedInterval = ref('Минуты');


// Типы повторения для дней для радио 
const daysRepeatTypes = ref();
// Выбранный тип повторения для дней
const chosenRadio = ref();


// Дни недели для выбора
const selectWeekDays = ref();
// Выбранные дни недели
const selectedWeekDays = ref();


const selectMonths = ref();
// Выбранный месяц
const selectedMonth = ref();


// Дата с которой (время) начинаю работать уведомления
const dateFrom = ref();
// Через интервал
const numberInterval = ref(4);


// Текст уведомления
const notificationText = ref("Текст");


const times = ref([]);
const selectedTime = ref(null);


const selectUsers = ref();
const receiverUserId = ref();
const hostUrl = ref("http://localhost:8080");



onMounted(async () => {
  await GetDefaultInfos()
  var WebApp = window.Telegram.WebApp;

  WebApp.showAlert(`Добро пожаловать, @${WebApp.WebAppUser.username}.`);
})

const addTime = () => {
  console.log(1)
  if (selectedTime.value) {
    times.value.push(selectedTime.value.hours + ":" + selectedTime.value.minutes);
  }
  selectedTime.value = null;
};

const removeTime = (index) => {
  times.value.splice(index, 1);
};

const CreateSingleNotification = async () => {

var data = {
    text: notificationText.value,
    dates: singleDates.value,
    creatorId: 454,
    receiverId: 454
  };

 await axios.post(hostUrl.value + '/notification/create-single-notification', data)
  .catch(function (error) {
    console.log(error);
  });
};


const GetDefaultInfos = async () => {

 await axios.get(hostUrl.value + '/notification/default-fields')
    .then(response => {
      //selectUsers.value = response.data.notificationTypes
      
      selectNotificationTypes.value = response.data.notificationTypes
      selectIntervals.value = response.data.intervals
      daysRepeatTypes.value = response.data.daysRepeatTypes
      selectWeekDays.value = response.data.weekDays
      selectMonths.value = response.data.months

      const date = new Date(response.data.initialDate)
      dateFrom.value = { 
        hours: date.getHours(),
        minutes: date.getMinutes()
      }
    })
    .catch(error => {
      console.error(error);
    });

};

const Send = async () => {

  const data = {
  key1: 'value1',
  key2: 'value2'
};

  await axios.get(hostUrl.value + '/notification/default-fields', data)
    .catch(error => {
      console.error(error);
    });
};
</script>
