import './assets/main.css'
import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { createApp } from 'vue'
import App from './App.vue'

var vuetify = createVuetify(
  {
    theme: {
      defaultTheme: 'dark'
    }
  }
  )
createApp(App).use(vuetify).mount('#app')