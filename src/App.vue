<template>
  <v-app>
    <div class="w-4/5 m-auto flex flex-column gap-y-5 mt-5 h-4/5">
      
      <!-- Ошибка -->
      <div v-if = "showError" class="flex flex-row gap-x-5">
        <v-alert
                 :text="errorText"
                 close-label="Close Alert"
                 title="Ошибка"
                 color="#8B0000"
                 v-model="showError"
                 closable>
        </v-alert>
      </div>
      
      <!-- Выбор получателя -->
      <div class="flex flex-row gap-x-5">
        <v-select clearable label="Адресат" :items="selectUsers" item-value="userId" item-title="userName"
                  v-model="selectedUser" :hide-details="true">
        </v-select>
      </div>
      
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
          <VueDatePicker v-model="dateRange" :range="true"  :enable-time-picker="false" />
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

          <!-- Каждый интервал (минут, часов)-->
          <div class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждые:</h3>
            <v-text-field hide-details single-line type="number" min="1" v-model="numberInterval"></v-text-field>
          </div>

        </div>

        <div v-if="selectedInterval === Intervals.Days" class="flex flex-column gap-y-5">
          
        <!-- Повторять каждые дни -->
        <v-radio-group v-model="selectedDaysRepeatType" :hide-details="true">
          <v-radio v-for="(repeatType) in daysRepeatTypes" :key="repeatType.daysRepeatType" :label="repeatType.text" 
                   :value="repeatType.daysRepeatType">
          </v-radio>
        </v-radio-group>

        <!-- Каждый интервал (дней)-->
          <div v-if="selectedDaysRepeatType === DaysRepeatType.EveryDay" class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждые:</h3>
            <v-text-field hide-details single-line type="number" min="1" v-model="numberInterval"></v-text-field>
<!--            <v-text-field single-line type="number" min="1" error-messages="errors" v-model="numberInterval"></v-text-field>-->
          </div>

          <!-- Выбор дня недели -->
          <v-select v-if="selectedDaysRepeatType === DaysRepeatType.ExactDays"
                    :items="selectWeekDays" item-value="weekDayType" item-title="text"
                    label="День недели" v-model="selectedWeekDays" :hide-details="true" chips multiple>
          </v-select>

          <!-- Выбор числа -->
          <v-select v-if="selectedDaysRepeatType === DaysRepeatType.ExactDays"
                    :items="selectNumberDays" item-value="dayNumber" item-title="text"
                    label="Числа" v-model="selectedDays" :hide-details="true" chips multiple>
          </v-select>
          
        </div>

        <div v-if="selectedInterval === Intervals.Months" class="flex flex-column gap-y-5">

          <v-radio-group v-model="selectedMonthsRepeatType" :hide-details="true">
            <v-radio v-for="(repeatType) in monthsRepeatTypes" :key="repeatType.monthsRepeatType" :label="repeatType.text"
                     :value="repeatType.monthsRepeatType">
            </v-radio>
          </v-radio-group>
          
          <!-- Каждый интервал (месяцев) -->
          <div v-if="selectedMonthsRepeatType === MonthsRepeatType.EveryMonth" class="flex flex-row gap-x-5">
            <h3 class="m-auto">Каждые:</h3>
            <v-text-field hide-details single-line type="number" min="1" v-model="numberInterval"></v-text-field>
          </div>
          
          <!-- Выбор месяца -->
          <v-select v-if="selectedMonthsRepeatType === MonthsRepeatType.ExactMonths"
                    :items="selectMonths" item-value="monthType" item-title="text"
                    label="Месяц" v-model="selectedMonth" :hide-details="true" chips multiple>
          </v-select>
          
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

      <div v-if="selectedInterval === Intervals.Days || selectedInterval === Intervals.Months ||
       selectedInterval === Intervals.Years"
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

        <VueDatePicker placeholder="Добавить время" v-model="addingTime" @update:model-value="addTime()" time-picker />
      </div>

      <!-- Текст задачи -->
      <v-textarea clearable label="Задача" variant="solo-inverted" v-model="notificationText"></v-textarea>

      <v-btn v-if="selectedNotificationType === NotificationType.Single" @click="CreateSingleNotification()">Отправить</v-btn>
      <v-btn v-if="selectedNotificationType === NotificationType.Repeatable" @click="CreateMultipleNotification()">Отправить</v-btn>
    </div>

  </v-app>
</template>

