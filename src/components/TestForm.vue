<template>
  <div>
    <div>
      <FormRenderer :form-configuration="formData" v-model="tempData" />
    </div>
  </div>
</template>

<script>
import { FormRenderer } from "v-form-builder";
import { formData } from "../../public/data";
export default {
  name: "TestForm",
  created() {
    // console.log(formData);
  },
  data() {
    return { tempData: null };
  },
  components: {
    FormRenderer,
  },
};
</script>