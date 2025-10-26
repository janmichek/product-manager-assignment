import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { Quasar} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './assets/tailwind.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(PiniaColada)
app.use(router)
app.use(Quasar, {
  config: {
    brand: {
      primary: '#667eea',
      secondary: '#764ba2',
    }
  },
})

app.mount('#app')