<script setup>
import { VSelect } from 'vuetify/components/VSelect'
import { VAlert } from 'vuetify/components/VAlert'
//import { VTextarea } from 'vuetify/components/VTextArea' //локал
import { VTextarea } from 'vuetify/components/VTextarea' //Prod


import { VTextField } from 'vuetify/components/VTextField'
import { VRadioGroup } from 'vuetify/components/VRadioGroup'
import { VRadio } from 'vuetify/components/VRadio'


import { VList } from 'vuetify/components/VList'
import { VListItem } from 'vuetify/components/VList'
import { VListItemAction } from 'vuetify/components/VList'
import { VListItemTitle } from 'vuetify/components/VList'
import { VBtn } from 'vuetify/components/VBtn'
import { VApp } from 'vuetify/components/VApp'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref, onBeforeMount, watch} from 'vue';

import axios from 'axios';
import { Intervals } from '@/enums/IntervalEnum.js';
import { NotificationType } from '@/enums/NotificationTypeEnum.js';
import { DaysRepeatType } from '@/enums/DaysRepeatTypeEnum.js';
import { MonthsRepeatType } from '@/enums/MonthsRepeatTypeEnum.js';
import {ErrorEnum, GetErrorText} from "@/enums/ErrorEnum.js";


// Адресаты для выбора
const selectUsers = ref();
// Выбранный адресат
const selectedUser = ref();


// Типы уведомления для выбора
const selectNotificationTypes = ref();
// Выбранный тип уведомления
const selectedNotificationType = ref();


// Даты выбранные для одиночного исполнения
const singleDates = ref();


// Даты выбранные для повторяющегося исполнения (массив из начальной и конечной дат)
const dateRange = ref([]);


// Интервалы для выбора
const selectIntervals = ref();
// Выбранный интервал
const selectedInterval = ref();

// Дата с которой (время) начинаю работать уведомления (для минут, часов)
const dateFrom = ref();

// Типы повторения для дней для радио 
const daysRepeatTypes = ref();
// Выбранный тип повторения для дней
const selectedDaysRepeatType = ref();

// Дни для выбора
const selectNumberDays = ref();
// Выбранные дни (числа)
const selectedDays = ref();

// Дни недели для выбора
const selectWeekDays = ref();
// Выбранные дни недели
const selectedWeekDays = ref();


// Типы повторения для месяцев для радио 
const monthsRepeatTypes = ref();
// Выбранный тип повторения для месяцев
const selectedMonthsRepeatType = ref();

// Месяцы для выбора
const selectMonths = ref();
// Выбранный месяц
const selectedMonth = ref();

// Список времён исполнения, которые выбирают (для дней, месяцев)
const times = ref([]);
// Время исполнения, которое выбирают (для дней, месяцев)
const addingTime = ref();

// Через интервал (минут, часов, дней, месяцев, лет)
const numberInterval = ref(1);

// Текст уведомления
const notificationText = ref();


// Telegram app
const webApp = window.Telegram.WebApp;

// Backend url
const hostUrl = ref("http://localhost:8080");
const showError = ref(false);
const errorText = ref();

const errors = new Set();

onBeforeMount(async () => {
  await GetDefaultInfos()
})

const addTime = () => {
  if (addingTime.value) {
    times.value.push(addingTime.value.hours + ":" + addingTime.value.minutes);
  }
  addingTime.value = null;
};

const removeTime = (index) => {
  times.value.splice(index, 1);
};

const CreateSingleNotification = async () => {
  if (!notificationText.value || notificationText.value.trim().length === 0)
    AddError(ErrorEnum.EmptyText)
  
  let data = {
    text: notificationText.value,
    dates: singleDates.value,
    initData: webApp.initData,
    receiverId: selectedUser.value
  };

  await axios.post(hostUrl.value + '/notification/create-single-notification', data)
     .then(response => {
       webApp.close()
     })
  .catch(function (error) {
    console.log(error)
    errorText.value = error.response.data.title
    showError.value = true
  });
};

