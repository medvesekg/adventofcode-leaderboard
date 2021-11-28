<template>
  <div class="flex flex-col">
    <label  class="mt-3 inline-flex items-center cursor-pointer" @click="toggle">
      <span class="relative">
        <span class="block w-10 h-6 bg-gray-400 rounded-full shadow-inner"></span>
        <span class="absolute block w-4 h-4 mt-1 ml-1 rounded-full shadow inset-y-0 left-0 focus-within:shadow-outline transition-transform duration-300 ease-in-out" :class="classes">
     
        </span>
      </span>
      <span class="ml-3 text-sm">
        <slot/>
      </span>
    </label>
  </div>
</template>

<script>
export default {

  props: {
    modelValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      value: this.modelValue
    }
  },

  watch: {
    modelValue: {
      handler: function(newValue) {
        this.value = newValue
      }
    }
  },

  computed: {
    classes() {
      if(this.value) {
        return 'bg-purple-600 transform translate-x-full'
      }
      return 'bg-white'
    },
  },

  methods: {
    toggle() {
      this.value = !this.value
      this.$emit('update:modelValue', this.value)
    }
  }
}
</script>

<style>

</style>