<template>
  <div class="w-full">
    <div v-if="image" class="w-full">
      <vue-cropper
        ref="cropperRef"
        :src="image"
        :aspectRatio="1/1"
        :initialAspectRatio="1/1"
        :view-mode="1"
        :drag-mode="'move'"
        :guides="true"
        :center="true"
        :highlight="true"
        :background="true"
        :auto-crop="true"
        :auto-crop-area="0.8"
        :movable="true"
        :rotatable="true"
        :scalable="true"
        :zoomable="true"
        :img-style="{ 'width': '100%', 'height': 'auto' }"
        :crop-box-movable="true"
        :crop-box-resizable="true"
        class="w-full h-[400px]"
      />
      
      <div class="controls mt-4 flex flex-wrap justify-center gap-2">
        <button 
          @click="rotate(-90)" 
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          title="Rotate left"
        >
          <RotateCcwIcon class="h-5 w-5 text-gray-700" />
        </button>
        <button 
          @click="rotate(90)" 
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          title="Rotate right"
        >
          <RotateCwIcon class="h-5 w-5 text-gray-700" />
        </button>
        <button 
          @click="zoom(0.1)" 
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          title="Zoom in"
        >
          <ZoomInIcon class="h-5 w-5 text-gray-700" />
        </button>
        <button 
          @click="zoom(-0.1)" 
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          title="Zoom out"
        >
          <ZoomOutIcon class="h-5 w-5 text-gray-700" />
        </button>
        <button 
          @click="reset" 
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
          title="Reset"
        >
          <RefreshCwIcon class="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      <div class="mt-4 flex justify-between">
        <button 
          @click="$emit('cancel')" 
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          {{ $t('diagnosis.crop.cancel') }}
        </button>
        <button 
          @click="crop" 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ $t('diagnosis.crop.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { 
  RotateCcw as RotateCcwIcon, 
  RotateCw as RotateCwIcon, 
  ZoomIn as ZoomInIcon, 
  ZoomOut as ZoomOutIcon, 
  RefreshCw as RefreshCwIcon 
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  image: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['crop', 'cancel']);

const cropperRef = ref(null);

const rotate = (degree) => {
  if (cropperRef.value && cropperRef.value.cropper) {
    cropperRef.value.cropper.rotate(degree);
  }
};

const zoom = (ratio) => {
  if (cropperRef.value && cropperRef.value.cropper) {
    cropperRef.value.cropper.zoom(ratio);
  }
};

const reset = () => {
  if (cropperRef.value && cropperRef.value.cropper) {
    cropperRef.value.cropper.reset();
  }
};

const crop = () => {
  if (cropperRef.value && cropperRef.value.cropper) {
    const canvas = cropperRef.value.cropper.getCroppedCanvas();
    if (canvas) {
      const croppedImage = canvas.toDataURL('image/jpeg');
      emit('crop', croppedImage);
    }
  }
};

onMounted(() => {
  if (cropperRef.value && !cropperRef.value.cropper) {
    console.error("Cropper instance not initialized properly.");
  }
});
</script>
