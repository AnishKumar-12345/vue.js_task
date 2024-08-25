<template>

  <TaskList />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import TaskList from '../components/TaskList.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    TaskList,
  },
});
</script>
