<script setup>
const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
            <slot name="header">復元</slot>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button"
                    @click="$emit('cancel')">
              Cancel
            </button>
            <button class="modal-default-button"
                    @click="$emit('close')">
              OK
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
   .modal-mask {
     position: fixed;
     z-index: 9998;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, 0.5);
     display: flex;
     transition: opacity 0.3s ease;
   }

  .modal-container {
    width: 100dvh;
    height: 100dvh;
    color: var(--color-text);
    background: var(--color-background);
    margin: auto;
    padding: 20px 30px;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    overflow: auto;
  }

   .modal-header h3 {
     margin-top: 0;
   }

   .modal-body {
     margin: 20px 0;
   }

   .modal-default-button {
     margin-left: 1em;
     float: right;
   }

   /*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

   .modal-enter-from {
     opacity: 0;
   }

   .modal-leave-to {
     opacity: 0;
   }

     .modal-enter-from .modal-container,
     .modal-leave-to .modal-container {
       -webkit-transform: scale(1.1);
       transform: scale(1.1);
     }
</style>