const CreateMultipleNotification = async () => {
  
  if (!notificationText.value || notificationText.value.trim().length === 0)
    AddError(ErrorEnum.EmptyText)

  if (dateRange.value[1] && dateRange.value[1] <= new Date())
    AddError(ErrorEnum.EndDateIsLowerTanCurrent)

  if (numberInterval.value < 1)
    AddError(ErrorEnum.IntervalIsNegative)
  
  UpdateError()

  let data = {
    initData: webApp.initData,
    baseInfo: {
      text: notificationText.value,
      receiverId: selectedUser.value,
      startDate: dateRange.value[0],
      endDate: dateRange.value[1],
      intervalType: selectedInterval.value
    },
  };

  if (selectedInterval.value === Intervals.Minutes)
    data.minuteRepeatInfo = {
      numberInterval: numberInterval.value,
      startTime: {hour: dateFrom.value.hours, minute: dateFrom.value.minutes},
    }
  else if (selectedInterval.value === Intervals.Hours)
    data.hourRepeatInfo = {
      numberInterval: numberInterval.value,
      startTime: {hour: dateFrom.value.hours, minute: dateFrom.value.minutes},
    }
  else if (selectedInterval.value === Intervals.Days)
    data.dayRepeatInfo = {
      numberInterval: numberInterval.value,
      daysRepeatType: selectedDaysRepeatType.value,
      daysToRepeat: selectedDays.value,
      weekDaysToRepeat: selectedWeekDays.value,
      dayTimesToRepeat: times.value,
    }

  await axios.post(hostUrl.value + '/notification/create-repeatable-notification', data)
      .then(response => {
        webApp.close()
      })
      .catch(function (error) {

        errorText.value = (error.response.data.errors.BaseInfo ?? []).join("\n") +
            error.response.data.errors.MinuteRepeatInfo.join("\n") +
            error.response.data.errors.HourRepeatInfo.join("\n") +
            error.response.data.errors.DayRepeatInfo.join("\n")
        showError.value = true
      });
};

const AddError = (error) => {
  errors.add(error)
}

const UpdateError = () => {
  console.log(errors)
  
  if(errors.size === 0){
    errorText.value = ""
    showError.value = false
    return
  }
  
  let errorStr = "";
  errors.forEach((value, key, set) => {
    errorStr += GetErrorText(value) + '; '
  });
  errorText.value = errorStr
  showError.value = true
}

// Стёрт текст задачи
watch(notificationText, (newValue) => {
  if (errors.has(ErrorEnum.EmptyText) && newValue && newValue.trim().length !== 0) {
    errors.delete(ErrorEnum.EmptyText)
    UpdateError()
    return
  }
  
  if(!newValue || newValue.trim().length === 0) {
    AddError(ErrorEnum.EmptyText);
    UpdateError()
  }
})

// Дата окончания промежутка меньше текущей даты
watch(dateRange, (newValue) => {
  let currentDate = new Date()
  if (errors.has(ErrorEnum.EndDateIsLowerTanCurrent) && (!newValue[1] || currentDate < newValue[1])) {
    errors.delete(ErrorEnum.EndDateIsLowerTanCurrent)
    UpdateError()
    return
  }
  
  if (newValue[1] && newValue[1] <= currentDate) {
    AddError(ErrorEnum.EndDateIsLowerTanCurrent)
    UpdateError()
  }
})

// Интервал повторения отрицательный
watch(numberInterval, (newValue) => {

  if (errors.has(ErrorEnum.IntervalIsNegative) && (newValue >= 1)) {
    errors.delete(ErrorEnum.IntervalIsNegative)
    UpdateError()
    return
  }

  if (newValue < 1) {
    AddError(ErrorEnum.IntervalIsNegative)
    UpdateError()
  }
})

const GetDefaultInfos = async () => {

 await axios.get(hostUrl.value + '/notification/default-fields')
    .then(response => {
      
      selectUsers.value = response.data.users
      selectedUser.value = response.data.users[0].userId

      selectNotificationTypes.value = response.data.notificationTypes
      selectedNotificationType.value = response.data.notificationTypes[0].notificationType
      
      selectIntervals.value = response.data.intervals
      selectedInterval.value = response.data.intervals[0].intervalType
      
      daysRepeatTypes.value = response.data.daysRepeatTypes
      selectedDaysRepeatType.value = response.data.daysRepeatTypes[0].daysRepeatType

      monthsRepeatTypes.value = response.data.monthsRepeatTypes
      selectedMonthsRepeatType.value = response.data.monthsRepeatTypes[0].monthsRepeatType
      
      selectWeekDays.value = response.data.weekDays
      selectNumberDays.value = response.data.numberDays
      selectMonths.value = response.data.months
      
      
      // Локальная дата
      const date = new Date(response.data.initialDate)
      console.error(response.data.initialDate);
      console.error(date);

      singleDates.value = [date]
      
      dateFrom.value = { 
        hours: date.getHours(),
        minutes: date.getMinutes()
      }
      
      dateRange.value = [date, null]
    })
    .catch(error => {
      console.error(error);
    });

};