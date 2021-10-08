<template>
  <div id="app">
    <div v-if="isTest">
      {{ template.name }}

      <FormRenderer
        v-if="currentSection == 0"
        :key="sections[currentSection].uniqueId"
        :class="{ 'col-md-9': isShowData, 'col-md-12': !isShowData }"
        :form-configuration="template.formData"
        v-model="tempData"
      />
      <FormRenderer
        v-if="currentSection == 1"
        :key="sections[currentSection].uniqueId"
        :class="{ 'col-md-9': isShowData, 'col-md-12': !isShowData }"
        :form-configuration="template.formData"
        v-model="tempData"
      />
    </div>
    <div v-else>
      <h1 class="text-center mt-2">
        Vue-Form-Builder @ v2.1.0 - Development-Preview
      </h1>
      <p class="text-center">
        Presented by <strong>Seth (Sandaru) Phat</strong>
      </p>
      <h4 class="text-center mb-3">
        What you <strong>BUILD</strong> is what you <strong>GOT</strong>.
      </h4>

      <div class="col-md-12">
        <button class="btn btn-info mr-2" @click="getData">
          Get JSON Form-Data (Console / Builder)
        </button>
        <button class="btn btn-info mr-2" @click="setData">
          Set JSON Form-Data (Basic Configuration / Builder)
        </button>
        <button class="btn btn-info mr-2" @click="createBlank">
          Create Blank Form (Builder)
        </button>

        <button class="btn btn-info mr-2" @click="viewRenderer">
          <span v-show="isRenderer"> Back to Builder </span>
          <span v-show="!isRenderer">
            View Renderer Form from Basic Configuration
          </span>
        </button>
      </div>

      <hr />

      <FormBuilder v-if="!isRenderer" v-model="formData"></FormBuilder>

      <div class="row" v-if="isRenderer" style="padding: 20px; margin-right: 0">
        <div class="col-md-12 mb-4">
          <button
            class="btn btn-success mr-2"
            @click="isShowData = !isShowData"
          >
            <span v-show="isShowData">Hide Form Data</span>
            <span v-show="!isShowData">Show Form Data</span>
          </button>

          <button class="btn btn-info mr-2" @click="setRandomData">
            Set Random Data
          </button>
        </div>

        <FormRenderer
          :class="{ 'col-md-9': isShowData, 'col-md-12': !isShowData }"
          :form-configuration="formData"
          v-model="formInputData"
        />

        <div
          class="p-0"
          :class="{ 'col-md-3': isShowData, 'd-none': !isShowData }"
        >
          <h4>Form Input Data</h4>
          <pre
            class="code"
          ><code class="code" v-html="JSON.stringify(formInputData, null, 2)"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * NOTE - This file only exists for development purpose.
 */
import FormBuilder from "@/components/FormBuilder";
import FormRenderer from "@/components/FormRenderer";
import template from "../public/data";

// import { DEMO_FORM_DATA } from "@/demo-form-data";
export default {
  components: {
    FormBuilder,
    FormRenderer,
  },
  data: () => ({
    tempData: null,
    template: template,
    isTest: true,
    isShowDevNote: false,
    isRenderer: false,
    formInputData: null,
    isShowData: false,
    currentSection: 0,
    controls: {},
    sections: {},
  }),
  destroyed() {
    this.$formEvent.$off("checkEligible");
  },
  created() {
    // storing sections
    let tempSections = this.template.formData.sections;
    this.sections = Object.keys(tempSections)
      .map((key) => {
        return tempSections[key];
      })
      .sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
    // storing controls
    this.controls = this.template.formData.controls;
    this.setSection();
    console.log("This form Data: ", this.template.formData);
    this.$formEvent.$on("checkEligible", (payLoad) => {
      console.log("checkEligible: ", payLoad, this.tempData);
      if (this.currentSection === 0) {
        this.currentSection += 1;
        this.setSection();
      }
    });

    this.$formEvent.$on("checkPersonal", (payLoad) => {
      console.log("checkPersonal: ", payLoad, this.tempData);

      let keys = Object.keys(this.tempData);
      keys.map((x) => {
        if (this.tempData[x] === "" || this.tempData[x] === 0) {
        } else {
          this.formInputData[x] = this.tempData[x];
        }
      });
      // this.currentSection += 1;
      // this.setSection();
    });
    this.$formEvent.$on("checkEducational", (payLoad) => {
      let keys = Object.keys(this.tempData);
      keys.map((x) => {
        if (this.tempData[x] === "" || this.tempData[x] === 0) {
        } else {
          this.formInputData[x] = this.tempData[x];
        }
      });
      console.log(this.formInputData);
    });
  },
  mounted() {},
  methods: {
    setSection() {
      let test = {};
      test[this.sections[this.currentSection].uniqueId] =
        this.sections[this.currentSection];
      this.template.formData.sections = test;
      this.setContorls();
    },
    setContorls() {
      this.template.formData.controls = Object.keys(this.controls)
        .filter((key) =>
          this.sections[this.currentSection].controls.includes(key)
        )
        .reduce((obj, key) => {
          obj[key] = this.controls[key];
          return obj;
        }, {});
      this.$forceUpdate();
    },

    validateEligibility(userData) {
      console.log(userData);
      if (
        userData.eliGraduationDegree === "None of the above" ||
        userData.eliPostGraduationDegree === "None of the above" ||
        userData.eliGraduationYear === "None of the above" ||
        userData.eliPostGraduationYear === "None of the above"
      ) {
        //console.log("not eligible");
        return false;
      } else if (
        userData.eliGraduationDegree === "" ||
        userData.eliPostGraduationDegree === "" ||
        userData.eliGraduationYear === "" ||
        userData.eliPostGraduationYear === ""
      ) {
        return false;
      } else {
        console.log("Eligible");
        return true;
      }
    },
  },
};
</script>

<style scoped>
pre {
  background: #333;
  white-space: pre;
  word-wrap: break-word;
  overflow: auto;
}

pre.code {
  margin: 20px 0;
  border-radius: 4px;
  border: 1px solid #292929;
  position: relative;
}

pre.code code {
  display: block;
  padding: 15px 16px 14px;
  border-left: 1px solid #555;
  overflow-x: auto;
  font-size: 13px;
  line-height: 19px;
  color: #ddd;
}
</style>
