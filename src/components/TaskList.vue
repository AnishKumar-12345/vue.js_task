<template>
  <v-container style="background-color:#4E4F50;">
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <!-- Add Task Details -->
        <v-btn @click="addTasks()" color="primary">Add Task</v-btn> <br />
        <br />
       
            <v-spacer></v-spacer>

        <!-- A Search bar  -->

        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
      </v-card-title>

      <v-divider></v-divider>
      <!-- Datatable for view tasks -->
      <v-data-table
        :headers="headers"
        :items="tasks"
        density="compact"
        item-key="id"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.completed="{ item }">
          <v-checkbox
            v-model="item.completed"
            @change="selecttaskcompletion(item)"
          />
        </template>
        <template v-slot:item.action="{ item }">
          <v-icon medium color="primary" @click="opendialog(item)">
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog For edit tasks -->
    <v-dialog max-width="500" v-model="dialog" persistent>
      <v-card title="Edit Task">
        <v-card-text>
          <v-form ref="form" @submit.prevent="saveTask">
            <v-text-field
              v-model="editTask.task_title"
              label="Title"
              required
            ></v-text-field>
            <v-textarea
              v-model="editTask.description"
              label="Description"
              rows="3"
              required
            ></v-textarea>
            <v-text-field
              v-model="editTask.due_date"
              label="Due Date"
              type="date"
              required
            ></v-text-field>
            <v-checkbox
              v-model="editTask.completed"
              label="Click For Completed Task"
            />
            <v-btn type="submit" color="primary">Save</v-btn>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <v-btn @click="Closedialog" color="warning">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Dialog for Add Tasks -->
    <v-dialog max-width="500" v-model="dialog2" persistent>
      <v-card title="Add Task">
        <v-card-text>
          <v-form ref="form" @submit.prevent="addTaskdata">
            <v-text-field
              v-model="addTask.task_title"
              label="Title"
              required
            ></v-text-field>
            <v-textarea
              v-model="addTask.description"
              label="Description"
              rows="3"
              required
            ></v-textarea>
            <v-text-field
              v-model="addTask.due_date"
              label="Due Date"
              type="date"
              required
            ></v-text-field>
            <!-- <v-checkbox v-model="editTask.completed" label="Click For Completed Task" /> -->
            <v-btn type="submit" color="primary">Save</v-btn>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <v-btn @click="Closedialog2" color="warning">Close</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- snackbar for success and error messages -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      color="success"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { useTaskstore } from "../store/tasks";
import { ref, onMounted } from "vue";
export default {
  data: () => ({
    search: "",
  }),
  setup() {
    const taskStoredata = useTaskstore();
    const editTask = ref(null);
    const dialog = ref(false);
    const dialog2 = ref(false);
    const addTask = ref({
      task_title: "",
      description: "",
      due_date: "",
      id: "",
    });

    const snackbar = ref({
      show: false,
      message: "",
      timeout: 3000,
    });

    onMounted(() => {
      taskStoredata.getTaskdetails();
    });

    const tasks = taskStoredata.tasks;

    const headers = [
      { title: "Mark Complete/InComplete", key: "completed", sortable: false },
      { title: "ID", key: "id" },
      { title: "Title", key: "task_title" },
      { title: "Description", key: "description" },
      { title: "Due Date", key: "due_date" },
      { title: "Actions", key: "action", sortable: false },
    ];

    const opendialog = (item) => {
      editTask.value = { ...item };
      dialog.value = true;
      console.log('check Items',editTask.value);
    };

    const Closedialog = () => {
      dialog.value = false;
    };

    const Closedialog2 = () => {
      dialog2.value = false;
    };

    const saveTask = () => {
      taskStoredata
        .editTaskdetails(editTask.value.id, editTask.value)
        .then((response) => {
          // console.log('response',response);
          taskStoredata.getTaskdetails();
          dialog.value = false;
          snackbar.value.show = true;
          snackbar.value.message = "Task Updated Successfully";
          window.location.reload();
        })
        .catch((error) => {
          snackbar.value.show = true;
          snackbar.value.message = "Failed to updated Task";
        });
    };
    const addTasks = () => {
      dialog2.value = true;
    };

    const addTaskdata = () => {
      taskStoredata
        .addTaskdetails(addTask.value)
        .then((response) => {
          // console.log('response',response);
          // taskStoredata.getTaskdetails();
          dialog2.value = false;
          snackbar.value.show = true;
          snackbar.value.message = "Task Added Successfully";
          window.location.reload();
        })
        .catch((error) => {
          snackbar.value.show = true;
          dialog2.value = false;
          snackbar.value.message = "Failed to Add Task";
        });
    };

    const selecttaskcompletion = (item) => {
      taskStoredata
        .editTaskdetails(item.id, item)
        .then((response) => {
          // console.log('response',response);
          taskStoredata.getTaskdetails();
          dialog.value = false;
          snackbar.value.show = true;
          snackbar.value.message = "Task Completed Successfully";
          window.location.reload();
        })
        .catch((error) => {
          snackbar.value.show = true;
          snackbar.value.message = "Failed to updated Task";
        });
    };
    return {
      tasks,
      headers,
      editTask,
      dialog,
      dialog2,
      snackbar,
      addTask,
      opendialog,
      Closedialog,
      Closedialog2,
      saveTask,
      selecttaskcompletion,
      addTaskdata,
      addTasks,
    };
  },
};
</script>
<style scoped></style>
